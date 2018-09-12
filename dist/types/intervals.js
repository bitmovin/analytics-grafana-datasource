'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var QUERY_INTERVAL, QUERY_INTERVAL_LIST;
  return {
    setters: [],
    execute: function () {
      _export('QUERY_INTERVAL', QUERY_INTERVAL = {
        MINUTE: 'MINUTE',
        HOUR: 'HOUR',
        DAY: 'DAY',
        MONTH: 'MONTH'
      });

      _export('QUERY_INTERVAL', QUERY_INTERVAL);

      _export('QUERY_INTERVAL_LIST', QUERY_INTERVAL_LIST = Object.keys(QUERY_INTERVAL).map(function (key) {
        return QUERY_INTERVAL[key];
      }));

      _export('QUERY_INTERVAL_LIST', QUERY_INTERVAL_LIST);
    }
  };
});
//# sourceMappingURL=intervals.js.map
