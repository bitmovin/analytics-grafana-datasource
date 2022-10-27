"use strict";

System.register(["./types/resultFormat", "./utils"], function (_export, _context) {
  "use strict";

  var ResultFormat, padTimeSeriesAndSortByDate, transformDataToTable, transformDataToTimeSeries, transform;
  return {
    setters: [function (_typesResultFormat) {
      ResultFormat = _typesResultFormat.ResultFormat;
    }, function (_utils) {
      padTimeSeriesAndSortByDate = _utils.padTimeSeriesAndSortByDate;
    }],
    execute: function () {
      transformDataToTable = function transformDataToTable(rows, options) {
        var datapoints = _.map(rows, function (row) {
          var timestamp = row[0];
          var value = row[1];
          return [value, timestamp];
        });

        return {
          target: options.resultTarget,
          datapoints: datapoints
        };
      };

      transformDataToTimeSeries = function transformDataToTimeSeries(analyticsResult, options) {
        var groupBys = options.data.groupBy;
        var series = [];
        var datapointsCnt = 0;
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
            datapointsCnt++;
          });

          for (var _i = 0, _Object$keys = Object.keys(groupings); _i < _Object$keys.length; _i++) {
            var key = _Object$keys[_i];
            var datapoints = groupings[key];
            var groupData = {
              target: key,
              datapoints: _.orderBy(datapoints, [1], 'asc')
            };
            series.push(groupData);
          }
        } else {
          var paddedSeries = padTimeSeriesAndSortByDate(analyticsResult.rows, fromDate, toDate, interval);
          var result = transformDataToTable(paddedSeries, options);
          result.datapoints = _.orderBy(result.datapoints, [1], 'asc');
          series.push(result);
          datapointsCnt = result.datapoints.length;
        }

        return {
          series: series,
          datapointsCnt: datapointsCnt
        };
      };

      _export("transform", transform = function transform(response, options) {
        var analyticsResult = response.data.data.result;
        var config = response.config;

        if (config.resultFormat === ResultFormat.TABLE) {
          var tableData = transformDataToTable(analyticsResult.rows, config);
          return {
            series: [tableData],
            datapointsCnt: tableData.datapoints.length
          };
        } else if (config.resultFormat === ResultFormat.TIME_SERIES) {
          return transformDataToTimeSeries(analyticsResult, config);
        }
      });
    }
  };
});
//# sourceMappingURL=result_transformer.js.map
