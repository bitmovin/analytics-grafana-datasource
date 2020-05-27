"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = void 0;

var _resultFormat = require("./types/resultFormat");

var _utils = require("./utils");

var transformDataToTable = function transformDataToTable(rows, options) {
  var datapoints = _.map(rows, function (row) {
    var timestmap = row[0];
    var value = row[1];
    return [value, timestmap];
  });

  return {
    target: options.resultTarget,
    datapoints: datapoints
  };
};

var transformDataToTimeSeries = function transformDataToTimeSeries(analyticsResult, options) {
  var groupBys = options.data.groupBy;
  var results = [];
  var interval = options.data.interval;
  var fromDate = new Date(options.data.start).getTime();
  var toDate = new Date(options.data.end).getTime();

  if (groupBys.length > 0) {
    var groupings = {};

    _.map(analyticsResult.rows, function (row) {
      var metricLabel = row[1];

      if (!groupings[metricLabel]) {
        groupings[metricLabel] = [];
      }

      var value = row[2];
      var timestamp = row[0];
      groupings[metricLabel].push([value, timestamp]);
    });

    for (var _i = 0, _Object$keys = Object.keys(groupings); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      var datapoints = groupings[key]; //padTimeSeriesAndSortByDate(groupings[key], fromDate, toDate, interval);

      var series = {
        target: key,
        datapoints: _.orderBy(datapoints, [1], 'asc')
      };
      results.push(series);
    }
  } else {
    var paddedSeries = (0, _utils.padTimeSeriesAndSortByDate)(analyticsResult.rows, fromDate, toDate, interval);
    var result = transformDataToTable(paddedSeries, options);
    result.datapoints = _.orderBy(result.datapoints, [1], 'asc');
    results.push(result);
  }

  return results;
};

var transform = function transform(response, options) {
  var analyticsResult = response.data.data.result;
  var config = response.config;

  if (config.resultFormat === _resultFormat.ResultFormat.TABLE) {
    return [transformDataToTable(analyticsResult.rows, config)];
  } else if (config.resultFormat === _resultFormat.ResultFormat.TIME_SERIES) {
    return transformDataToTimeSeries(analyticsResult, config);
  }
};

exports.transform = transform;
//# sourceMappingURL=result_transformer.js.map
