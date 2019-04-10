'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var OPERATOR, ORDERBY, OPERATOR_LIST, ORDERBY_LIST;
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

      _export('ORDERBY', ORDERBY = {
        ASC: 'ASC',
        DESC: 'DESC'
      });

      _export('ORDERBY', ORDERBY);

      _export('OPERATOR_LIST', OPERATOR_LIST = Object.keys(OPERATOR).map(function (key) {
        return OPERATOR[key];
      }));

      _export('OPERATOR_LIST', OPERATOR_LIST);

      _export('ORDERBY_LIST', ORDERBY_LIST = Object.keys(ORDERBY).map(function (key) {
        return ORDERBY[key];
      }));

      _export('ORDERBY_LIST', ORDERBY_LIST);
    }
  };
});
//# sourceMappingURL=operators.js.map
