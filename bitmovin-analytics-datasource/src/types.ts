import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';
import { QueryInterval } from './utils/intervalUtils';

export interface MyQuery extends DataQuery {
  interval: QueryInterval;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  //constant: 6.5,
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
