import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';
import { QueryInterval } from './utils/intervalUtils';
import { Aggregation } from './types/aggregations';
import { QueryAttribute } from './types/queryAttributes';
import { QueryAdAttribute } from './types/queryAdAttributes';
import { QueryOrderBy } from './types/queryOrderBy';
import { QueryFilter } from './types/queryFilter';

export interface MyQuery extends DataQuery {
  interval?: QueryInterval | 'AUTO';
  limit: number;
  aggregation: Aggregation;
  licenseKey: string;
  dimension: QueryAttribute | QueryAdAttribute;
  groupBy: QueryAttribute[] | QueryAdAttribute[];
  orderBy: QueryOrderBy[];
  filters: QueryFilter[];
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  interval: 'AUTO',
  limit: 100,
  aggregation: 'count',
  licenseKey: '',
  dimension: 'IMPRESSION_ID',
  groupBy: [],
  orderBy: [],
  filters: [],
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
