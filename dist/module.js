"use strict";

System.register(["./datasource", "./query_ctrl"], function (_export, _context) {
  "use strict";

  var BitmovinAnalyticsDatasource, BitmovinAnalyticsDatasourceQueryCtrl, BitmovinAnalyticsConfigCtrl, BitmovinAnalyticsQueryOptionsCtrl, BitmovinAnalyticsAnnotationsQueryCtrl;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_datasource) {
      BitmovinAnalyticsDatasource = _datasource.BitmovinAnalyticsDatasource;
    }, function (_query_ctrl) {
      BitmovinAnalyticsDatasourceQueryCtrl = _query_ctrl.BitmovinAnalyticsDatasourceQueryCtrl;
    }],
    execute: function () {
      _export("ConfigCtrl", BitmovinAnalyticsConfigCtrl = function BitmovinAnalyticsConfigCtrl($scope) {
        _classCallCheck(this, BitmovinAnalyticsConfigCtrl);

        this.current.url = this.current.url || 'https://api.bitmovin.com/v1';
      });

      BitmovinAnalyticsConfigCtrl.templateUrl = 'partials/config.html';

      _export("QueryOptionsCtrl", BitmovinAnalyticsQueryOptionsCtrl = function BitmovinAnalyticsQueryOptionsCtrl() {
        _classCallCheck(this, BitmovinAnalyticsQueryOptionsCtrl);
      });

      BitmovinAnalyticsQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export("AnnotationsQueryCtrl", BitmovinAnalyticsAnnotationsQueryCtrl = function BitmovinAnalyticsAnnotationsQueryCtrl() {
        _classCallCheck(this, BitmovinAnalyticsAnnotationsQueryCtrl);
      });

      BitmovinAnalyticsAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

      _export("Datasource", BitmovinAnalyticsDatasource);

      _export("QueryCtrl", BitmovinAnalyticsDatasourceQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
