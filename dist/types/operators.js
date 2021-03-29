"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var OPERATOR, ORDERBY, OPERATOR_LIST, ORDERBY_LIST;
  return {
    setters: [],
    execute: function () {
      _export("OPERATOR", OPERATOR = {
        GT: 'GT',
        GTE: 'GTE',
        LT: 'LT',
        LTE: 'LTE',
        EQ: 'EQ',
        NE: 'NE',
        CONTAINS: 'CONTAINS',
        NOTCONTAINS: 'NOTCONTAINS',
        IN: 'IN'
      });

      _export("ORDERBY", ORDERBY = {
        ASC: 'ASC',
        DESC: 'DESC'
      });

      _export("OPERATOR_LIST", OPERATOR_LIST = Object.keys(OPERATOR).map(function (key) {
        return OPERATOR[key];
      }));

      _export("ORDERBY_LIST", ORDERBY_LIST = Object.keys(ORDERBY).map(function (key) {
        return ORDERBY[key];
      }));
    }
  };
});
//# sourceMappingURL=operators.js.map
