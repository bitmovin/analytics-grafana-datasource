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

/**
 * Get corresponding interval in milliseconds.
 *
 * @param {QueryInterval} interval The interval
 * @returns {number} Interval in milliseconds or -1 if unknown.
 */
export const intervalToMilliseconds = (interval: QueryInterval): number => {
  switch (interval) {
    case 'MINUTE':
      return 1000 * 60;
    case 'HOUR':
      return 1000 * 60 * 60;
    case 'DAY':
      return 1000 * 60 * 60 * 24;
    default:
      return -1;
  }
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

/**
 * Rounds up a timestamp according to the specified query interval.
 *
 * @param {number} startTimestamp The start timestamp of the query.
 * @param {QueryInterval} interval       The query interval.
 * @param {number} dataTimestamp  The timestamp of a data point. Needed to calculate correct Day interval timestamp.
 * @return {number} The rounded up timestamp.
 */
export function ceilTimestampAccordingToQueryInterval(
  startTimestamp: number,
  interval: QueryInterval,
  dataTimestamp: number
): number {
  const startDate = new Date(startTimestamp);
  switch (interval) {
    case 'MINUTE':
      if (startDate.getSeconds() === 0 && startDate.getMilliseconds() === 0) {
        return startTimestamp;
      }
      return startDate.setMinutes(startDate.getMinutes() + 1, 0, 0);
    case 'HOUR':
      if (startDate.getMinutes() === 0 && startDate.getSeconds() === 0 && startDate.getMilliseconds() === 0) {
        return startTimestamp;
      }
      return startDate.setHours(startDate.getHours() + 1, 0, 0, 0);
    case 'DAY':
      // Take the hours and minutes value from the datapoint timestamps as the timestamps for the day interval depend on the timezone of the license
      const dataHours = new Date(dataTimestamp).getHours();
      const dataMinutes = new Date(dataTimestamp).getMinutes();
      const startDateWithCorrectTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        dataHours,
        dataMinutes
      );

      if (startDateWithCorrectTime.getTime() > startTimestamp) {
        return startDateWithCorrectTime.getTime();
      }
      return new Date(startDateWithCorrectTime).setDate(startDateWithCorrectTime.getDate() + 1);
  }
}
