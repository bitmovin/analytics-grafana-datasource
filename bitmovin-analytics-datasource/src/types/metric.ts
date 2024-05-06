import { SelectableValue } from '@grafana/data';

export enum METRICS {
  AVG_CONCURRENTVIEWERS = 'avg-concurrentviewers',
  MAX_CONCURRENTVIEWERS = 'max-concurrentviewers',
  AVG_DROPPED_FRAMES = 'avg-dropped-frames',
}

export type Metric = (typeof METRICS)[keyof typeof METRICS];

export const SELECTABLE_METRICS: Array<SelectableValue<Metric>> = [
  { value: METRICS.AVG_CONCURRENTVIEWERS, label: 'Avg Concurrent Viewers' },
  { value: METRICS.MAX_CONCURRENTVIEWERS, label: 'Max Concurrent Viewers' },
  { value: METRICS.AVG_DROPPED_FRAMES, label: 'Avg Dropped Frames' },
];

export const isMetric = (value: string): boolean => {
  return Object.values(METRICS).includes(value as Metric);
};
