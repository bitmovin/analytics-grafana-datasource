"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Datasource", {
  enumerable: true,
  get: function get() {
    return _datasource.BitmovinAnalyticsDatasource;
  }
});
Object.defineProperty(exports, "QueryCtrl", {
  enumerable: true,
  get: function get() {
    return _query_ctrl.BitmovinAnalyticsDatasourceQueryCtrl;
  }
});
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = void 0;

var _datasource = require("./datasource");

var _query_ctrl = require("./query_ctrl");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BitmovinAnalyticsConfigCtrl = function BitmovinAnalyticsConfigCtrl($scope) {
  _classCallCheck(this, BitmovinAnalyticsConfigCtrl);

  this.current.url = this.current.url || 'https://api.bitmovin.com/v1';
};

exports.ConfigCtrl = BitmovinAnalyticsConfigCtrl;
BitmovinAnalyticsConfigCtrl.templateUrl = 'partials/config.html';

var BitmovinAnalyticsQueryOptionsCtrl = function BitmovinAnalyticsQueryOptionsCtrl() {
  _classCallCheck(this, BitmovinAnalyticsQueryOptionsCtrl);
};

exports.QueryOptionsCtrl = BitmovinAnalyticsQueryOptionsCtrl;
BitmovinAnalyticsQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

var BitmovinAnalyticsAnnotationsQueryCtrl = function BitmovinAnalyticsAnnotationsQueryCtrl() {
  _classCallCheck(this, BitmovinAnalyticsAnnotationsQueryCtrl);
};

exports.AnnotationsQueryCtrl = BitmovinAnalyticsAnnotationsQueryCtrl;
BitmovinAnalyticsAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
//# sourceMappingURL=module.js.map
