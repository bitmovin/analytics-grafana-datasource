"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = void 0;
var datasource_1 = require("./datasource");
Object.defineProperty(exports, "Datasource", { enumerable: true, get: function () { return datasource_1.BitmovinAnalyticsDatasource; } });
var query_ctrl_1 = require("./query_ctrl");
Object.defineProperty(exports, "QueryCtrl", { enumerable: true, get: function () { return query_ctrl_1.BitmovinAnalyticsDatasourceQueryCtrl; } });
var BitmovinAnalyticsConfigCtrl = (function () {
    function BitmovinAnalyticsConfigCtrl($scope) {
        this.current.url = this.current.url || 'https://api.bitmovin.com/v1';
    }
    return BitmovinAnalyticsConfigCtrl;
}());
exports.ConfigCtrl = BitmovinAnalyticsConfigCtrl;
BitmovinAnalyticsConfigCtrl.templateUrl = 'partials/config.html';
var BitmovinAnalyticsQueryOptionsCtrl = (function () {
    function BitmovinAnalyticsQueryOptionsCtrl() {
    }
    return BitmovinAnalyticsQueryOptionsCtrl;
}());
exports.QueryOptionsCtrl = BitmovinAnalyticsQueryOptionsCtrl;
BitmovinAnalyticsQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
var BitmovinAnalyticsAnnotationsQueryCtrl = (function () {
    function BitmovinAnalyticsAnnotationsQueryCtrl() {
    }
    return BitmovinAnalyticsAnnotationsQueryCtrl;
}());
exports.AnnotationsQueryCtrl = BitmovinAnalyticsAnnotationsQueryCtrl;
BitmovinAnalyticsAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
//# sourceMappingURL=module.js.map