"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmovinAnalyticsDatasource = void 0;
var queryAttributes_1 = require("./types/queryAttributes");
var uiUtils_1 = require("./utils/uiUtils");
var queryUtils_1 = require("./utils/queryUtils");
var aggregations_1 = require("./types/aggregations");
var intervalUtils_1 = require("./utils/intervalUtils");
var intervals_1 = require("./types/intervals");
var result_transformer_1 = require("./result_transformer");
var resultFormat_1 = require("./types/resultFormat");
var operators_1 = require("./types/operators");
var licenseService_1 = require("./licenseService");
var requestHandler_1 = require("./requestHandler");
var getApiRequestUrl = function (baseUrl, isAdAnalytics, isMetric) {
    if (isAdAnalytics === true) {
        return baseUrl + '/analytics/ads/queries';
    }
    if (isMetric == true) {
        return baseUrl + '/analytics/metrics';
    }
    return baseUrl + '/analytics/queries';
};
var mapMathOperatorToAnalyticsFilterOperator = function (operator) {
    switch (operator) {
        case '=':
            return operators_1.OPERATOR.EQ;
        case '!=':
            return operators_1.OPERATOR.NE;
        case '<':
            return operators_1.OPERATOR.LT;
        case '<=':
            return operators_1.OPERATOR.LTE;
        case '>':
            return operators_1.OPERATOR.GT;
        case '>=':
            return operators_1.OPERATOR.GTE;
        default:
            return operators_1.OPERATOR[operator];
    }
};
var BitmovinAnalyticsDatasource = (function () {
    function BitmovinAnalyticsDatasource(instanceSettings, $q, backendSrv, templateSrv) {
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
            'X-Api-Key': instanceSettings.jsonData.apiKey,
        };
        var tenantOrgId = instanceSettings.jsonData.tenantOrgId;
        if (typeof tenantOrgId === 'string' && tenantOrgId.length > 0) {
            headers['X-Tenant-Org-Id'] = tenantOrgId;
        }
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            headers['Authorization'] = instanceSettings.basicAuth;
        }
        this.requestHandler = new requestHandler_1.default(backendSrv, headers, instanceSettings.withCredentials);
        this.licenseService = new licenseService_1.default(this.requestHandler, instanceSettings.url);
    }
    BitmovinAnalyticsDatasource.prototype.query = function (options) {
        var _this = this;
        var query = this.buildQueryParameters(options);
        query.targets = query.targets.filter(function (t) { return !t.hide; });
        if (query.targets.length <= 0) {
            return this.q.when({ data: [] });
        }
        if (this.templateSrv.getAdhocFilters) {
            query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
        }
        else {
            query.adhocFilters = [];
        }
        var targetResponsePromises = query.targets.map(function (target) {
            target.resultFormat = target.resultFormat || resultFormat_1.ResultFormat.TIME_SERIES;
            target.interval = target.interval || intervals_1.QUERY_INTERVAL.HOUR;
            var filters = __spreadArray(__spreadArray([], target.filter, true), query.adhocFilters, true).map(function (e) {
                var filter = {
                    name: (e.name) ? e.name : e.key,
                    operator: mapMathOperatorToAnalyticsFilterOperator(e.operator),
                    value: _this.templateSrv.replace(e.value, options.scopedVars)
                };
                return {
                    name: filter.name,
                    operator: filter.operator,
                    value: (0, queryUtils_1.convertFilterValueToProperType)(filter)
                };
            });
            var orderBy = target.orderBy.map(function (e) { return ({ name: e.name, order: e.order }); });
            var data = {
                licenseKey: target.license,
                start: options.range.from.toISOString(),
                end: options.range.to.toISOString(),
                filters: filters,
                orderBy: orderBy
            };
            var isMetric = queryAttributes_1.METRICS_ATTRIBUTE_LIST.includes(target.dimension);
            var urlAppendix = '';
            if (isMetric) {
                urlAppendix = target.dimension;
                data['metric'] = target.dimension;
            }
            else {
                target.metric = target.metric || aggregations_1.AGGREGATION.COUNT;
                target.dimension = target.dimension || queryAttributes_1.ATTRIBUTE.LICENSE_KEY;
                urlAppendix = target.metric;
                data['dimension'] = target.dimension;
                if (target.metric === 'percentile') {
                    data['percentile'] = target.percentileValue;
                }
            }
            if (target.resultFormat === resultFormat_1.ResultFormat.TIME_SERIES) {
                data['interval'] = target.interval;
                if (target.interval === intervals_1.QUERY_INTERVAL.AUTO) {
                    var intervalMs = options.range.to.valueOf() - options.range.from.valueOf();
                    data['interval'] = (0, intervalUtils_1.calculateAutoInterval)(intervalMs);
                }
                if (target.intervalSnapTo === true) {
                    var intervalTimeUnit = (0, intervalUtils_1.getMomentTimeUnitForQueryInterval)(data['interval']);
                    if (intervalTimeUnit != null) {
                        data['start'] = options.range.from.startOf(intervalTimeUnit).toISOString();
                        data['end'] = options.range.to.startOf(intervalTimeUnit).toISOString();
                    }
                }
            }
            data['groupBy'] = target.groupBy;
            data['orderBy'].forEach(function (e) {
                if (e.name == queryAttributes_1.QUERY_SPECIFIC_ORDERBY_ATTRIBUTES.INTERVAL) {
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
            targetResponses.map(function (response) {
                var partialResult = (0, result_transformer_1.transform)(response, options);
                result.series = __spreadArray(__spreadArray([], result.series, true), partialResult.series, true);
                result.datapointsCnt += partialResult.datapointsCnt;
            });
            return {
                data: result.series,
                error: _this.generateWarningsForResult(result)
            };
        });
    };
    BitmovinAnalyticsDatasource.prototype.testDatasource = function () {
        var requestOptions = {
            url: this.url + '/analytics/licenses',
            method: 'GET',
        };
        return this.requestHandler.doRequest(requestOptions).then(function (response) {
            if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
            }
            return { status: "error", message: "Data source is not working", title: "Error" };
        });
    };
    BitmovinAnalyticsDatasource.prototype.annotationQuery = function (options) {
    };
    BitmovinAnalyticsDatasource.prototype.metricFindQuery = function (query) {
    };
    BitmovinAnalyticsDatasource.prototype.getTagKeys = function (options) {
        if (this.isAdAnalytics) {
            return Promise.resolve((0, uiUtils_1.getAsOptionsList)(queryAttributes_1.AD_ATTRIBUTE_LIST));
        }
        return Promise.resolve((0, uiUtils_1.getAsOptionsList)(queryAttributes_1.ATTRIBUTE_LIST));
    };
    BitmovinAnalyticsDatasource.prototype.buildQueryParameters = function (options) {
        return options;
    };
    BitmovinAnalyticsDatasource.prototype.generateWarningsForResult = function (result) {
        if (result.datapointsCnt == 200) {
            return {
                cancelled: false,
                message: "Your request reached the max row limit of the API. You might see incomplete data. This problem might be caused by the use of high cardinality columns in group by, too small interval or too big of a time range.",
                status: "WARNING"
            };
        }
        return null;
    };
    return BitmovinAnalyticsDatasource;
}());
exports.BitmovinAnalyticsDatasource = BitmovinAnalyticsDatasource;
//# sourceMappingURL=datasource.js.map