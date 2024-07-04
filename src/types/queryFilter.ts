import { QueryAdAttribute } from './queryAdAttributes';
import { QueryAttribute } from './queryAttributes';
import type { SelectableValue } from '@grafana/data';

const QUERY_FILTER_OPERATORS = ['GT', 'GTE', 'LT', 'LTE', 'EQ', 'NE', 'CONTAINS', 'NOTCONTAINS', 'IN'] as const;

export type QueryFilterOperator = (typeof QUERY_FILTER_OPERATORS)[number];

export const SELECTABLE_QUERY_FILTER_OPERATORS: Array<SelectableValue<QueryFilterOperator>> =
  QUERY_FILTER_OPERATORS.map((o) => ({ value: o, label: o }));

/** This type is needed because of legacy reasons.
 * In the angular plugin the value was saved as a string in a dashboard JSON file. */
export type QueryFilter = {
  name: QueryAdAttribute | QueryAttribute;
  operator: QueryFilterOperator;
  value: string;
};

/** QueryFilter type with the correct value type that is accepted by the Bitmovin API */
export type ProperTypedQueryFilter = {
  name: QueryAdAttribute | QueryAttribute;
  operator: QueryFilterOperator;
  value: OutputQueryFilterValue;
};

/** Correct Filter value type that is accepted by the Bitmovin API */
export type OutputQueryFilterValue = boolean | number | string | string[] | null;
