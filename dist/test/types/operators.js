"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ORDERBY_LIST = exports.OPERATOR_LIST = exports.ORDERBY = exports.OPERATOR = void 0;
var OPERATOR = {
  GT: 'GT',
  GTE: 'GTE',
  LT: 'LT',
  LTE: 'LTE',
  EQ: 'EQ',
  NQ: 'NQ',
  CONTAINS: 'CONTAINS',
  NOTCONTAINS: 'NOTCONTAINS'
};
exports.OPERATOR = OPERATOR;
var ORDERBY = {
  ASC: 'ASC',
  DESC: 'DESC'
};
exports.ORDERBY = ORDERBY;
var OPERATOR_LIST = Object.keys(OPERATOR).map(function (key) {
  return OPERATOR[key];
});
exports.OPERATOR_LIST = OPERATOR_LIST;
var ORDERBY_LIST = Object.keys(ORDERBY).map(function (key) {
  return ORDERBY[key];
});
exports.ORDERBY_LIST = ORDERBY_LIST;
//# sourceMappingURL=operators.js.map
