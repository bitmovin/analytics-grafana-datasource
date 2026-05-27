import {
  AdHocVariableFilter,
  CoreApp,
  createDataFrame,
  CustomVariableSupport,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  Field,
  FieldType,
  MetricFindValue,
  QueryResultMetaNotice,
  RawTimeRange,
  ScopedVars,
  SelectableValue,
} from '@grafana/data';
import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import { cloneDeep, filter, isEmpty } from 'lodash';
// eslint-disable-next-line  no-restricted-imports
import moment from 'moment';
import { catchError, from, lastValueFrom, map, Observable, of } from 'rxjs';

import {
  BitmovinAnalyticsDataQuery,
  BitmovinDataSourceOptions,
  DEFAULT_QUERY,
  OldBitmovinAnalyticsDataQuery,
} from './types/grafanaTypes';
import {
  MixedDataRowList,
  NumberDataRowList,
  transformGroupedTimeSeriesData,
  transformSimpleTimeSeries,
  transformTableData,
} from './utils/dataUtils';
import {
  calculateQueryInterval,
  getMomentTimeUnitForQueryInterval,
  getSmallerInterval,
  QueryInterval,
} from './utils/intervalUtils';
import { isMetric, Metric } from './types/metric';
import { AggregationMethod } from './types/aggregationMethod';
import { ProperTypedQueryFilter, QueryFilterOperator } from './types/queryFilter';
import { QueryAttribute, SELECTABLE_QUERY_FILTER_ATTRIBUTES } from './types/queryAttributes';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from './types/queryAdAttributes';
import { QueryOrderBy } from './types/queryOrderBy';
import { convertFilterValueToProperType, isNullFilter } from './utils/filterUtils';
import { VariableQueryEditor } from './components/VariableQueryEditor';
import { BitmovinVariableQuery } from './types/variableQuery';

type BitmovinAnalyticsRequestQuery = {
  licenseKey: string;
  start: Date;
  end: Date;
  filters: ProperTypedQueryFilter[];
  groupBy: Array<QueryAttribute | QueryAdAttribute>;
  orderBy: QueryOrderBy[];
  dimension?: QueryAttribute | QueryAdAttribute;
  metric?: Metric;
  interval?: QueryInterval;
  limit?: number;
  percentile?: number;
};

/**
 * Maps Grafana ad-hoc filter operators to the Bitmovin API filter operators. Operators without a
 * Bitmovin equivalent — notably the multi-value "one of" (`=|`) / "not one of" (`!=|`) variants —
 * are intentionally absent, so filters using them are skipped.
 */
const AD_HOC_OPERATOR_MAP: Record<string, QueryFilterOperator> = {
  '=': 'EQ',
  '!=': 'NE',
  '>': 'GT',
  '<': 'LT',
  '>=': 'GTE',
  '<=': 'LTE',
  '=~': 'CONTAINS',
  '!~': 'NOTCONTAINS',
};

/**
 * Sentinel value for the "(empty)" ad-hoc option used to filter for null/missing values. It must be
 * non-empty because Grafana drops ad-hoc filters whose value is an empty string before they reach
 * the datasource. We map it back to an empty value (i.e. a null "IS NULL" filter) at query time.
 */
export const AD_HOC_NULL_VALUE = '__null__';

export class DataSource extends DataSourceApi<
  BitmovinAnalyticsDataQuery | OldBitmovinAnalyticsDataQuery,
  BitmovinDataSourceOptions
> {
  baseUrl: string;
  apiKey: string;
  tenantOrgId?: string;
  isAdAnalytics?: boolean;

  constructor(instanceSettings: DataSourceInstanceSettings<BitmovinDataSourceOptions>) {
    super(instanceSettings);

    this.apiKey = instanceSettings.jsonData.apiKey;
    this.tenantOrgId = instanceSettings.jsonData.tenantOrgId;
    this.isAdAnalytics = instanceSettings.jsonData.isAdAnalytics;
    this.baseUrl = instanceSettings.url!;

    // Enables "Query" template variables backed by this datasource (see metricFindQuery).
    this.variables = new BitmovinVariableSupport(this);
  }

  getDefaultQuery(_: CoreApp): Partial<BitmovinAnalyticsDataQuery> {
    return DEFAULT_QUERY;
  }

  /**
   * The Bitmovin API Response follows these rules:
   * - If the interval property is provided in the request query, time series data is returned and the first value of each row is a timestamp in milliseconds.
   * - If the groupBy property array is not empty in the request query:
   *    - Depending on whether the interval property is set:
   *      - Interval is set: All values between the first one (timestamp) and the last one (not included) can be considered string values.
   *      - Interval is not set: All values up to the last one (not included) can be considered string values
   * - The last value of each row is always be a number.
   * */
  async query(options: DataQueryRequest<BitmovinAnalyticsDataQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const isRelativeRangeFrom = this.isRelativeRangeFrom(range.raw);
    let momentTimeUnit = undefined;

    //filter disabled queries
    const enabledQueries = (options.targets = filter(options.targets, (t) => !t.hide));

    //filter invalid queries
    const validQueries = filter(enabledQueries, (t) => this.isQueryComplete(t));

    const promises = validQueries.map(async (target) => {
      const interval =
        target.resultFormat === 'time_series' && target.interval
          ? calculateQueryInterval(target.interval, range!.from.valueOf(), range!.to.valueOf())
          : undefined;

      // create new moment object to not mutate the original grafana object with startOf() to not change
      // the grafana graph at this point as this would change the timeframe for all the following queries
      let queryFrom = moment(range!.from.valueOf());
      const queryTo = range!.to;

      // floor the query start time to improve cache hitting
      if (isRelativeRangeFrom) {
        let flooringInterval = calculateQueryInterval('AUTO', queryFrom.valueOf(), queryTo.valueOf());
        if (interval != null) {
          // to allow higher granularity if interval is selected by user
          flooringInterval = getSmallerInterval(interval, flooringInterval);
        }
        momentTimeUnit = getMomentTimeUnitForQueryInterval(flooringInterval);
        if (momentTimeUnit != null) {
          queryFrom.startOf(momentTimeUnit);
        }
      }

      let aggregationMethod: AggregationMethod | undefined = target.metric;
      const percentileValue = aggregationMethod === 'percentile' ? target.percentileValue : undefined;

      let metric: Metric | undefined = undefined;
      let dimension: QueryAttribute | QueryAdAttribute | undefined = undefined;
      if (target.dimension) {
        if (isMetric(target.dimension)) {
          metric = target.dimension as Metric;
        } else {
          dimension = target.dimension as QueryAttribute | QueryAdAttribute;
        }
      }

      const filters: ProperTypedQueryFilter[] = (target.filter ?? [])
        .map((filterEntry) => {
          // Capture the resolved values so we can tell a multi-value variable apart from a plain
          // string. Multi-value variables arrive in the format callback as an array.
          let multiValues: string[] | undefined;
          const interpolatedValue = getTemplateSrv().replace(
            filterEntry.value,
            options.scopedVars,
            (value: string | string[]) => {
              if (Array.isArray(value)) {
                multiValues = value;
                return JSON.stringify(value);
              }
              return value;
            }
          );
          return { filterEntry, interpolatedValue, multiValues };
        })
        // When a multi-value variable is set to "All" with the default all-value, Grafana
        // interpolates to the "$__all" sentinel. Drop the filter so the query matches all data
        // instead of filtering on the literal string. Empty values are intentionally NOT dropped:
        // convertFilterValueToProperType maps them to a null ("IS NULL") filter for the relevant
        // attributes.
        .filter(({ interpolatedValue }) => interpolatedValue !== '$__all')
        .map(({ filterEntry, interpolatedValue, multiValues }) => {
          let value = interpolatedValue;
          // A multi-value variable only has a well-defined meaning for the IN operator. For any
          // other operator we apply just the first selected value so the behaviour is predictable
          // rather than silently empty. The query editor warns the user about this inline.
          if (filterEntry.operator !== 'IN' && multiValues !== undefined) {
            value = multiValues[0] ?? '';
          }
          return {
            name: filterEntry.name,
            operator: filterEntry.operator,
            value: convertFilterValueToProperType(value, filterEntry.name, filterEntry.operator, !!this.isAdAnalytics),
          };
        });

      // Dashboard-wide ad-hoc filters apply to every query against this datasource.
      const adHocFilters = this.resolveAdHocFilters(options);

      // Interpolate the alias so dashboard variables can be used in series names. Fall back to
      // undefined (not '') for an unset alias so Grafana keeps deriving the name from the column.
      const alias = getTemplateSrv().replace(target.alias ?? '', options.scopedVars) || undefined;

      // When the license is provided via a dashboard variable, interpolate it; otherwise it's a
      // picked license key and is used verbatim.
      const licenseKey = target.useVariableForLicense
        ? getTemplateSrv().replace(target.license, options.scopedVars)
        : target.license;

      const query: BitmovinAnalyticsRequestQuery = {
        filters: [...filters, ...adHocFilters],
        groupBy: target.groupBy,
        orderBy: target.orderBy,
        dimension: dimension,
        metric: metric,
        start: queryFrom.toDate(),
        end: queryTo.toDate(),
        licenseKey: licenseKey,
        interval: interval,
        limit: this.parseLimit(target.limit),
        percentile: percentileValue,
      };

      const response = await lastValueFrom(this.request(this.getRequestUrl(metric, aggregationMethod), 'POST', query));

      const dataRows: MixedDataRowList = response.data.data.result.rows;
      const dataRowCount: number = response.data.data.result.rowCount;
      const columnLabels: Array<{ key: string; label: string }> = response.data.data.result.columnLabels;

      const fields: Array<Partial<Field>> = [];

      // Determine the appropriate transformation based on query parameters
      if (query.interval && query.groupBy?.length > 0) {
        // If the query has an interval and group by columns, transform the data as grouped time series
        fields.push(
          ...transformGroupedTimeSeriesData(dataRows, queryFrom.valueOf(), queryTo.valueOf(), query.interval)
        );
      } else {
        if (query.interval) {
          // If the query has an interval but no group by columns, transform the data as simple time series
          fields.push(
            ...transformSimpleTimeSeries(
              dataRows as NumberDataRowList,
              columnLabels.length > 0 ? columnLabels[columnLabels.length - 1].label : 'Column 1',
              queryFrom.valueOf(),
              queryTo.valueOf(),
              query.interval
            )
          );
        } else {
          // If no interval is specified, transform the data as table data
          fields.push(...transformTableData(dataRows, columnLabels));
        }
      }

      const metaNotices: QueryResultMetaNotice[] = [];
      if (dataRowCount >= 200) {
        metaNotices.push({
          severity: 'warning',
          text: 'Your request reached the max row limit of the API. You might see incomplete data. This problem might be caused by the use of high cardinality columns in group by, too small interval, or too big of a time range.',
        });
      }

      return createDataFrame({
        name: alias,
        fields: fields,
        meta: { notices: metaNotices },
      });
    });

    // round down grafana start time to adjust the grafana graph and show first data point
    if (momentTimeUnit != null) {
      let fromClone = cloneDeep(range.from);
      range.from = fromClone.startOf(momentTimeUnit);
    }

    return Promise.all(promises).then((data) => ({ data }));
  }

  /** Checks if the selected grafana Timerange From is relative (e.g. now-2h) or absolute (actual date) */
  private isRelativeRangeFrom(range: RawTimeRange) {
    if (typeof range.from === 'string') {
      return !moment(range.from).isValid();
    }

    return false;
  }

  /** needed because of old plugin logic where limit was saved as string and not as number */
  parseLimit(limit: number | string | undefined): undefined | number {
    if (limit == null) {
      return undefined;
    }

    if (Number.isInteger(limit)) {
      return limit as number;
    } else {
      return parseInt(limit as string, 10);
    }
  }

  /** check if needed fields are set to avoid sending queries to API that will certainly return an error*/
  isQueryComplete(query: BitmovinAnalyticsDataQuery) {
    if (isEmpty(query.license) || isEmpty(query.dimension)) {
      return false;
    }

    if (query.dimension != null) {
      if (!isMetric(query.dimension) && isEmpty(query.metric)) {
        return false;
      }
    }

    return true;
  }

  getRequestUrl(metric?: Metric, aggregation?: AggregationMethod): string {
    let url = '/analytics';
    if (this.isAdAnalytics === true) {
      url += '/ads';
    }

    if (metric != null) {
      return url + '/metrics/' + metric;
    }

    return url + '/queries/' + aggregation;
  }

  /**
   * Populates Grafana "Query" template variables. The query text uses the following syntax:
   *   `licenses`                               -> the account's licenses (text = name, value = key)
   *   `dimension:COUNTRY`                      -> distinct values of COUNTRY for the first license
   *   `dimension:BROWSER license:<licenseKey>` -> distinct values of BROWSER for a specific license
   *
   * Template variables in the query text are interpolated first, so one variable can feed another
   * (e.g. `dimension:COUNTRY license:${licenseVar}`).
   * When no `license:` is given the first available license is used.
   */
  async metricFindQuery(query: string, options?: { scopedVars?: ScopedVars }): Promise<MetricFindValue[]> {
    const interpolated = getTemplateSrv()
      .replace(query ?? '', options?.scopedVars)
      ?.trim();
    if (!interpolated) {
      return [];
    }

    // `licenses` lists the account's licenses (text = name, value = license key) so a variable can
    // drive the license picker / a `license:${var}` in other variable queries.
    if (interpolated.toLowerCase() === 'licenses') {
      try {
        const response = await lastValueFrom(this.request('/analytics/licenses', 'GET'));
        const items: Array<{ licenseKey: string; name?: string }> = response.data.data.result?.items ?? [];
        return items
          .filter((license) => license.licenseKey != null)
          .map((license) => ({ text: license.name || license.licenseKey, value: license.licenseKey }));
      } catch (err) {
        throw this.toApiError(err, 'Failed to load licenses');
      }
    }

    const dimensionMatch = interpolated.match(/dimension:(\S+)/);
    if (!dimensionMatch) {
      return [];
    }
    const dimension = dimensionMatch[1] as QueryAttribute;

    const rawLicenseKey = interpolated.match(/license:(\S+)/)?.[1];
    let licenseKey: string | undefined;
    if (rawLicenseKey != null) {
      // An explicit license was requested. If it's an unresolved variable reference, surface an error.
      if (this.isUnresolvedVariable(rawLicenseKey)) {
        throw new Error(
          `Could not resolve the license in the variable query ("${rawLicenseKey}"). Make sure the referenced dashboard variable exists and has a value.`
        );
      }
      licenseKey = rawLicenseKey;
    } else {
      // No license given: fall back to the first available license.
      licenseKey = await this.getFirstLicenseKey();
    }
    if (!licenseKey) {
      return [];
    }

    // query a fixed 24h worth of data
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const requestQuery = {
      licenseKey,
      start,
      end,
      // Count distinct values of `dimension` by grouping a count aggregation over impressions.
      // Ad analytics uses the ad impression id and the ads count endpoint.
      dimension: (this.isAdAnalytics ? 'AD_IMPRESSION_ID' : 'IMPRESSION_ID') as QueryAttribute,
      groupBy: [dimension],
      orderBy: [],
      filters: [],
    };

    try {
      const response = await lastValueFrom(this.request(this.getRequestUrl(undefined, 'count'), 'POST', requestQuery));
      const rows: MixedDataRowList = response.data.data.result?.rows ?? [];
      return rows
        .map((row) => row[0])
        .filter((value) => value != null && value !== '')
        .map((value) => ({ text: String(value), value: String(value) }));
    } catch (err) {
      // Surface the failure in the variable editor instead of silently returning no options.
      throw this.toApiError(err, 'Failed to load variable values');
    }
  }

  /**
   * Returns true if `getTemplateSrv().replace` left an unresolved variable reference in place
   * (`${var}`, `$var` or `[[var]]`).
   */
  private isUnresolvedVariable(value: string): boolean {
    return /\$\{?\w+\}?|\[\[\w+\]\]/.test(value);
  }

  private async getFirstLicenseKey(): Promise<string | undefined> {
    try {
      const response = await lastValueFrom(this.request('/analytics/licenses', 'GET'));
      return response.data.data.result?.items?.[0]?.licenseKey;
    } catch (err) {
      throw this.toApiError(err, 'Failed to load licenses');
    }
  }

  /** Builds a readable Error from a Bitmovin API failure so it can be shown to the user. */
  private toApiError(err: unknown, context: string): Error {
    const e = err as { status?: number; statusText?: string; data?: { message?: string; data?: { message?: string } } };
    const detail = e?.data?.message ?? e?.data?.data?.message ?? e?.statusText ?? 'request failed';
    const status = e?.status ? `${e.status} ` : '';
    return new Error(`${context}: ${status}${detail}`);
  }

  /** Keys offered in Grafana's ad-hoc filter UI: the filterable attributes for this datasource. */
  async getTagKeys(): Promise<MetricFindValue[]> {
    const attributes: Array<SelectableValue<string>> = this.isAdAnalytics
      ? SELECTABLE_QUERY_AD_ATTRIBUTES
      : SELECTABLE_QUERY_FILTER_ATTRIBUTES;
    return attributes.filter((attr) => attr.value != null).map((attr) => ({ text: attr.value as string }));
  }

  /** Values offered for a chosen ad-hoc filter key: the distinct values of that dimension. */
  async getTagValues(options: { key: string }): Promise<MetricFindValue[]> {
    const values = await this.metricFindQuery(`dimension:${options.key}`);
    // For attributes that support an "IS NULL" filter, offer an explicit empty option so users can
    // filter for missing values. Selecting it yields an empty value, which convertFilterValueToProperType
    // turns into a null filter (same mechanism as the panel filters).
    if (isNullFilter(options.key as QueryAttribute | QueryAdAttribute)) {
      return [{ text: '(empty)', value: AD_HOC_NULL_VALUE }, ...values];
    }
    return values;
  }

  /**
   * Resolves the dashboard's ad-hoc filters in a version-safe way:
   * - Grafana v11+ injects them on the query request (`options.filters`).
   * - Older Grafana exposes them via the template service (`getAdhocFilters`).
   * Neither is present in the `@grafana/data` version we build against, so both are read defensively.
   * When neither exists (older Grafana without ad-hoc support), an empty list is returned and the
   * query is unchanged — so ad-hoc support degrades gracefully rather than breaking.
   */
  private resolveAdHocFilters(options: DataQueryRequest<BitmovinAnalyticsDataQuery>): ProperTypedQueryFilter[] {
    const fromRequest = (options as { filters?: AdHocVariableFilter[] }).filters;
    const legacyGetter = (getTemplateSrv() as { getAdhocFilters?: (dsName: string) => AdHocVariableFilter[] })
      .getAdhocFilters;
    const rawFilters = Array.isArray(fromRequest)
      ? fromRequest
      : typeof legacyGetter === 'function'
      ? legacyGetter.call(getTemplateSrv(), this.name) ?? []
      : [];

    return rawFilters
      .map((adHoc): ProperTypedQueryFilter | null => {
        const operator = AD_HOC_OPERATOR_MAP[adHoc.operator];
        if (operator == null) {
          // Unsupported ad-hoc operator (e.g. the multi-value =| / !=| variants) — skip rather than guess.
          return null;
        }
        const name = adHoc.key as QueryAttribute | QueryAdAttribute;
        // The "(empty)" option uses a non-empty sentinel (Grafana drops empty-value filters); map it
        // back to an empty value so convertFilterValueToProperType produces a null ("IS NULL") filter.
        const rawValue = adHoc.value === AD_HOC_NULL_VALUE ? '' : adHoc.value;
        return {
          name,
          operator,
          value: convertFilterValueToProperType(rawValue, name, operator, !!this.isAdAnalytics),
        };
      })
      .filter((filter): filter is ProperTypedQueryFilter => filter !== null);
  }

  request(url: string, method: string, payload?: any): Observable<Record<any, any>> {
    const headers: Record<string, string> = {
      'X-Api-Key': this.apiKey,
      'X-Api-Client': 'analytics-grafana-datasource',
    };
    if (this.tenantOrgId != null) {
      headers['X-Tenant-Org-Id'] = this.tenantOrgId;
    }
    const options = {
      url: this.baseUrl + url,
      headers: headers,
      method: method,
      data: payload,
    };

    return getBackendSrv().fetch(options);
  }

  async testDatasource() {
    return lastValueFrom(
      this.request('/analytics/licenses', 'GET').pipe(
        map(() => {
          return {
            status: 'success',
            message: 'Data source successfully setup and connected.',
          };
        }),
        catchError((err) => {
          let message = 'Bitmovin: ';
          if (err.status) {
            message += err.status + ' ';
          }
          if (err.statusText) {
            message += err.statusText;
          } else {
            message += 'Can not connect to Bitmovin API';
          }

          let errorMessage = err.data?.message || err.data?.data?.message;

          //additional errorDetails like requestId and timestamp if requestId is set
          let errorDetails;
          if (err.data?.requestId) {
            errorDetails = 'Timestamp: ' + new Date().toISOString();
            errorDetails += err.data?.requestId ? '\nRequestId: ' + err.data?.requestId : '';
          }

          return of({
            status: 'error',
            message: message,
            details: { message: errorMessage, verboseMessage: errorDetails },
          });
        })
      )
    );
  }
}

/**
 * Variable support for "Query" template variables. Delegates to {@link DataSource.metricFindQuery}
 * and wraps the result in a data frame with `text`/`value` fields, which Grafana turns into the
 * variable's dropdown options.
 */
export class BitmovinVariableSupport extends CustomVariableSupport<DataSource, BitmovinVariableQuery> {
  constructor(private readonly datasource: DataSource) {
    super();
    // Bind so the method keeps its `this` when Grafana invokes it detached.
    this.query = this.query.bind(this);
  }

  editor = VariableQueryEditor;

  query(request: DataQueryRequest<BitmovinVariableQuery>): Observable<DataQueryResponse> {
    const queryText = request.targets[0]?.query ?? '';

    return from(this.datasource.metricFindQuery(queryText, { scopedVars: request.scopedVars })).pipe(
      map((values) => ({
        data: [
          createDataFrame({
            fields: [
              { name: 'text', type: FieldType.string, values: values.map((v) => String(v.text)) },
              { name: 'value', type: FieldType.string, values: values.map((v) => String(v.value ?? v.text)) },
            ],
          }),
        ],
      }))
    );
  }
}
