"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var QUERY_INTERVAL, QUERY_INTERVAL_LIST, calculateAutoInterval;
  return {
    setters: [],
    execute: function () {
      _export("QUERY_INTERVAL", QUERY_INTERVAL = {
        SECOND: 'SECOND',
        MINUTE: 'MINUTE',
        HOUR: 'HOUR',
        DAY: 'DAY',
        MONTH: 'MONTH',
        AUTO: 'AUTO'
      });

      _export("QUERY_INTERVAL_LIST", QUERY_INTERVAL_LIST = Object.keys(QUERY_INTERVAL).map(function (key) {
        return QUERY_INTERVAL[key];
      }));

      _export("calculateAutoInterval", calculateAutoInterval = function calculateAutoInterval(intervalMs) {
        if (intervalMs <= 1000) {
          return QUERY_INTERVAL.SECOND;
        } else if (intervalMs < 60000) {
          return QUERY_INTERVAL.MINUTE;
        } else if (intervalMs >= 60000 && intervalMs < 604800) {
          return QUERY_INTERVAL.HOUR;
        } else if (intervalMs >= 604800 && intervalMs < 2592000) {
          return QUERY_INTERVAL.DAY;
        } else {
          return QUERY_INTERVAL.MONTH;
        }
      });
    }
  };
});
//# sourceMappingURL=intervals.js.map
