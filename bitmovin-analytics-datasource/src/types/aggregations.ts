import { SelectableValue } from '@grafana/data';

export type Aggregation = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'stddev' | 'percentile' | 'variance' | 'median';

export const SELECTABLE_AGGREGATIONS: Array<SelectableValue<Aggregation>> = [
  { value: 'count', label: 'Count' },
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Avg' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'stddev', label: 'Stddev' },
  { value: 'percentile', label: 'Percentile' },
  { value: 'variance', label: 'Variance' },
  { value: 'median', label: 'Median' },
];
