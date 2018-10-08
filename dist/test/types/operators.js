'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OPERATOR = exports.OPERATOR = {
  GT: 'GT',
  GTE: 'GTE',
  LT: 'LT',
  LTE: 'LTE',
  EQ: 'EQ',
  NQ: 'NQ',
  CONTAINS: 'CONTAINS',
  NOTCONTAINS: 'NOTCONTAINS'
};

var OPERATOR_LIST = exports.OPERATOR_LIST = Object.keys(OPERATOR).map(function (key) {
  return OPERATOR[key];
});
//# sourceMappingURL=operators.js.map
