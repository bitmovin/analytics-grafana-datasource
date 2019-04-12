"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AGGREGATION_LIST = exports.AGGREGATION = void 0;
var AGGREGATION = {
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
exports.AGGREGATION = AGGREGATION;
var AGGREGATION_LIST = Object.keys(AGGREGATION).map(function (key) {
  return AGGREGATION[key];
});
exports.AGGREGATION_LIST = AGGREGATION_LIST;
//# sourceMappingURL=aggregations.js.map
