import { SelectableValue } from '@grafana/data';

const METRICS = ['AVG_CONCURRENTVIEWERS', 'MAX_CONCURRENTVIEWERS', 'AVG_DROPPED_FRAMES'] as const;

export type Metric = (typeof METRICS)[number];

export const SELECTABLE_METRICS: Array<SelectableValue<Metric>> = METRICS.map((metric) => ({
  value: metric,
  label: metric,
}));

export const isMetric = (value: string): value is Metric => {
  return METRICS.includes(value as Metric);
};
