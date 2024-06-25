import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';
import { QueryInterval } from '../utils/intervalUtils';
import { QueryAttribute } from './queryAttributes';
import { QueryAdAttribute } from './queryAdAttributes';
import { Metric } from './metric';
import { QueryOrderBy } from './queryOrderBy';
import { InputQueryFilter } from './queryFilter';
import { AggregationMethod } from './aggregationMethod';

type ResultFormat = 'table' | 'time_series';

/**
 * These are the options configurable via the QueryEditor
 * */
export interface BitmovinAnalyticsDataQuery extends DataQuery {
  license: string;
  interval?: QueryInterval | 'AUTO';
  metric?: AggregationMethod;
  dimension?: QueryAttribute | QueryAdAttribute | Metric;
  groupBy: Array<QueryAttribute | QueryAdAttribute>;
  orderBy: QueryOrderBy[];
  limit?: number;
  filter: InputQueryFilter[];
  alias?: string;
  percentileValue?: number;
  resultFormat: ResultFormat;
}

/**
 * @deprecated
 * These are the options query options of the old Angular based plugin
 * */
export interface OldBitmovinAnalyticsDataQuery extends DataQuery {
  license: string;
  interval?: QueryInterval | 'AUTO';
  metric?: AggregationMethod;
  dimension?: QueryAttribute | QueryAdAttribute | Metric;
  groupBy: Array<QueryAttribute | QueryAdAttribute>;
  orderBy: QueryOrderBy[];
  limit?: string;
  filter: InputQueryFilter[];
  alias?: string;
  percentileValue: number;
  resultFormat: ResultFormat;
}

export const DEFAULT_QUERY: Partial<BitmovinAnalyticsDataQuery> = {
  license: '',
  orderBy: [],
  groupBy: [],
  filter: [],
  resultFormat: 'time_series',
  interval: 'AUTO',
};

/**
 * These are options configured for each DataSource instance
 */
export interface BitmovinDataSourceOptions extends DataSourceJsonData {
  apiKey: string;
  tenantOrgId?: string;
  adAnalytics?: boolean;
}
