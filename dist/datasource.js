"use strict";

System.register(["lodash", "./types/queryAttributes", "./types/aggregations", "./types/intervals", "./result_transformer", "./types/resultFormat"], function (_export, _context) {
  "use strict";

  var _, convertFilterValueToProperType, ATTRIBUTE, AGGREGATION, calculateAutoInterval, QUERY_INTERVAL, transform, ResultFormat, getApiRequestUrl, BitmovinAnalyticsDatasource;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_typesQueryAttributes) {
      convertFilterValueToProperType = _typesQueryAttributes.convertFilterValueToProperType;
      ATTRIBUTE = _typesQueryAttributes.ATTRIBUTE;
    }, function (_typesAggregations) {
      AGGREGATION = _typesAggregations.AGGREGATION;
    }, function (_typesIntervals) {
      calculateAutoInterval = _typesIntervals.calculateAutoInterval;
      QUERY_INTERVAL = _typesIntervals.QUERY_INTERVAL;
    }, function (_result_transformer) {
      transform = _result_transformer.transform;
    }, function (_typesResultFormat) {
      ResultFormat = _typesResultFormat.ResultFormat;
    }],
    execute: function () {
      getApiRequestUrl = function getApiRequestUrl(baseUrl, isAdAnalytics) {
        if (isAdAnalytics === true) {
          return baseUrl + '/analytics/ads/queries';
        }

        return baseUrl + '/analytics/queries';
      };

      _export("BitmovinAnalyticsDatasource", BitmovinAnalyticsDatasource =
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

            var targetResponsePromises = _.map(query.targets, function (target) {
              target.metric = target.metric || AGGREGATION.COUNT;
              target.dimension = target.dimension || ATTRIBUTE.LICENSE_KEY;
              target.resultFormat = target.resultFormat || ResultFormat.TIME_SERIES;
              target.interval = target.interval || QUERY_INTERVAL.HOUR;

              var filters = _.map(target.filter, function (filter) {
                return {
                  name: filter.name,
                  operator: filter.operator,
                  value: convertFilterValueToProperType(filter)
                };
              });

              var orderBy = _.map(target.orderBy, function (e) {
                return {
                  name: e.name,
                  order: e.order
                };
              });

              var data = {
                licenseKey: target.license,
                dimension: target.dimension,
                start: options.range.from.toISOString(),
                end: options.range.to.toISOString(),
                filters: filters,
                orderBy: orderBy
              };

              if (target.metric === 'percentile') {
                data['percentile'] = target.percentileValue;
              }

              if (target.resultFormat === ResultFormat.TIME_SERIES) {
                data['interval'] = target.interval === QUERY_INTERVAL.AUTO ? calculateAutoInterval(options.intervalMs) : target.interval;
              }

              data['groupBy'] = target.groupBy;
              data['limit'] = Number(target.limit) || undefined;
              var apiRequestUrl = getApiRequestUrl(_this.url, _this.isAdAnalytics);
              return _this.doRequest({
                url: apiRequestUrl + '/' + target.metric,
                data: data,
                method: 'POST',
                resultTarget: target.alias || target.refId,
                resultFormat: target.resultFormat
              });
            });

            return Promise.all(targetResponsePromises).then(function (targetResponses) {
              var result = [];

              _.map(targetResponses, function (response) {
                var series = transform(response, options);
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
      }());
    }
  };
});
//# sourceMappingURL=datasource.js.map
