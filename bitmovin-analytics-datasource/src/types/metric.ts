import { SelectableValue } from '@grafana/data';

const METRICS = ['avg-concurrentviewers', 'max-concurrentviewers', 'avg-dropped-frames'] as const;

export type Metric = (typeof METRICS)[number];

export const SELECTABLE_METRICS: Array<SelectableValue<Metric>> = METRICS.map((metric) => ({
  value: metric,
  label: metric,
}));

export const isMetric = (value: string): value is Metric => {
  return METRICS.includes(value as Metric);
};
