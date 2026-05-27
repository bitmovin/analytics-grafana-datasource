import { DataQuery } from '@grafana/schema';

/** Query model for "Query" template variables backed by this datasource. */
export interface BitmovinVariableQuery extends DataQuery {
  /** Raw query text, e.g. `dimension:COUNTRY` or `dimension:BROWSER license:YOUR_LICENSE_KEY`. */
  query: string;
}
