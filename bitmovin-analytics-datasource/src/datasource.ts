import {
  createDataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  Field,
  FieldType,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';

import { MyDataSourceOptions, MyQuery } from './types';
import { zip } from 'lodash';
import { padAndSortTimeSeries } from './utils/dataUtils';

type AnalyticsQuery = {
  filters: { name: string; operator: string; value: number }[];
  groupBy: string[];
  orderBy: { name: string; order: string }[];
  dimension: string;
  start: Date;
  end: Date;
  licenseKey: string;
  interval?: string;
};

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
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
   * The Bitmovin API Response follows this rules:
   * - if the interval property is given on the request query, then time series data is returned and the first value of a row is a timestamp in milliseconds
   * - if the groupBy property array is not empty on the request query, then depending on whether the interval property is set all values
   *    - between the first one (if interval is set) and the last one (not included) can be considered string values
   *    - up to the last one (not included) can be considered string values
   * - the last value of a row will always be a number
   * */
  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = new Date(range!.from.toDate().setSeconds(0, 0));
    const to = range!.to.toDate();

    const query: AnalyticsQuery = {
      filters: [
        {
          name: 'VIDEO_STARTUPTIME',
          operator: 'GT',
          value: 0,
        },
      ],
      groupBy: [],
      orderBy: [
        {
          name: 'MINUTE',
          order: 'DESC',
        },
      ],
      dimension: 'IMPRESSION_ID',
      start: from,
      end: to,
      licenseKey: '45adcf9b-8f7c-4e28-91c5-50ba3d442cd4',
      interval: 'MINUTE',
    };

    const promises = options.targets.map(async (target) => {
      const response = await lastValueFrom(this.request(this.getRequestUrl(), 'POST', query));

      //TODOMY implement error handling

      const dataRows: Array<Array<string | number>> = response.data.data.result.rows;
      const columnLabels: Array<{ key: string; label: string }> = response.data.data.result.columnLabels;

      const fields: Array<Partial<Field>> = [];

      //one row will look like this [timestamp, groupBy1, ... groupByN, value]
      if (query.interval && query.groupBy.length > 0) {
        //group the result by the groupBy values to be able to display it as multiple time series in one graph
        const groupedTimeSeriesMap = new Map<string, Array<Array<string | number>>>();
        dataRows.forEach((row) => {
          const groupKey = row.slice(1, row.length - 1).toString();
          if (!groupedTimeSeriesMap.has(groupKey)) {
            groupedTimeSeriesMap.set(groupKey, []);
          }
          groupedTimeSeriesMap.get(groupKey)?.push(row as []);
        });

        //pad grouped data as there can only be one time field for a graph with multiple time series
        const paddedTimeSeries: Array<Array<Array<string | number>>> = [];
        groupedTimeSeriesMap.forEach((data) => {
          paddedTimeSeries.push(padAndSortTimeSeries(data, from.getTime(), to.getTime(), query.interval!));
        });

        //TODOMY we could probably also just use the range fucntion to save the timestamps, not sure whats better here?
        //extract timestamps
        const transposedFirstGroupData = zip(...paddedTimeSeries[0]);
        const timestamps = transposedFirstGroupData[0];

        fields.push({ name: 'Time', values: timestamps, type: FieldType.time });

        // extract and save the values for every grouped time series
        paddedTimeSeries.forEach((data, key) => {
          //Field name that consists of the groupBy values of the current timeSeries
          const name = data[0].slice(1, data[0].length - 1).join(', ');

          //extract values
          const columns = zip(...data);
          const valueColumn = columns.slice(columns.length - 1);

          fields.push({
            name: name,
            values: valueColumn[0] as number[],
            type: FieldType.number,
          });
        });
      } else {
        //data is a time series data so padding is needed and time data needs to be extracted
        if (query.interval) {
          const paddedData = padAndSortTimeSeries(dataRows, from.getTime(), to.getTime(), 'MINUTE');
          const columns = zip(...paddedData);
          fields.push({ name: 'Time', values: columns[0] as number[], type: FieldType.time });
          fields.push({
            name: columnLabels[columnLabels.length - 1].label,
            values: columns[columns.length - 1] as number[],
            type: FieldType.number,
          });
        } else {
          //data is no timeseries, no padding required
          const columns = zip(...dataRows);

          if (query.groupBy.length > 0) {
            const start = query.interval !== undefined ? 1 : 0;
            const end = columns.length - 1;

            const groupByColumns = columns.slice(start, end);

            groupByColumns.forEach((column, index) => {
              fields.push({
                name: columnLabels[index].label,
                values: column as string[],
                type: FieldType.string,
              });
            });
          }

          fields.push({
            name: columnLabels[columnLabels.length - 1].label,
            values: columns[columns.length - 1] as number[],
            type: FieldType.number,
          });
        }
      }

      return createDataFrame({
        fields: fields,
      });
    });

    //TODOMY show error message beside the Dimension if aggregation was called on a non numeric dimension

    //TODOMY toggle for timeseries or table
    return Promise.all(promises).then((data) => ({ data }));
  }

  getRequestUrl(): string {
    if (this.adAnalytics === true) {
      return '/analytics/ads/queries';
    }

    return '/analytics/queries/count';
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
          if (err.status) message += err.status + ' ';
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
