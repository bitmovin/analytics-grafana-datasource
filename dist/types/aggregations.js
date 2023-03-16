"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGGREGATION_LIST = exports.AGGREGATION = void 0;
var AGGREGATION;
(function (AGGREGATION) {
    AGGREGATION["COUNT"] = "count";
    AGGREGATION["SUM"] = "sum";
    AGGREGATION["AVG"] = "avg";
    AGGREGATION["MIN"] = "min";
    AGGREGATION["MAX"] = "max";
    AGGREGATION["STDDEV"] = "stddev";
    AGGREGATION["PERCENTILE"] = "percentile";
    AGGREGATION["VARIANCE"] = "variance";
    AGGREGATION["MEDIAN"] = "median";
})(AGGREGATION = exports.AGGREGATION || (exports.AGGREGATION = {}));
exports.AGGREGATION_LIST = Object.values(AGGREGATION);
//# sourceMappingURL=aggregations.js.map