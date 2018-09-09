'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = require('./datasource');

var _query_ctrl = require('./query_ctrl');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BitmovinAnalyticsConfigCtrl = function BitmovinAnalyticsConfigCtrl($scope) {
  _classCallCheck(this, BitmovinAnalyticsConfigCtrl);

  this.current.url = this.current.url || 'https://api.bitmovin.com/v1';
};

BitmovinAnalyticsConfigCtrl.templateUrl = 'partials/config.html';

var BitmovinAnalyticsQueryOptionsCtrl = function BitmovinAnalyticsQueryOptionsCtrl() {
  _classCallCheck(this, BitmovinAnalyticsQueryOptionsCtrl);
};

BitmovinAnalyticsQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

var BitmovinAnalyticsAnnotationsQueryCtrl = function BitmovinAnalyticsAnnotationsQueryCtrl() {
  _classCallCheck(this, BitmovinAnalyticsAnnotationsQueryCtrl);
};

BitmovinAnalyticsAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

exports.Datasource = _datasource.BitmovinAnalyticsDatasource;
exports.QueryCtrl = _query_ctrl.BitmovinAnalyticsDatasourceQueryCtrl;
exports.ConfigCtrl = BitmovinAnalyticsConfigCtrl;
exports.QueryOptionsCtrl = BitmovinAnalyticsQueryOptionsCtrl;
exports.AnnotationsQueryCtrl = BitmovinAnalyticsAnnotationsQueryCtrl;
//# sourceMappingURL=module.js.map
