'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var AGGREGATION, AGGREGATION_LIST;
  return {
    setters: [],
    execute: function () {
      _export('AGGREGATION', AGGREGATION = {
        COUNT: 'count',
        SUM: 'sum',
        AVG: 'avg',
        MIN: 'min',
        MAX: 'max',
        STDDEV: 'stddev',
        PERCENTILE: 'percentile',
        VARIANCE: 'variance',
        MEDIAN: 'median'
      });

      _export('AGGREGATION', AGGREGATION);

      _export('AGGREGATION_LIST', AGGREGATION_LIST = Object.keys(AGGREGATION).map(function (key) {
        return AGGREGATION[key];
      }));

      _export('AGGREGATION_LIST', AGGREGATION_LIST);
    }
  };
});
//# sourceMappingURL=aggregations.js.map
