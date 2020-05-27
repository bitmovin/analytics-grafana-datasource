"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.padTimeSeriesAndSortByDate = void 0;

var _intervals = require("./types/intervals");

var fillDataRow = function fillDataRow(series, timestamp, value) {
  var dataRow = series.find(function (i) {
    return i[0] === timestamp;
  });

  if (dataRow == null) {
    series.push([timestamp, value]);
  }
};
/**
 * Add padding to the series where no data is available for given interval.
 * @param {Array<[timestamp: any, value: number]>} series Series that should be null-padded
 * @param {number} fromDate Start date of query as unix timestamp
 * @param {number} toDate End date of query as unix timestamp
 * @param {String} interval The interval used for the query, e.g. SECOND, MINUTE, HOUR, ...
 * @param {any} padWith The value that is used for padding, defaults to 0
 */


var padTimeSeriesAndSortByDate = function padTimeSeriesAndSortByDate(series, fromDate, toDate, interval) {
  var padWith = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var intervalInMillis = (0, _intervals.intervalToMilliseconds)(interval);

  if (series == null || series.length === 0 || intervalInMillis < 0) {
    return series;
  }

  var timestampIndex = 0;
  var referenceDate = series[0][timestampIndex];

  for (var timestamp = referenceDate; timestamp < toDate; timestamp += intervalInMillis) {
    fillDataRow(series, timestamp, padWith);
  }

  for (var _timestamp = referenceDate - intervalInMillis; _timestamp >= fromDate; _timestamp -= intervalInMillis) {
    fillDataRow(series, _timestamp, padWith);
  }

  return series;
};

exports.padTimeSeriesAndSortByDate = padTimeSeriesAndSortByDate;
//# sourceMappingURL=utils.js.map
