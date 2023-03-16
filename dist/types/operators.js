"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDERBY_LIST = exports.OPERATOR_LIST = exports.ORDERBY = exports.OPERATOR = void 0;
var OPERATOR;
(function (OPERATOR) {
    OPERATOR["GT"] = "GT";
    OPERATOR["GTE"] = "GTE";
    OPERATOR["LT"] = "LT";
    OPERATOR["LTE"] = "LTE";
    OPERATOR["EQ"] = "EQ";
    OPERATOR["NE"] = "NE";
    OPERATOR["CONTAINS"] = "CONTAINS";
    OPERATOR["NOTCONTAINS"] = "NOTCONTAINS";
    OPERATOR["IN"] = "IN";
})(OPERATOR = exports.OPERATOR || (exports.OPERATOR = {}));
var ORDERBY;
(function (ORDERBY) {
    ORDERBY["ASC"] = "ASC";
    ORDERBY["DESC"] = "DESC";
})(ORDERBY = exports.ORDERBY || (exports.ORDERBY = {}));
exports.OPERATOR_LIST = Object.values(OPERATOR);
exports.ORDERBY_LIST = Object.values(ORDERBY);
//# sourceMappingURL=operators.js.map