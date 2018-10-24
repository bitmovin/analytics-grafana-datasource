'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var QUERY_INTERVAL = exports.QUERY_INTERVAL = {
  MINUTE: 'MINUTE',
  HOUR: 'HOUR',
  DAY: 'DAY',
  MONTH: 'MONTH',
  AUTO: 'AUTO'
};
var QUERY_INTERVAL_LIST = exports.QUERY_INTERVAL_LIST = Object.keys(QUERY_INTERVAL).map(function (key) {
  return QUERY_INTERVAL[key];
});

var calculateAutoInterval = exports.calculateAutoInterval = function calculateAutoInterval(intervalMs) {
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
//# sourceMappingURL=intervals.js.map
