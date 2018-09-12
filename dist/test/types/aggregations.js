'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AGGREGATION = exports.AGGREGATION = {
  COUNT: 'count',
  SUM: 'sum',
  AVG: 'avg',
  MIN: 'min',
  MAX: 'max',
  STDDEV: 'stddev',
  PERCENTILE: 'percentile',
  VARIANCE: 'variance',
  MEDIAN: 'median'
};

var AGGREGATION_LIST = exports.AGGREGATION_LIST = Object.keys(AGGREGATION).map(function (key) {
  return AGGREGATION[key];
});
//# sourceMappingURL=aggregations.js.map
