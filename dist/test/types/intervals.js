"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAutoInterval = exports.QUERY_INTERVAL_LIST = exports.QUERY_INTERVAL = void 0;
var QUERY_INTERVAL = {
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
  if (intervalMs < 60000) {
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
//# sourceMappingURL=intervals.js.map
