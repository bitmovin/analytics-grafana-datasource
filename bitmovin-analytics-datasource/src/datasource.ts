import {
  createDataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  Field,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';

import { MixedDataRowList, MyDataSourceOptions, BitmovinAnalyticsDataQuery, NumberDataRowList } from './types';
import { transformGroupedTimeSeriesData, transformSimpleTimeSeries, transformTableData } from './utils/dataUtils';
import { calculateQueryInterval, QueryInterval } from './utils/intervalUtils';
import { QueryAttribute } from './types/queryAttributes';
import { QueryAdAttribute } from './types/queryAdAttributes';
import { Metric } from './types/metric';
import { Aggregation } from './types/aggregations';
import { QueryOrderBy } from './types/queryOrderBy';

type AnalyticsQuery = {
  filters: Array<{ name: string; operator: string; value: number }>;
  groupBy: QueryAttribute[] | QueryAdAttribute[];
  orderBy: QueryOrderBy[];
  dimension?: QueryAttribute | QueryAdAttribute;
  metric?: Metric;
  start: Date;
  end: Date;
  licenseKey: string;
  interval?: QueryInterval;
};

export class DataSource extends DataSourceApi<BitmovinAnalyticsDataQuery, MyDataSourceOptions> {
  baseUrl: string;
  apiKey: string;
  tenantOrgId?: string;
  adAnalytics?: boolean;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.apiKey = instanceSettings.jsonData.apiKey;
    this.tenantOrgId = instanceSettings.jsonData.tenantOrgId;
    this.adAnalytics = instanceSettings.jsonData.adAnalytics;
    this.baseUrl = instanceSettings.url!;
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

    const promises = options.targets.map(async (target) => {
      const interval = target.interval
        ? calculateQueryInterval(target.interval!, from.getTime(), to.getTime())
        : undefined;

      const query: AnalyticsQuery = {
        filters: [
          {
            name: 'VIDEO_STARTUPTIME',
            operator: 'GT',
            value: 0,
          },
        ],
        groupBy: target.groupBy,
        orderBy: target.orderBy,
        dimension: target.dimension,
        metric: target.metric,
        start: from,
        end: to,
        licenseKey: target.licenseKey,
        interval: interval,
      };

      const response = await lastValueFrom(
        this.request(this.getRequestUrl(target.metric, target.aggregation), 'POST', query)
      );

      const dataRows: MixedDataRowList = response.data.data.result.rows;
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

      return createDataFrame({
        fields: fields,
      });
    });

    return Promise.all(promises).then((data) => ({ data }));
  }

  getRequestUrl(metric?: Metric, aggregation?: Aggregation): string {
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
