import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';

import { MyQuery, MyDataSourceOptions } from './types';

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

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map((target) => {
      return new MutableDataFrame({
        refId: target.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [target.constant, target.constant], type: FieldType.number },
        ],
      });
    });

    return { data };
  }

  async request(url: string, method: string) {
    const options = {
      url: this.baseUrl + url,
      headers: { 'X-Api-Key': this.apiKey },
      method: method,
    };
    const response = getBackendSrv().fetch(options);

    return lastValueFrom(response);
  }

  async testDatasource() {
    const response = await this.request('/analytics/licenses', 'GET');

    if (response.status === 200) {
      return {
        status: 'success',
        message: 'Datasource setup successfully.',
      };
    } else {
      return {
        status: 'error',
        message: response.statusText
          ? response.statusText
          : 'An unexpected error occurred. Datasource not setup correctly.',
      };
    }
  }
}
