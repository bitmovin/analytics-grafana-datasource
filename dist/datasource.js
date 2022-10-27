"use strict";

System.register(["lodash", "./types/queryAttributes", "./types/aggregations", "./types/intervals", "./result_transformer", "./types/resultFormat", "./types/operators", "./licenseService", "./requestHandler"], function (_export, _context) {
  "use strict";

  var _, convertFilterValueToProperType, ATTRIBUTE, ATTRIBUTE_LIST, AD_ATTRIBUTE_LIST, METRICS_ATTRIBUTE_LIST, ORDERBY_ATTRIBUTES, getAsOptionsList, AGGREGATION, calculateAutoInterval, getMomentTimeUnitForQueryInterval, QUERY_INTERVAL, transform, ResultFormat, OPERATOR, LicenseService, RequestHandler, getApiRequestUrl, mapMathOperatorToAnalyticsFilterOperator, BitmovinAnalyticsDatasource;

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
      getMomentTimeUnitForQueryInterval = _typesIntervals.getMomentTimeUnitForQueryInterval;
      QUERY_INTERVAL = _typesIntervals.QUERY_INTERVAL;
    }, function (_result_transformer) {
      transform = _result_transformer.transform;
    }, function (_typesResultFormat) {
      ResultFormat = _typesResultFormat.ResultFormat;
    }, function (_typesOperators) {
      OPERATOR = _typesOperators.OPERATOR;
    }, function (_licenseService) {
      LicenseService = _licenseService.default;
    }, function (_requestHandler) {
      RequestHandler = _requestHandler.default;
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

      mapMathOperatorToAnalyticsFilterOperator = function mapMathOperatorToAnalyticsFilterOperator(operator) {
        switch (operator) {
          case '=':
            return OPERATOR.EQ;

          case '!=':
            return OPERATOR.NE;

          case '<':
            return OPERATOR.LT;

          case '<=':
            return OPERATOR.LTE;

          case '>':
            return OPERATOR.GT;

          case '>=':
            return OPERATOR.GTE;

          default:
            return operator;
        }
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
          var headers = {
            'Content-Type': 'application/json',
            'X-Api-Key': instanceSettings.jsonData.apiKey
          };
          var tenantOrgId = instanceSettings.jsonData.tenantOrgId;

          if (typeof tenantOrgId === 'string' && tenantOrgId.length > 0) {
            headers['X-Tenant-Org-Id'] = tenantOrgId;
          }

          if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            headers['Authorization'] = instanceSettings.basicAuth;
          }

          this.requestHandler = new RequestHandler(backendSrv, headers, instanceSettings.withCredentials);
          this.licenseService = new LicenseService(this.requestHandler, instanceSettings.url);
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
                  operator: mapMathOperatorToAnalyticsFilterOperator(e.operator),
                  value: _this.templateSrv.replace(e.value, options.scopedVars)
                };
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
                data['interval'] = target.interval;

                if (target.interval === QUERY_INTERVAL.AUTO) {
                  var intervalMs = options.range.to.valueOf() - options.range.from.valueOf();
                  data['interval'] = calculateAutoInterval(intervalMs);
                }

                if (target.intervalSnapTo === true) {
                  var intervalTimeUnit = getMomentTimeUnitForQueryInterval(data['interval']);

                  if (intervalTimeUnit != null) {
                    data['start'] = options.range.from.startOf(intervalTimeUnit).toISOString();
                    data['end'] = options.range.to.startOf(intervalTimeUnit).toISOString();
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
              var requestOptions = {
                url: apiRequestUrl + '/' + urlAppendix,
                data: data,
                method: 'POST',
                resultTarget: target.alias || target.refId,
                resultFormat: target.resultFormat
              };
              return _this.requestHandler.doRequest(requestOptions);
            });

            return Promise.all(targetResponsePromises).then(function (targetResponses) {
              var result = {
                series: [],
                datapointsCnt: 0
              };

              _.map(targetResponses, function (response) {
                var partialResult = transform(response, options);
                result.series = [].concat(_toConsumableArray(result.series), _toConsumableArray(partialResult.series));
                result.datapointsCnt += partialResult.datapointsCnt;
              });

              return {
                data: result.series,
                error: _this.generateWarningsForResult(result)
              };
            });
          }
        }, {
          key: "testDatasource",
          value: function testDatasource() {
            var requestOptions = {
              url: this.url + '/analytics/licenses',
              method: 'GET'
            };
            return this.requestHandler.doRequest(requestOptions).then(function (response) {
              if (response.status === 200) {
                return {
                  status: "success",
                  message: "Data source is working",
                  title: "Success"
                };
              }

              return {
                status: "error",
                message: "Data source is not working",
                title: "Error"
              };
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
              return Promise.resolve(getAsOptionsList(AD_ATTRIBUTE_LIST));
            }

            return Promise.resolve(getAsOptionsList(ATTRIBUTE_LIST));
          }
        }, {
          key: "buildQueryParameters",
          value: function buildQueryParameters(options) {
            return options;
          } // returns DataQueryError https://github.com/grafana/grafana/blob/08bf2a54523526a7f59f7c6a8dafaace79ab87db/packages/grafana-data/src/types/datasource.ts#L400

        }, {
          key: "generateWarningsForResult",
          value: function generateWarningsForResult(result) {
            if (result.datapointsCnt == 200) {
              return {
                cancelled: false,
                message: "Your request reached the max row limit of the API. You might see incomplete data. This problem might be caused by the use of high cardinality columns in group by, too small interval or too big of a time range.",
                status: "WARNING"
              };
            }

            return null;
          }
        }]);

        return BitmovinAnalyticsDatasource;
      }());
    }
  };
});
//# sourceMappingURL=datasource.js.map
