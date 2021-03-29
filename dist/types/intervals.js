"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var QUERY_INTERVAL, QUERY_INTERVAL_LIST, calculateAutoInterval, calculateAutoIntervalFromRange, intervalToMilliseconds;
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

      _export("calculateAutoIntervalFromRange", calculateAutoIntervalFromRange = function calculateAutoIntervalFromRange(from, to) {
        var dataPointIntervalMs = (to - from) / 200;

        if (dataPointIntervalMs <= 1000) {
          return QUERY_INTERVAL.SECOND;
        } else if (dataPointIntervalMs > 1000 && dataPointIntervalMs <= 60000) {
          return QUERY_INTERVAL.MINUTE;
        } else if (dataPointIntervalMs > 60000 && dataPointIntervalMs <= 3600000) {
          return QUERY_INTERVAL.HOUR;
        } else if (dataPointIntervalMs > 3600000 && dataPointIntervalMs <= 86400000) {
          return QUERY_INTERVAL.DAY;
        } else {
          return QUERY_INTERVAL.MONTH;
        }
      });
      /**
       * Get corresponding interval in milliseconds.
       * @param {String} interval The interval
       * @returns {number} Interval in milliseconds or -1 if unknown.
       */


      _export("intervalToMilliseconds", intervalToMilliseconds = function intervalToMilliseconds(interval) {
        switch (interval) {
          case QUERY_INTERVAL.SECOND:
            return 1000;

          case QUERY_INTERVAL.MINUTE:
            return 1000 * 60;

          case QUERY_INTERVAL.HOUR:
            return 1000 * 60 * 60;

          case QUERY_INTERVAL.DAY:
            return 1000 * 60 * 60 * 24;

          case QUERY_INTERVAL.MONTH:
            return 1000 * 60 * 60 * 24 * 30;

          default:
            return -1;
        }
      });
    }
  };
});
//# sourceMappingURL=intervals.js.map
