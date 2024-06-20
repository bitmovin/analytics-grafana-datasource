import type { SelectableValue } from '@grafana/data';

const AGGREGATIONS = ['count', 'sum', 'avg', 'min', 'max', 'stddev', 'percentile', 'variance', 'median'] as const;

export type Aggregation = (typeof AGGREGATIONS)[number];

export const SELECTABLE_AGGREGATIONS: Array<SelectableValue<Aggregation>> = AGGREGATIONS.map((aggregation) => ({
  value: aggregation,
  label: aggregation,
}));
