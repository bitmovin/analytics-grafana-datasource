import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';
import { QueryInterval } from './utils/intervalUtils';
import { Aggregation } from './types/aggregations';

export interface MyQuery extends DataQuery {
  interval?: QueryInterval | 'AUTO';
  timeSeries: boolean;
  limit: number;
  aggregation: Aggregation;
  licenseKey: string;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  interval: 'AUTO',
  timeSeries: true,
  limit: 100,
  aggregation: 'count',
  licenseKey: '',
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  apiKey: string;
  tenantOrgId?: string;
  adAnalytics?: boolean;
}

export type MixedDataRow = Array<string | number>;
export type MixedDataRowList = MixedDataRow[];

export type NumberDataRow = number[];
export type NumberDataRowList = NumberDataRow[];
