export type QueryInterval = 'MINUTE' | 'HOUR' | 'DAY';

export type SelectableQueryInterval = QueryInterval | 'AUTO';

export const SELECTABLE_QUERY_INTERVALS: Array<{ value: SelectableQueryInterval | 'AUTO'; label: string }> = [
  { value: 'AUTO', label: 'Auto' },
  { value: 'MINUTE', label: 'Minute' },
  { value: 'HOUR', label: 'Hour' },
  { value: 'DAY', label: 'Day' },
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

  if (intervalInMilliseconds <= minuteIntervalLimitInMilliseconds) {
    return 'MINUTE';
  } else if (intervalInMilliseconds <= hourIntervalLimitInMilliseconds) {
    return 'HOUR';
  }
  return 'DAY';
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
  const date = new Date(startTimestamp);
  switch (interval) {
    case 'MINUTE':
      if (date.getSeconds() === 0 && date.getMilliseconds() === 0) {
        return startTimestamp;
      }
      return date.setMinutes(date.getMinutes() + 1, 0, 0);
    case 'HOUR':
      if (date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0) {
        return startTimestamp;
      }
      return date.setHours(date.getHours() + 1, 0, 0, 0);
    case 'DAY':
      // Take the hours and minutes value from the datapoint timestamps as the timestamps for the day interval depend on the timezone of the license
      const dataHours = new Date(dataTimestamp).getHours();
      const dataMinutes = new Date(dataTimestamp).getMinutes();
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), dataHours, dataMinutes).getTime();
  }
}
