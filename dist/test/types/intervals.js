"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.intervalToMilliseconds = exports.calculateAutoInterval = exports.QUERY_INTERVAL_LIST = exports.QUERY_INTERVAL = void 0;
var QUERY_INTERVAL = {
  SECOND: 'SECOND',
  MINUTE: 'MINUTE',
  HOUR: 'HOUR',
  DAY: 'DAY',
  MONTH: 'MONTH',
  AUTO: 'AUTO'
};
exports.QUERY_INTERVAL = QUERY_INTERVAL;
var QUERY_INTERVAL_LIST = Object.keys(QUERY_INTERVAL).map(function (key) {
  return QUERY_INTERVAL[key];
});
exports.QUERY_INTERVAL_LIST = QUERY_INTERVAL_LIST;

var calculateAutoInterval = function calculateAutoInterval(intervalMs) {
  if (intervalMs <= 1000) {
    return QUERY_INTERVAL.SECOND;
  } else if (intervalMs < 60000) {
    return QUERY_INTERVAL.MINUTE;
  } else if (intervalMs >= 60000 && intervalMs < 604800) {
    return QUERY_INTERVAL.HOUR;
  } else if (intervalMs >= 604800 && intervalMs < 2592000) {
    return QUERY_INTERVAL.DAY;
  } else {
    return QUERY_INTERVAL.MONTH;
  }
};
/**
 * Get corresponding interval in milliseconds.
 * @param {String} interval The interval
 * @returns {number} Interval in milliseconds or -1 if unknown.
 */


exports.calculateAutoInterval = calculateAutoInterval;

var intervalToMilliseconds = function intervalToMilliseconds(interval) {
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

exports.intervalToMilliseconds = intervalToMilliseconds;
//# sourceMappingURL=intervals.js.map
