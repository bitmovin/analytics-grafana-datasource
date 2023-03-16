"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
var resultFormat_1 = require("./types/resultFormat");
var dataUtils_1 = require("./utils/dataUtils");
var transformDataToTable = function (rows, options) {
    var datapoints = rows.map(function (row) {
        var timestamp = row[0];
        var value = row[1];
        return [value, timestamp];
    });
    return {
        target: options.resultTarget,
        datapoints: datapoints
    };
};
var transformDataToTimeSeries = function (analyticsResult, options) {
    var groupBys = options.data.groupBy;
    var series = [];
    var datapointsCnt = 0;
    var interval = options.data.interval;
    var fromDate = new Date(options.data.start).getTime();
    var toDate = new Date(options.data.end).getTime();
    if (groupBys.length > 0) {
        var groupings_1 = {};
        analyticsResult.rows.map(function (row) {
            var metricLabel = row[1];
            if (!groupings_1[metricLabel]) {
                groupings_1[metricLabel] = [[]];
            }
            var value = row[2];
            var timestamp = row[0];
            groupings_1[metricLabel].push([value, timestamp]);
            datapointsCnt++;
        });
        for (var _i = 0, _a = Object.keys(groupings_1); _i < _a.length; _i++) {
            var key = _a[_i];
            var datapoints = groupings_1[key];
            var groupData = {
                target: key,
                datapoints: sortDatapointsByTime(datapoints)
            };
            series.push(groupData);
        }
    }
    else {
        var paddedSeries = (0, dataUtils_1.padTimeSeriesAndSortByDate)(analyticsResult.rows, fromDate, toDate, interval);
        var result = transformDataToTable(paddedSeries, options);
        result.datapoints = sortDatapointsByTime(result.datapoints);
        series.push(result);
        datapointsCnt = result.datapoints.length;
    }
    return {
        series: series,
        datapointsCnt: datapointsCnt
    };
};
var sortDatapointsByTime = function (datapoints) {
    return datapoints.sort(function (a, b) { return a[1] - b[1]; });
};
var transform = function (response, options) {
    var analyticsResult = response.data.data.result;
    var config = response.config;
    if (config.resultFormat === resultFormat_1.ResultFormat.TABLE) {
        var tableData = transformDataToTable(analyticsResult.rows, config);
        return {
            series: [tableData],
            datapointsCnt: tableData.datapoints.length
        };
    }
    else if (config.resultFormat === resultFormat_1.ResultFormat.TIME_SERIES) {
        return transformDataToTimeSeries(analyticsResult, config);
    }
};
exports.transform = transform;
//# sourceMappingURL=result_transformer.js.map