"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAutoIntervalFromRange = exports.calculateAutoInterval = exports.QUERY_INTERVAL_LIST = exports.QUERY_INTERVAL = void 0;
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

exports.calculateAutoInterval = calculateAutoInterval;

var calculateAutoIntervalFromRange = function calculateAutoIntervalFromRange(from, to) {
  var dataPointIntervalMs = (to - from) / 200;

  if (dataPointIntervalMs <= 1000) {
    return QUERY_INTERVAL.SECOND;
  } else if (dataPointIntervalMs > 1000 && dataPointIntervalMs <= 60000) {
    return QUERY_INTERVAL.MINUTE;
  } else if (dataPointIntervalMs > 60000 && dataPointIntervalMs <= 3600000) {
    return QUERY_INTERVAL.HOUR;
  } else if (dataPointIntervalMs > 3600000 && dataPointIntervalMs <= 86400000) {
    return QUERY_INTERVAL.DAY;
  } else {
    return QUERY_INTERVAL.MONTH;
  }
};

exports.calculateAutoIntervalFromRange = calculateAutoIntervalFromRange;
//# sourceMappingURL=intervals.js.map
