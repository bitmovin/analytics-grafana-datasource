'use strict';

System.register(['lodash', './types/queryAttributes', './types/aggregations', './types/intervals', './result_transformer', './types/resultFormat'], function (_export, _context) {
  "use strict";

  var _, convertFilterValueToProperType, ATTRIBUTE, AGGREGATION, calculateAutoInterval, QUERY_INTERVAL, transform, ResultFormat, _createClass, BitmovinAnalyticsDatasource;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

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
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('BitmovinAnalyticsDatasource', BitmovinAnalyticsDatasource = function () {
        function BitmovinAnalyticsDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, BitmovinAnalyticsDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
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
          key: 'query',
          value: function query(options) {
            var _this = this;

            var query = this.buildQueryParameters(options);
            query.targets = query.targets.filter(function (t) {
              return !t.hide;
            });

            if (query.targets.length <= 0) {
              return this.q.when({ data: [] });
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
              var data = {
                licenseKey: target.license,
                dimension: target.dimension,
                start: options.range.from.toISOString(),
                end: options.range.to.toISOString(),
                filters: filters
              };

              if (target.metric === 'percentile') {
                data['percentile'] = target.percentileValue;
              }

              if (target.resultFormat === ResultFormat.TIME_SERIES) {
                data['interval'] = target.interval === QUERY_INTERVAL.AUTO ? calculateAutoInterval(options.intervalMs) : target.interval;
              } else if (target.resultFormat === 'table') {
                data['limit'] = target.limit;
              }
              data['groupBy'] = target.groupBy;

              return _this.doRequest({
                url: _this.url + '/analytics/queries/' + target.metric,
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
          key: 'testDatasource',
          value: function testDatasource() {
            return this.getLicenses().then(function (response) {
              if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
              }
            });
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {}
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(query) {}
        }, {
          key: 'doRequest',
          value: function doRequest(options) {
            options.withCredentials = this.withCredentials;
            options.headers = this.headers;

            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {
            return options;
          }
        }, {
          key: 'getLicenses',
          value: function getLicenses() {
            return this.doRequest({
              url: this.url + '/analytics/licenses',
              method: 'GET'
            });
          }
        }]);

        return BitmovinAnalyticsDatasource;
      }());

      _export('BitmovinAnalyticsDatasource', BitmovinAnalyticsDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
