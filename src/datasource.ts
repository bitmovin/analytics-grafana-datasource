import {
  CoreApp,
  createDataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  Field,
  QueryResultMetaNotice,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { filter } from 'lodash';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';

import {
  BitmovinDataSourceOptions,
  BitmovinAnalyticsDataQuery,
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
import { calculateQueryInterval, QueryInterval } from './utils/intervalUtils';
import { isMetric, Metric } from './types/metric';
import { AggregationMethod } from './types/aggregationMethod';
import { ProperTypedQueryFilter } from './types/queryFilter';
import { QueryAttribute } from './types/queryAttributes';
import { QueryAdAttribute } from './types/queryAdAttributes';
import { QueryOrderBy } from './types/queryOrderBy';
import { convertFilterValueToProperType } from './utils/filterUtils';

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

export class DataSource extends DataSourceApi<
  BitmovinAnalyticsDataQuery | OldBitmovinAnalyticsDataQuery,
  BitmovinDataSourceOptions
> {
  baseUrl: string;
  apiKey: string;
  tenantOrgId?: string;
  adAnalytics?: boolean;

  constructor(instanceSettings: DataSourceInstanceSettings<BitmovinDataSourceOptions>) {
    super(instanceSettings);

    this.apiKey = instanceSettings.jsonData.apiKey;
    this.tenantOrgId = instanceSettings.jsonData.tenantOrgId;
    this.adAnalytics = instanceSettings.jsonData.adAnalytics;
    this.baseUrl = instanceSettings.url!;
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
    const from = range!.from.toDate();
    const to = range!.to.toDate();

    //filter disabled queries
    const enabledQueries = (options.targets = filter(options.targets, (t) => !t.hide));

    const promises = enabledQueries.map(async (target) => {
      const interval =
        target.resultFormat === 'time_series' && target.interval
          ? calculateQueryInterval(target.interval, from.getTime(), to.getTime())
          : undefined;

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

      const filters: ProperTypedQueryFilter[] = target.filter.map((filter) => {
        return {
          name: filter.name,
          operator: filter.operator,
          value: convertFilterValueToProperType(filter.value, filter.name, filter.operator, !!this.adAnalytics),
        };
      });

      const query: BitmovinAnalyticsRequestQuery = {
        filters: filters,
        groupBy: target.groupBy,
        orderBy: target.orderBy,
        dimension: dimension,
        metric: metric,
        start: from,
        end: to,
        licenseKey: target.license,
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
        fields.push(...transformGroupedTimeSeriesData(dataRows, from.getTime(), to.getTime(), query.interval));
      } else {
        if (query.interval) {
          // If the query has an interval but no group by columns, transform the data as simple time series
          fields.push(
            ...transformSimpleTimeSeries(
              dataRows as NumberDataRowList,
              columnLabels.length > 0 ? columnLabels[columnLabels.length - 1].label : 'Column 1',
              from.getTime(),
              to.getTime(),
              query.interval
            )
          );
        } else {
          // If no interval is specified, transform the data as table data
          fields.push(...transformTableData(dataRows, columnLabels));
        }
      }

      let metaNotices: QueryResultMetaNotice[] = [];
      if (dataRowCount >= 200) {
        metaNotices = [
          {
            severity: 'warning',
            text: 'Your request reached the max row limit of the API. You might see incomplete data. This problem might be caused by the use of high cardinality columns in group by, too small interval, or too big of a time range.',
          },
        ];
      }

      return createDataFrame({
        name: target.alias,
        fields: fields,
        meta: { notices: metaNotices },
      });
    });

    return Promise.all(promises).then((data) => ({ data }));
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

  getRequestUrl(metric?: Metric, aggregation?: AggregationMethod): string {
    let url = '/analytics';
    if (this.adAnalytics === true) {
      url += '/ads';
    }

    if (metric != null) {
      return url + '/metrics/' + metric;
    }

    return url + '/queries/' + aggregation;
  }

  request(url: string, method: string, payload?: any): Observable<Record<any, any>> {
    const options = {
      url: this.baseUrl + url,
      headers: { 'X-Api-Key': this.apiKey },
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
