"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmovinAnalyticsDatasourceQueryCtrl = void 0;
var sdk_1 = require("app/plugins/sdk");
require("./css/query-editor.css!");
var queryAttributes_1 = require("./types/queryAttributes");
var uiUtils_1 = require("./utils/uiUtils");
var operators_1 = require("./types/operators");
var intervals_1 = require("./types/intervals");
var aggregations_1 = require("./types/aggregations");
var resultFormat_1 = require("./types/resultFormat");
var queryGrouByAttributes_1 = require("./types/queryGrouByAttributes");
var queryUtils_1 = require("./utils/queryUtils");
var REMOVE_ITEM_TEXT = '-- Remove --';
var DEFAULT_LICENSE = { licenseKey: '<YOUR LICENSE KEY>', label: '-- Select License --' };
var DEFAULT_OPERATOR = operators_1.OPERATOR.EQ;
var GROUPBY_DEFAULT_ORDER = operators_1.ORDERBY.ASC;
var BitmovinAnalyticsDatasourceQueryCtrl = (function (_super) {
    __extends(BitmovinAnalyticsDatasourceQueryCtrl, _super);
    function BitmovinAnalyticsDatasourceQueryCtrl($scope, $injector, templateSrv, $q, uiSegmentSrv) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.scope = $scope;
        _this.$q = $q;
        _this.uiSegmentSrv = uiSegmentSrv;
        _this.metrics = aggregations_1.AGGREGATION_LIST;
        _this.fields = queryAttributes_1.ATTRIBUTE_LIST;
        _this.groupByFields = queryGrouByAttributes_1.GROUP_BY_ATTRIBUTE_LIST;
        _this.orderByFields = queryAttributes_1.ORDERBY_ATTRIBUTES_LIST;
        if (_this.datasource.isAdAnalytics === true) {
            _this.fields = queryAttributes_1.AD_ATTRIBUTE_LIST;
            _this.groupByFields = queryGrouByAttributes_1.GROUP_BY_AD_ATTRIBUTE_LIST;
            _this.orderByFields = queryAttributes_1.ORDERBY_AD_ATTRIBUTES_LIST;
        }
        _this.licenses = [];
        _this.resultFormats = [resultFormat_1.ResultFormat.TIME_SERIES, resultFormat_1.ResultFormat.TABLE];
        _this.intervals = intervals_1.QUERY_INTERVAL_LIST;
        _this.filterSegment = _this.uiSegmentSrv.newPlusButton();
        _this.groupBySegment = _this.uiSegmentSrv.newPlusButton();
        _this.orderBySegment = _this.uiSegmentSrv.newPlusButton();
        _this.groupByParts = _this.target.groupBy ? _this.target.groupBy.map(function (e) { return _this.createGroupByPartsEntry(e); }) : [];
        _this.orderBySegments = _this.target.orderBy ? _this.target.orderBy.map(function (e) { return _this.createOrderBySegment(e); }) : [];
        _this.filterSegments = _this.target.filter ? _this.target.filter.map(function (f) { return _this.createFilterSegment(f); }) : [];
        _this.target.metric = _this.target.metric || _this.metrics[0];
        _this.target.percentileValue = _this.target.percentileValue || 95;
        _this.target.dimension = _this.target.dimension || _this.fields[0];
        _this.target.license = _this.target.license || _this.licenses[0];
        _this.target.resultFormat = _this.target.resultFormat || _this.resultFormats[0];
        _this.target.interval = _this.target.interval || intervals_1.QUERY_INTERVAL.AUTO;
        _this.target.alias = _this.target.alias || '';
        _this.target.groupBy = _this.target.groupBy || [];
        _this.target.orderBy = _this.target.orderBy || [];
        _this.target.filter = _this.target.filter || [];
        _this.target.limit = _this.target.limit;
        _this.lastQueryError = [];
        _this.datasource.licenseService.fetchLicenses().then(function (licenses) {
            _this.licenses = [DEFAULT_LICENSE].concat(licenses);
            if (!_this.target.license || !_this.licenses.find(function (l) { return l.licenseKey === _this.target.license; })) {
                _this.target.license = DEFAULT_LICENSE.licenseKey;
            }
            _this.panelCtrl.refresh();
        });
        _this.panelCtrl.events.on('data-received', _this.onDataReceived.bind(_this), $scope);
        _this.panelCtrl.events.on('data-error', _this.onDataError.bind(_this), $scope);
        return _this;
    }
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.onDataReceived = function (dataList) {
        this.lastQueryError = [];
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.onDataError = function (err) {
        this.handleQueryCtrlError(err);
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.handleQueryCtrlError = function (err) {
        if (err.config && err.config.data && err.config.resultTarget !== this.target.refId && err.config.resultTarget !== this.target.alias) {
            return;
        }
        if (err.error && err.error.data && err.error.data.error) {
            this.lastQueryError[this.target.refId] = err.error.data.error.message;
        }
        else if (err.error && err.error.data) {
            this.lastQueryError[this.target.refId] = err.error.data.message;
        }
        else if (err.data && err.data.error) {
            this.lastQueryError[this.target.refId] = err.data.error.message;
        }
        else if (err.data && err.data.message) {
            this.lastQueryError[this.target.refId] = err.data.message;
        }
        else {
            this.lastQueryError[this.target.refId] = err;
        }
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.onChangeInternal = function () {
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.getGroupByOptions = function () {
        var options = (0, uiUtils_1.getAsOptionsList)(this.groupByFields);
        return Promise.resolve(options);
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.getFilterOptions = function () {
        var options = (0, uiUtils_1.getAsOptionsList)(this.fields);
        return Promise.resolve(options);
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.getFilterSegmentOptions = function () {
        var options = (0, uiUtils_1.getAsOptionsList)(this.fields);
        options.unshift({
            value: REMOVE_ITEM_TEXT,
            text: REMOVE_ITEM_TEXT
        });
        return Promise.resolve(options);
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.getFilterOperatorOptions = function () {
        var options = (0, uiUtils_1.getAsOptionsList)(operators_1.OPERATOR_LIST);
        return Promise.resolve(options);
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.getFilterValueOptions = function (segment, $index) {
        return Promise.resolve([]);
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.getOrderByDimensionOptions = function () {
        var options = (0, uiUtils_1.getAsOptionsList)(this.orderByFields);
        options.unshift({
            value: REMOVE_ITEM_TEXT,
            text: REMOVE_ITEM_TEXT
        });
        return Promise.resolve(options);
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.getOrderByOperatorOptions = function () {
        var options = (0, uiUtils_1.getAsOptionsList)(operators_1.ORDERBY_LIST);
        return Promise.resolve(options);
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.createGroupByPartsEntry = function (groupByValue) {
        return {
            params: [groupByValue],
            def: {
                type: 'dimension',
                params: [{
                        optional: false
                    }]
            }
        };
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.groupByAction = function () {
        this.target.groupBy.push(this.groupBySegment.value);
        this.groupByParts.push(this.createGroupByPartsEntry(this.groupBySegment.value));
        var plusButton = this.uiSegmentSrv.newPlusButton();
        this.groupBySegment.value = plusButton.value;
        this.groupBySegment.html = plusButton.html;
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.createFilter = function (name, operator, value) {
        if (operator === void 0) { operator = DEFAULT_OPERATOR; }
        if (value === void 0) { value = null; }
        var filter = { name: name, operator: operator, value: value };
        filter.value = (0, queryUtils_1.convertFilterValueToProperType)(filter);
        return filter;
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.createFilterSegment = function (filter) {
        return { html: filter.name, operator: { html: filter.operator || DEFAULT_OPERATOR }, filterValue: { html: filter.value || 'set filter value' } };
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.createOrderBy = function (name, order) {
        if (order === void 0) { order = GROUPBY_DEFAULT_ORDER; }
        return { name: name, order: order };
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.createOrderBySegment = function (orderBy) {
        return { html: orderBy.name, order: { html: orderBy.order || GROUPBY_DEFAULT_ORDER } };
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.filterAction = function () {
        var _this = this;
        var filter = this.target.filter.find(function (f) { return f.name === _this.filterSegment.name; });
        if (!filter) {
            var newFilter = this.createFilter(this.filterSegment.value);
            this.target.filter.push(newFilter);
            this.filterSegments.push(this.createFilterSegment(newFilter));
        }
        var plusButton = this.uiSegmentSrv.newPlusButton();
        this.filterSegment.value = plusButton.value;
        this.filterSegment.html = plusButton.html;
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.orderByAction = function () {
        var _this = this;
        var orderBy = this.target.orderBy.find(function (e) { return e.name === _this.orderBySegment.name; });
        if (!orderBy) {
            var newOrderBy = this.createOrderBy(this.orderBySegment.value);
            this.target.orderBy.push(newOrderBy);
            this.orderBySegments.push(this.createOrderBySegment(newOrderBy));
        }
        var plusButton = this.uiSegmentSrv.newPlusButton();
        this.orderBySegment.value = plusButton.value;
        this.orderBySegment.html = plusButton.html;
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.handleGroupByPartEvent = function (selectParts, part, evt) {
        switch (evt.name) {
            case 'action': {
                this.target.groupBy.splice(part, 1);
                this.groupByParts.splice(part, 1);
                this.panelCtrl.refresh();
                break;
            }
            case 'get-part-actions': {
                return this.$q.when([{ text: 'Remove', value: 'remove-part' }]);
            }
        }
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.filterSegmentUpdate = function (segment, $index) {
        if (segment.value === REMOVE_ITEM_TEXT) {
            this.target.filter.splice($index, 1);
            this.filterSegments.splice($index, 1);
        }
        else {
            this.target.filter[$index].name = segment.value;
        }
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.filterOperatorSegmentUpdate = function (segment, $index) {
        this.target.filter[$index].operator = segment.operator.value;
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.filterValueSegmentUpdate = function (segment, $index) {
        this.target.filter[$index].value = segment.filterValue.value;
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.orderByDimensionSegmentUpdate = function (segment, $index) {
        if (segment.value === REMOVE_ITEM_TEXT) {
            this.target.orderBy.splice($index, 1);
            this.orderBySegments.splice($index, 1);
        }
        else {
            this.target.orderBy[$index].name = segment.value;
        }
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.orderByOrderSegmentUpdate = function (segment, $index) {
        this.target.orderBy[$index].order = segment.order.value;
        this.panelCtrl.refresh();
    };
    BitmovinAnalyticsDatasourceQueryCtrl.prototype.isDimensionAMetric = function (dimension) {
        return queryAttributes_1.METRICS_ATTRIBUTE_LIST.includes(dimension);
    };
    return BitmovinAnalyticsDatasourceQueryCtrl;
}(sdk_1.QueryCtrl));
exports.BitmovinAnalyticsDatasourceQueryCtrl = BitmovinAnalyticsDatasourceQueryCtrl;
BitmovinAnalyticsDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map