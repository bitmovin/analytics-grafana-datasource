import { QueryAdAttribute } from './queryAdAttributes';
import { QueryAttribute } from './queryAttributes';
import type { SelectableValue } from '@grafana/data';

const QUERY_FILTER_OPERATORS = ['GT', 'GTE', 'LT', 'LTE', 'EQ', 'NE', 'CONTAINS', 'NOTCONTAINS', 'IN'] as const;

export type QueryFilterOperator = (typeof QUERY_FILTER_OPERATORS)[number];

export const SELECTABLE_QUERY_FILTER_OPERATORS: Array<SelectableValue<QueryFilterOperator>> =
  QUERY_FILTER_OPERATORS.map((o) => ({ value: o, label: o }));

export type QueryFilter = {
  name: QueryAdAttribute | QueryAttribute;
  operator: QueryFilterOperator;
  value: QueryFilterValue;
};

export type QueryFilterValue = boolean | number | string | string[] | null;
