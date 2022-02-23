"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitmovinAnalyticsDatasource = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _queryAttributes = require("./types/queryAttributes");

var _aggregations = require("./types/aggregations");

var _intervals = require("./types/intervals");

var _result_transformer = require("./result_transformer");

var _resultFormat = require("./types/resultFormat");

var _operators = require("./types/operators");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var getApiRequestUrl = function getApiRequestUrl(baseUrl, isAdAnalytics, isMetric) {
  if (isAdAnalytics === true) {
    return baseUrl + '/analytics/ads/queries';
  }

  if (isMetric == true) {
    return baseUrl + '/analytics/metrics';
  }

  return baseUrl + '/analytics/queries';
};

var mapMathOperatorToAnalyticsFilterOperator = function mapMathOperatorToAnalyticsFilterOperator(operator) {
  switch (operator) {
    case '=':
      return _operators.OPERATOR.EQ;

    case '!=':
      return _operators.OPERATOR.NE;

    case '<':
      return _operators.OPERATOR.LT;

    case '<=':
      return _operators.OPERATOR.LTE;

    case '>':
      return _operators.OPERATOR.GT;

    case '>=':
      return _operators.OPERATOR.GTE;

    default:
      return operator;
  }
};

var BitmovinAnalyticsDatasource =
/*#__PURE__*/
function () {
  function BitmovinAnalyticsDatasource(instanceSettings, $q, backendSrv, templateSrv) {
    _classCallCheck(this, BitmovinAnalyticsDatasource);

    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.isAdAnalytics = instanceSettings.jsonData.isAdAnalytics;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': instanceSettings.jsonData.apiKey
    };
    var tenantOrgId = instanceSettings.jsonData.tenantOrgId;

    if (typeof tenantOrgId === 'string' && tenantOrgId.length > 0) {
      this.headers['X-Tenant-Org-Id'] = tenantOrgId;
    }

    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }
  }

  _createClass(BitmovinAnalyticsDatasource, [{
    key: "query",
    value: function query(options) {
      var _this = this;

      var query = this.buildQueryParameters(options);
      query.targets = query.targets.filter(function (t) {
        return !t.hide;
      });

      if (query.targets.length <= 0) {
        return this.q.when({
          data: []
        });
      }

      if (this.templateSrv.getAdhocFilters) {
        query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
      } else {
        query.adhocFilters = [];
      }

      var targetResponsePromises = _lodash["default"].map(query.targets, function (target) {
        target.resultFormat = target.resultFormat || _resultFormat.ResultFormat.TIME_SERIES;
        target.interval = target.interval || _intervals.QUERY_INTERVAL.HOUR;

        var filters = _lodash["default"].map([].concat(_toConsumableArray(target.filter), _toConsumableArray(query.adhocFilters)), function (e) {
          var filter = {
            name: e.name ? e.name : e.key,
            operator: mapMathOperatorToAnalyticsFilterOperator(e.operator),
            value: _this.templateSrv.replace(e.value, options.scopedVars)
          };
          return {
            name: filter.name,
            operator: filter.operator,
            value: (0, _queryAttributes.convertFilterValueToProperType)(filter)
          };
        });

        var orderBy = _lodash["default"].map(target.orderBy, function (e) {
          return {
            name: e.name,
            order: e.order
          };
        });

        var data = {
          licenseKey: target.license,
          start: options.range.from.toISOString(),
          end: options.range.to.toISOString(),
          filters: filters,
          orderBy: orderBy
        };

        var isMetric = _queryAttributes.METRICS_ATTRIBUTE_LIST.includes(target.dimension);

        var urlAppendix = '';

        if (isMetric) {
          urlAppendix = target.dimension;
          data['metric'] = target.dimension;
        } else {
          target.metric = target.metric || _aggregations.AGGREGATION.COUNT;
          target.dimension = target.dimension || _queryAttributes.ATTRIBUTE.LICENSE_KEY;
          urlAppendix = target.metric;
          data['dimension'] = target.dimension;

          if (target.metric === 'percentile') {
            data['percentile'] = target.percentileValue;
          }
        }

        if (target.resultFormat === _resultFormat.ResultFormat.TIME_SERIES) {
          data['interval'] = target.interval;

          if (target.interval === _intervals.QUERY_INTERVAL.AUTO) {
            var intervalMs = options.range.to.valueOf() - options.range.from.valueOf();
            data['interval'] = (0, _intervals.calculateAutoInterval)(intervalMs);
          }

          if (target.intervalSnapTo === true) {
            var intervalTimeUnit = (0, _intervals.getMomentTimeUnitForQueryInterval)(data['interval']);

            if (intervalTimeUnit != null) {
              data['start'] = options.range.from.startOf(intervalTimeUnit).toISOString();
              data['end'] = options.range.to.startOf(intervalTimeUnit).toISOString();
            }
          }
        }

        data['groupBy'] = target.groupBy;
        data['orderBy'].forEach(function (e) {
          if (e.name == _queryAttributes.ORDERBY_ATTRIBUTES.INTERVAL) {
            e.name = data['interval'];
          }
        });
        data['limit'] = Number(target.limit) || undefined;
        var apiRequestUrl = getApiRequestUrl(_this.url, _this.isAdAnalytics, isMetric);
        return _this.doRequest({
          url: apiRequestUrl + '/' + urlAppendix,
          data: data,
          method: 'POST',
          resultTarget: target.alias || target.refId,
          resultFormat: target.resultFormat
        });
      });

      return Promise.all(targetResponsePromises).then(function (targetResponses) {
        var result = [];

        _lodash["default"].map(targetResponses, function (response) {
          var series = (0, _result_transformer.transform)(response, options);
          result = [].concat(_toConsumableArray(result), _toConsumableArray(series));
        });

        return {
          data: result
        };
      });
    }
  }, {
    key: "testDatasource",
    value: function testDatasource() {
      return this.getLicenses().then(function (response) {
        if (response.status === 200) {
          return {
            status: "success",
            message: "Data source is working",
            title: "Success"
          };
        }
      });
    }
  }, {
    key: "annotationQuery",
    value: function annotationQuery(options) {}
  }, {
    key: "metricFindQuery",
    value: function metricFindQuery(query) {}
  }, {
    key: "getTagKeys",
    value: function getTagKeys(options) {
      if (this.isAdAnalytics) {
        return Promise.resolve((0, _queryAttributes.getAsOptionsList)(_queryAttributes.AD_ATTRIBUTE_LIST));
      }

      return Promise.resolve((0, _queryAttributes.getAsOptionsList)(_queryAttributes.ATTRIBUTE_LIST));
    }
  }, {
    key: "doRequest",
    value: function doRequest(options) {
      options.withCredentials = this.withCredentials;
      options.headers = this.headers;
      return this.backendSrv.datasourceRequest(options);
    }
  }, {
    key: "buildQueryParameters",
    value: function buildQueryParameters(options) {
      return options;
    }
  }, {
    key: "getLicenses",
    value: function getLicenses() {
      return this.doRequest({
        url: this.url + '/analytics/licenses',
        method: 'GET'
      });
    }
  }]);

  return BitmovinAnalyticsDatasource;
}();

exports.BitmovinAnalyticsDatasource = BitmovinAnalyticsDatasource;
//# sourceMappingURL=datasource.js.map
