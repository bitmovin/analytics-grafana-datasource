"use strict";

System.register(["lodash", "./types/queryAttributes", "./types/aggregations", "./types/intervals", "./result_transformer", "./types/resultFormat"], function (_export, _context) {
  "use strict";

  var _, convertFilterValueToProperType, ATTRIBUTE, ATTRIBUTE_LIST, AD_ATTRIBUTE_LIST, METRICS_ATTRIBUTE_LIST, ORDERBY_ATTRIBUTES, getAsOptionsList, AGGREGATION, calculateAutoInterval, calculateAutoIntervalFromRange, QUERY_INTERVAL, transform, ResultFormat, getApiRequestUrl, BitmovinAnalyticsDatasource;

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
      ATTRIBUTE_LIST = _typesQueryAttributes.ATTRIBUTE_LIST;
      AD_ATTRIBUTE_LIST = _typesQueryAttributes.AD_ATTRIBUTE_LIST;
      METRICS_ATTRIBUTE_LIST = _typesQueryAttributes.METRICS_ATTRIBUTE_LIST;
      ORDERBY_ATTRIBUTES = _typesQueryAttributes.ORDERBY_ATTRIBUTES;
      getAsOptionsList = _typesQueryAttributes.getAsOptionsList;
    }, function (_typesAggregations) {
      AGGREGATION = _typesAggregations.AGGREGATION;
    }, function (_typesIntervals) {
      calculateAutoInterval = _typesIntervals.calculateAutoInterval;
      calculateAutoIntervalFromRange = _typesIntervals.calculateAutoIntervalFromRange;
      QUERY_INTERVAL = _typesIntervals.QUERY_INTERVAL;
    }, function (_result_transformer) {
      transform = _result_transformer.transform;
    }, function (_typesResultFormat) {
      ResultFormat = _typesResultFormat.ResultFormat;
    }],
    execute: function () {
      getApiRequestUrl = function getApiRequestUrl(baseUrl, isAdAnalytics, isMetric) {
        if (isAdAnalytics === true) {
          return baseUrl + '/analytics/ads/queries';
        }

        if (isMetric == true) {
          return baseUrl + '/analytics/metrics';
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
              target.resultFormat = target.resultFormat || ResultFormat.TIME_SERIES;
              target.interval = target.interval || QUERY_INTERVAL.HOUR;

              var filters = _.map([].concat(_toConsumableArray(target.filter), _toConsumableArray(query.adhocFilters)), function (e) {
                var filter = {
                  name: e.name ? e.name : e.key,
                  operator: e.operator,
                  value: _this.templateSrv.replace(e.value, options.scopedVars)
                };

                switch (filter.operator) {
                  case '=':
                    filter.operator = 'EQ';
                    break;

                  case '!=':
                    filter.operator = 'NE';
                    break;

                  case '<':
                    filter.operator = 'LT';
                    break;

                  case '>':
                    filter.operator = 'GT';
                    break;
                }

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
                start: options.range.from.toISOString(),
                end: options.range.to.toISOString(),
                filters: filters,
                orderBy: orderBy
              };
              var isMetric = METRICS_ATTRIBUTE_LIST.includes(target.dimension);
              var urlAppendix = '';

              if (isMetric) {
                urlAppendix = target.dimension;
                data['metric'] = target.dimension;
              } else {
                target.metric = target.metric || AGGREGATION.COUNT;
                target.dimension = target.dimension || ATTRIBUTE.LICENSE_KEY;
                urlAppendix = target.metric;
                data['dimension'] = target.dimension;

                if (target.metric === 'percentile') {
                  data['percentile'] = target.percentileValue;
                }
              }

              if (target.resultFormat === ResultFormat.TIME_SERIES) {
                if (target.intervalAutoLimit === true) {
                  data['interval'] = target.interval === QUERY_INTERVAL.AUTO ? calculateAutoIntervalFromRange(options.range.from.valueOf(), options.range.to.valueOf()) : target.interval;
                } else {
                  data['interval'] = target.interval === QUERY_INTERVAL.AUTO ? calculateAutoInterval(options.intervalMs) : target.interval;
                }

                if (target.intervalSnapTo === true) {
                  switch (data['interval']) {
                    case QUERY_INTERVAL.MONTH:
                      data['start'] = options.range.from.startOf('month').toISOString();
                      data['end'] = options.range.to.startOf('month').toISOString();
                      break;

                    case QUERY_INTERVAL.DAY:
                      data['start'] = options.range.from.startOf('day').toISOString();
                      data['end'] = options.range.to.startOf('day').toISOString();
                      break;

                    case QUERY_INTERVAL.HOUR:
                      data['start'] = options.range.from.startOf('hour').toISOString();
                      data['end'] = options.range.to.startOf('hour').toISOString();
                      break;

                    case QUERY_INTERVAL.MINUTE:
                      data['start'] = options.range.from.startOf('minute').toISOString();
                      data['end'] = options.range.to.startOf('minute').toISOString();
                      break;
                  }
                }
              }

              data['groupBy'] = target.groupBy;
              data['orderBy'].forEach(function (e) {
                if (e.name == ORDERBY_ATTRIBUTES.INTERVAL) {
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
          key: "getTagKeys",
          value: function getTagKeys(options) {
            if (this.isAdAnalytics) return Promise.resolve(getAsOptionsList(AD_ATTRIBUTE_LIST));
            return Promise.resolve(getAsOptionsList(ATTRIBUTE_LIST));
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
      }());
    }
  };
});
//# sourceMappingURL=datasource.js.map
