import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';
import { QueryInterval } from '../utils/intervalUtils';
import { Aggregation } from './aggregations';
import { QueryAttribute } from './queryAttributes';
import { QueryAdAttribute } from './queryAdAttributes';
import { Metric } from './metric';
import { QueryOrderBy } from './queryOrderBy';
import { QueryFilter } from './queryFilter';

/**
 * These are the options configurable via the QueryEditor
 * */
export interface BitmovinAnalyticsDataQuery extends DataQuery {
  license: string;
  interval?: QueryInterval | 'AUTO';
  metric?: Aggregation;
  dimension?: QueryAttribute | QueryAdAttribute | Metric;
  groupBy: Array<QueryAttribute | QueryAdAttribute>;
  orderBy: QueryOrderBy[];
  limit?: number;
  filter: QueryFilter[];
  alias?: string;
  percentile?: number;
}

/**
 * @deprecated
 * These are the options query options of the old Angular based plugin
 * */
export interface OldBitmovinAnalyticsDataQuery extends DataQuery {
  license: string;
  interval?: QueryInterval | 'AUTO';
  metric?: Aggregation;
  dimension?: QueryAttribute | QueryAdAttribute | Metric;
  groupBy: Array<QueryAttribute | QueryAdAttribute>;
  orderBy: QueryOrderBy[];
  limit?: number;
  filter: QueryFilter[];
  alias?: string;
  percentile?: number;
  resultFormat?: 'table' | 'time_series';
}

export function isOldBitmovinAnalyticsDataQuery(
  query: OldBitmovinAnalyticsDataQuery | BitmovinAnalyticsDataQuery
): query is OldBitmovinAnalyticsDataQuery {
  // resultFormat is always set through the old plugin's logic
  return (query as OldBitmovinAnalyticsDataQuery).resultFormat != null;
}

export const DEFAULT_QUERY: Partial<BitmovinAnalyticsDataQuery> = {
  license: '',
  orderBy: [],
  groupBy: [],
  filter: [],
};

/**
 * These are options configured for each DataSource instance
 */
export interface BitmovinDataSourceOptions extends DataSourceJsonData {
  apiKey: string;
  tenantOrgId?: string;
  adAnalytics?: boolean;
}
