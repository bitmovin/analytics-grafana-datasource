// eslint-disable-next-line  no-restricted-imports
import type { DurationInputArg2 } from 'moment';

export type QueryInterval = 'MINUTE' | 'HOUR' | 'DAY' | 'MONTH';

export type SelectableQueryInterval = QueryInterval | 'AUTO';

export const SELECTABLE_QUERY_INTERVALS: Array<{ value: SelectableQueryInterval | 'AUTO'; label: string }> = [
  { value: 'AUTO', label: 'Auto' },
  { value: 'MINUTE', label: 'Minute' },
  { value: 'HOUR', label: 'Hour' },
  { value: 'DAY', label: 'Day' },
  { value: 'MONTH', label: 'Month' },
];

export const DEFAULT_SELECTABLE_QUERY_INTERVAL = SELECTABLE_QUERY_INTERVALS[0];

/** Intervals ordered ascending by duration */
const intervalOrder = ['MINUTE', 'HOUR', 'DAY', 'MONTH'];

/**
 * Return the smaller interval of two provided intervals
 *
 * @param {QueryInterval} interval1 The first interval
 * @param {QueryInterval} interval2 The second interval
 * */
export const getSmallerInterval = (interval1: QueryInterval, interval2: QueryInterval) => {
  // Get the indices of the intervals
  const index1 = intervalOrder.indexOf(interval1);
  const index2 = intervalOrder.indexOf(interval2);

  // Return the smaller interval
  return index1 < index2 ? interval1 : interval2;
};

/**
 * Calculates the Query interval based on a given selected interval, start timestamp and end timestamp
 *
 * @param {SelectableQueryInterval} interval The selected interval
 * @param {number} startTimestamp The start timestamp in milliseconds
 * @param {number} endTimestamp The end timestamp in milliseconds
 * @returns {QueryInterval} calculated Interval as QueryInterval
 */
export const calculateQueryInterval = (
  interval: SelectableQueryInterval,
  startTimestamp: number,
  endTimestamp: number
): QueryInterval => {
  if (interval !== 'AUTO') {
    return interval as QueryInterval;
  }

  const intervalInMilliseconds = endTimestamp - startTimestamp;
  const minuteIntervalLimitInMilliseconds = 3 * 60 * 60 * 1000; // MINUTE granularity for timeframes below 3h
  const hourIntervalLimitInMilliseconds = 6 * 24 * 60 * 60 * 1000; // HOUR granularity for timeframes below 6d
  const dayIntervalLimitInMilliseconds = 30 * 24 * 60 * 60 * 1000; // DAY granularity for timeframes below 30d

  if (intervalInMilliseconds <= minuteIntervalLimitInMilliseconds) {
    return 'MINUTE';
  } else if (intervalInMilliseconds <= hourIntervalLimitInMilliseconds) {
    return 'HOUR';
  } else if (intervalInMilliseconds <= dayIntervalLimitInMilliseconds) {
    return 'DAY';
  }
  return 'MONTH';
};

/**
 * Get corresponding moment interval in milliseconds.
 *
 * @param {QueryInterval} interval The interval
 * @returns {DurationInputArg2 | null} Interval as moment time unit
 */
export const getMomentTimeUnitForQueryInterval = (interval: QueryInterval): DurationInputArg2 | null => {
  switch (interval) {
    case 'MINUTE':
      return 'minute';
    case 'HOUR':
      return 'hour';
    case 'DAY':
      return 'day';
    case 'MONTH':
      return 'month';
    default:
      return null;
  }
};
