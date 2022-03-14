"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LicenseService =
/*#__PURE__*/
function () {
  function LicenseService(requestHandler, baseURL) {
    _classCallCheck(this, LicenseService);

    this.requestHandler = requestHandler;
    this.baseURL = baseURL;
  }

  _createClass(LicenseService, [{
    key: "_fetchLicensesForEndpoint",
    value: function () {
      var _fetchLicensesForEndpoint2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(endpoint, mapperFunction) {
        var requestOptions, licensesResponse, licenses, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, license;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                requestOptions = {
                  url: this.baseURL + endpoint,
                  method: 'GET'
                };
                _context.next = 3;
                return this.requestHandler.doRequest(requestOptions);

              case 3:
                licensesResponse = _context.sent;

                if (!(licensesResponse.status !== 200)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", []);

              case 6:
                licenses = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 10;

                for (_iterator = licensesResponse.data.data.result.items[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  item = _step.value;
                  license = mapperFunction(item);
                  licenses.push(license);
                }

                _context.next = 18;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](10);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 18:
                _context.prev = 18;
                _context.prev = 19;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 21:
                _context.prev = 21;

                if (!_didIteratorError) {
                  _context.next = 24;
                  break;
                }

                throw _iteratorError;

              case 24:
                return _context.finish(21);

              case 25:
                return _context.finish(18);

              case 26:
                return _context.abrupt("return", licenses);

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[10, 14, 18, 26], [19,, 21, 25]]);
      }));

      function _fetchLicensesForEndpoint(_x, _x2) {
        return _fetchLicensesForEndpoint2.apply(this, arguments);
      }

      return _fetchLicensesForEndpoint;
    }()
  }, {
    key: "fetchLicenses",
    value: function () {
      var _fetchLicenses = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var allLicenses, licenseEndpoints, _i, _licenseEndpoints, item, licenses;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                allLicenses = [];
                licenseEndpoints = [{
                  endpoint: '/analytics/licenses',
                  mapperFunc: function mapperFunc(item) {
                    return _objectSpread({}, item, {
                      'label': item.name ? item.name : item.licenseKey
                    });
                  }
                }, {
                  endpoint: '/analytics/virtual-licenses',
                  mapperFunc: function mapperFunc(item) {
                    return _objectSpread({}, item, {
                      'licenseKey': item.id,
                      'label': item.name ? item.name : item.id
                    });
                  }
                }, {
                  endpoint: '/analytics/demo-licenses',
                  mapperFunc: function mapperFunc(item) {
                    return _objectSpread({}, item, {
                      'licenseKey': item.id,
                      'label': item.name ? item.name : item.id
                    });
                  }
                }];
                _i = 0, _licenseEndpoints = licenseEndpoints;

              case 3:
                if (!(_i < _licenseEndpoints.length)) {
                  _context2.next = 17;
                  break;
                }

                item = _licenseEndpoints[_i];
                _context2.prev = 5;
                _context2.next = 8;
                return this._fetchLicensesForEndpoint(item.endpoint, item.mapperFunc);

              case 8:
                licenses = _context2.sent;
                allLicenses = allLicenses.concat(licenses);
                _context2.next = 14;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](5);

              case 14:
                _i++;
                _context2.next = 3;
                break;

              case 17:
                return _context2.abrupt("return", allLicenses);

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 12]]);
      }));

      function fetchLicenses() {
        return _fetchLicenses.apply(this, arguments);
      }

      return fetchLicenses;
    }()
  }]);

  return LicenseService;
}();

;
var _default = LicenseService;
exports["default"] = _default;
//# sourceMappingURL=licenseService.js.map
