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
  licenseKey: string;
  interval?: QueryInterval | 'AUTO';
  aggregation?: Aggregation;
  metric?: Metric;
  dimension?: QueryAttribute | QueryAdAttribute;
  groupBy: Array<QueryAttribute | QueryAdAttribute>;
  orderBy: QueryOrderBy[];
  limit?: number;
  filters: QueryFilter[];
  aliasBy?: string;
}

export const DEFAULT_QUERY: Partial<BitmovinAnalyticsDataQuery> = {
  licenseKey: '',
  interval: 'AUTO',
  orderBy: [],
  groupBy: [],
  filters: [],
};

/**
 * These are options configured for each DataSource instance
 */
export interface BitmovinDataSourceOptions extends DataSourceJsonData {
  apiKey: string;
  tenantOrgId?: string;
  adAnalytics?: boolean;
}
