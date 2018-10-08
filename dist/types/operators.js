'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var OPERATOR, OPERATOR_LIST;
  return {
    setters: [],
    execute: function () {
      _export('OPERATOR', OPERATOR = {
        GT: 'GT',
        GTE: 'GTE',
        LT: 'LT',
        LTE: 'LTE',
        EQ: 'EQ',
        NQ: 'NQ',
        CONTAINS: 'CONTAINS',
        NOTCONTAINS: 'NOTCONTAINS'
      });

      _export('OPERATOR', OPERATOR);

      _export('OPERATOR_LIST', OPERATOR_LIST = Object.keys(OPERATOR).map(function (key) {
        return OPERATOR[key];
      }));

      _export('OPERATOR_LIST', OPERATOR_LIST);
    }
  };
});
//# sourceMappingURL=operators.js.map
