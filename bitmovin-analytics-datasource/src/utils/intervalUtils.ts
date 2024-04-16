export type QueryInterval = 'MINUTE' | 'HOUR' | 'DAY';

export const QueryIntervals: Array<{ value: QueryInterval; label: string }> = [
  { value: 'AUTO', label: 'Auto' },
  { value: 'SECOND', label: 'Second' },
  { value: 'MINUTE', label: 'Minute' },
  { value: 'HOUR', label: 'Hour' },
  { value: 'DAY', label: 'Day' },
  { value: 'MONTH', label: 'Month' },
];

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
