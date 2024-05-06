import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';
import { QueryInterval } from './utils/intervalUtils';
import { Aggregation } from './types/aggregations';
import { QueryAttribute } from './types/queryAttributes';
import { QueryAdAttribute } from './types/queryAdAttributes';
import { Metric } from './types/metric';

export interface BitmovinAnalyticsDataQuery extends DataQuery {
  licenseKey: string;
  interval?: QueryInterval | 'AUTO';
  aggregation?: Aggregation;
  metric?: Metric;
  dimension?: QueryAttribute | QueryAdAttribute;
  groupBy: QueryAttribute[] | QueryAdAttribute[];
}

export const DEFAULT_QUERY: Partial<BitmovinAnalyticsDataQuery> = {};

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
