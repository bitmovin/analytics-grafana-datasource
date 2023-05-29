"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padTimeSeriesAndSortByDate = void 0;
var intervalUtils_1 = require("./intervalUtils");
var fillDataRow = function (series, timestamp, value) {
    var dataRow = series.find(function (i) { return i[0] === timestamp; });
    if (dataRow == null) {
        series.push([timestamp, value]);
    }
};
var padTimeSeriesAndSortByDate = function (series, fromDate, toDate, interval, padWith) {
    if (padWith === void 0) { padWith = null; }
    var intervalInMillis = (0, intervalUtils_1.intervalToMilliseconds)(interval);
    if (series == null || series.length === 0 || intervalInMillis < 0) {
        return series;
    }
    var timestampIndex = 0;
    var referenceDate = series[0][timestampIndex];
    for (var timestamp = referenceDate; timestamp < toDate; timestamp += intervalInMillis) {
        fillDataRow(series, timestamp, padWith);
    }
    for (var timestamp = referenceDate - intervalInMillis; timestamp >= fromDate; timestamp -= intervalInMillis) {
        fillDataRow(series, timestamp, padWith);
    }
    return series;
};
exports.padTimeSeriesAndSortByDate = padTimeSeriesAndSortByDate;
//# sourceMappingURL=dataUtils.js.map