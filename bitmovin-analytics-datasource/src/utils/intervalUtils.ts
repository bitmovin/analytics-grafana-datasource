import { QUERY_INTERVAL } from '../types';

/**
 * Get corresponding interval in milliseconds.
 * @param {String} interval The interval
 * @returns {number} Interval in milliseconds or -1 if unknown.
 */
export const intervalToMilliseconds = (interval: string): number => {
  switch (interval) {
    case QUERY_INTERVAL.SECOND:
      return 1000;
    case QUERY_INTERVAL.MINUTE:
      return 1000 * 60;
    case QUERY_INTERVAL.HOUR:
      return 1000 * 60 * 60;
    case QUERY_INTERVAL.DAY:
      return 1000 * 60 * 60 * 24;
    case QUERY_INTERVAL.MONTH:
      return 1000 * 60 * 60 * 24 * 30;
    default:
      return -1;
  }
};
