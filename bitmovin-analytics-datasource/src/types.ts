import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';
import { QueryInterval } from './utils/intervalUtils';
import { Aggregation } from './types/aggregations';
import { QueryAttribute } from './types/queryAttributes';
import { QueryAdAttribute } from './types/queryAdAttributes';
import { Metric } from './types/metric';
import { QueryOrderBy } from './types/queryOrderBy';
import { QueryFilter } from './types/queryFilter';

/**
 * These are the options configurable via the QueryEditor
 * */
export interface BitmovinAnalyticsDataQuery extends DataQuery {
  licenseKey: string;
  interval?: QueryInterval | 'AUTO';
  aggregation?: Aggregation;
  metric?: Metric;
  dimension?: QueryAttribute | QueryAdAttribute;
  groupBy: QueryAttribute[] | QueryAdAttribute[];
  orderBy: QueryOrderBy[];
  filters: QueryFilter[];
}

export const DEFAULT_QUERY: Partial<BitmovinAnalyticsDataQuery> = {};

/**
 * These are options configured for each DataSource instance
 */
export interface BitmovinDataSourceOptions extends DataSourceJsonData {
  apiKey: string;
  tenantOrgId?: string;
  adAnalytics?: boolean;
}

export type BitmovinAnalyticsRequestQuery = {
  licenseKey: string;
  start: Date;
  end: Date;
  filters: QueryFilter[];
  groupBy: QueryAttribute[] | QueryAdAttribute[];
  orderBy: QueryOrderBy[];
  dimension?: QueryAttribute | QueryAdAttribute;
  metric?: Metric;
  interval?: QueryInterval;
};

export type MixedDataRow = Array<string | number>;
export type MixedDataRowList = MixedDataRow[];

export type NumberDataRow = number[];
export type NumberDataRowList = NumberDataRow[];
