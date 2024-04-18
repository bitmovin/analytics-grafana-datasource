//TODOMY check with team, do we still support stddev, variance, median, and percentile
//TODOMY find a better way maybe for the Aggregation value, maybe an enum?
export type Aggregation = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'stddev' | 'percentile' | 'variance' | 'median';

export const SELECTABLE_AGGREGATIONS: Array<{ value: Aggregation; label: string }> = [
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

export const DEFAULT_SELECTABLE_AGGREGATION = SELECTABLE_AGGREGATIONS[0];
