"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var RequestHandler;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      RequestHandler =
      /*#__PURE__*/
      function () {
        function RequestHandler(backendService, headers, withCredentials) {
          _classCallCheck(this, RequestHandler);

          this.backendService = backendService;
          this.headers = headers;
          this.withCredentials = withCredentials;
        }

        _createClass(RequestHandler, [{
          key: "doRequest",
          value: function doRequest(options) {
            options.withCredentials = this.withCredentials;
            options.headers = this.headers;
            return this.backendService.datasourceRequest(options);
          }
        }]);

        return RequestHandler;
      }();

      ;

      _export("default", RequestHandler);
    }
  };
});
//# sourceMappingURL=requestHandler.js.map
