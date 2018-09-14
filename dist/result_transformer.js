'use strict';

System.register(['./types/resultFormat'], function (_export, _context) {
  "use strict";

  var ResultFormat, transformDataToTable, transformDataToTimeSeries, transform;
  return {
    setters: [function (_typesResultFormat) {
      ResultFormat = _typesResultFormat.ResultFormat;
    }],
    execute: function () {
      transformDataToTable = function transformDataToTable(analyticsResult, options) {
        var datapoints = _.map(analyticsResult.rows, function (row) {
          return [row[1], row[0]]; // value, timestamp
        });

        return {
          target: options.resultTarget,
          datapoints: datapoints
        };
      };

      transformDataToTimeSeries = function transformDataToTimeSeries(analyticsResult, options) {
        var groupBys = options.data.groupBy;
        var results = [];
        if (groupBys.length > 0) {
          var groupings = {};
          _.map(analyticsResult.rows, function (row) {
            var metricLabel = row[1];
            if (!groupings[metricLabel]) {
              groupings[metricLabel] = [];
            }
            groupings[metricLabel].push([row[2], row[0]]); // value, timestamp
          });
          Object.keys(groupings).map(function (key) {
            var datapoints = groupings[key];
            var series = {
              target: key,
              datapoints: _.orderBy(datapoints, [1], 'asc')
            };
            results.push(series);
          });
        } else {
          var result = transformDataToTable(analyticsResult, options);
          result.datapoints = _.orderBy(result.datapoints, [1], 'asc');
          results.push(result);
        }
        return results;
      };

      _export('transform', transform = function transform(response, options) {
        var analyticsResult = response.data.data.result;
        var config = response.config;
        if (config.resultFormat === ResultFormat.TABLE) {
          return [transformDataToTable(analyticsResult, config)];
        } else if (config.resultFormat === ResultFormat.TIME_SERIES) {
          return transformDataToTimeSeries(analyticsResult, config);
        }
      });

      _export('transform', transform);
    }
  };
});
//# sourceMappingURL=result_transformer.js.map
