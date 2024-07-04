import type { SelectableValue } from '@grafana/data';

const AGGREGATION_METHODS = [
  'count',
  'sum',
  'avg',
  'min',
  'max',
  'stddev',
  'percentile',
  'variance',
  'median',
] as const;

export type AggregationMethod = (typeof AGGREGATION_METHODS)[number];

export const SELECTABLE_AGGREGATION_METHODS: Array<SelectableValue<AggregationMethod>> = AGGREGATION_METHODS.map(
  (aggregation) => ({
    value: aggregation,
    label: aggregation,
  })
);
