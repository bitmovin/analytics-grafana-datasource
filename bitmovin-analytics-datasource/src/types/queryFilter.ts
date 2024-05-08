import { SelectableValue } from '@grafana/data';
import { QueryAdAttribute } from './queryAdAttributes';
import { QueryAttribute } from './queryAttributes';

export enum QUERY_FILTER_OPERATORS {
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  EQ = 'EQ',
  NE = 'NE',
  CONTAINS = 'CONTAINS',
  NOTCONTAINS = 'NOTCONTAINS',
  IN = 'IN',
}

export type QueryFilterOperator = keyof typeof QUERY_FILTER_OPERATORS;

export const SELECTABLE_QUERY_FILTER_OPERATORS: SelectableValue<QueryFilterOperator>[] = [
  { value: QUERY_FILTER_OPERATORS.GT, label: QUERY_FILTER_OPERATORS.GT },
  { value: QUERY_FILTER_OPERATORS.GTE, label: QUERY_FILTER_OPERATORS.GTE },
  { value: QUERY_FILTER_OPERATORS.LT, label: QUERY_FILTER_OPERATORS.LT },
  { value: QUERY_FILTER_OPERATORS.LTE, label: QUERY_FILTER_OPERATORS.LTE },
  { value: QUERY_FILTER_OPERATORS.EQ, label: QUERY_FILTER_OPERATORS.EQ },
  { value: QUERY_FILTER_OPERATORS.NE, label: QUERY_FILTER_OPERATORS.NE },
  { value: QUERY_FILTER_OPERATORS.CONTAINS, label: QUERY_FILTER_OPERATORS.CONTAINS },
  { value: QUERY_FILTER_OPERATORS.NOTCONTAINS, label: QUERY_FILTER_OPERATORS.NOTCONTAINS },
  { value: QUERY_FILTER_OPERATORS.IN, label: QUERY_FILTER_OPERATORS.IN },
];

export type QueryFilter = {
  name: QueryAdAttribute | QueryAttribute;
  operator: QueryFilterOperator;
  value: QueryFilterValue;
};

export type QueryFilterValue = boolean | number | string | string[] | null;
