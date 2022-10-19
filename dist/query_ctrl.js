"use strict";

System.register(["app/plugins/sdk", "./css/query-editor.css!", "lodash", "./types/queryAttributes", "./types/operators", "./types/intervals", "./types/aggregations", "./types/resultFormat", "./types/queryGrouByAttributes"], function (_export, _context) {
  "use strict";

  var QueryCtrl, _, ATTRIBUTE_LIST, convertFilterValueToProperType, getAsOptionsList, ORDERBY_ATTRIBUTES_LIST, AD_ATTRIBUTE_LIST, ORDERBY_AD_ATTRIBUTES_LIST, METRICS_ATTRIBUTE_LIST, OPERATOR_LIST, OPERATOR, ORDERBY_LIST, ORDERBY, QUERY_INTERVAL, QUERY_INTERVAL_LIST, AGGREGATION_LIST, ResultFormat, GROUP_BY_ATTRIBUTE_LIST, GROUP_BY_AD_ATTRIBUTE_LIST, REMOVE_ITEM_TEXT, DEFAULT_LICENSE, DEFAULT_OPERATOR, GROUPBY_DEFAULT_ORDER, BitmovinAnalyticsDatasourceQueryCtrl;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}, function (_lodash) {
      _ = _lodash.default;
    }, function (_typesQueryAttributes) {
      ATTRIBUTE_LIST = _typesQueryAttributes.ATTRIBUTE_LIST;
      convertFilterValueToProperType = _typesQueryAttributes.convertFilterValueToProperType;
      getAsOptionsList = _typesQueryAttributes.getAsOptionsList;
      ORDERBY_ATTRIBUTES_LIST = _typesQueryAttributes.ORDERBY_ATTRIBUTES_LIST;
      AD_ATTRIBUTE_LIST = _typesQueryAttributes.AD_ATTRIBUTE_LIST;
      ORDERBY_AD_ATTRIBUTES_LIST = _typesQueryAttributes.ORDERBY_AD_ATTRIBUTES_LIST;
      METRICS_ATTRIBUTE_LIST = _typesQueryAttributes.METRICS_ATTRIBUTE_LIST;
    }, function (_typesOperators) {
      OPERATOR_LIST = _typesOperators.OPERATOR_LIST;
      OPERATOR = _typesOperators.OPERATOR;
      ORDERBY_LIST = _typesOperators.ORDERBY_LIST;
      ORDERBY = _typesOperators.ORDERBY;
    }, function (_typesIntervals) {
      QUERY_INTERVAL = _typesIntervals.QUERY_INTERVAL;
      QUERY_INTERVAL_LIST = _typesIntervals.QUERY_INTERVAL_LIST;
    }, function (_typesAggregations) {
      AGGREGATION_LIST = _typesAggregations.AGGREGATION_LIST;
    }, function (_typesResultFormat) {
      ResultFormat = _typesResultFormat.ResultFormat;
    }, function (_typesQueryGrouByAttributes) {
      GROUP_BY_ATTRIBUTE_LIST = _typesQueryGrouByAttributes.GROUP_BY_ATTRIBUTE_LIST;
      GROUP_BY_AD_ATTRIBUTE_LIST = _typesQueryGrouByAttributes.GROUP_BY_AD_ATTRIBUTE_LIST;
    }],
    execute: function () {
      REMOVE_ITEM_TEXT = '-- Remove --';
      DEFAULT_LICENSE = {
        licenseKey: '<YOUR LICENSE KEY>',
        label: '-- Select License --'
      };
      DEFAULT_OPERATOR = OPERATOR.EQ;
      GROUPBY_DEFAULT_ORDER = ORDERBY.ASC;

      _export("BitmovinAnalyticsDatasourceQueryCtrl", BitmovinAnalyticsDatasourceQueryCtrl =
      /*#__PURE__*/
      function (_QueryCtrl) {
        _inherits(BitmovinAnalyticsDatasourceQueryCtrl, _QueryCtrl);

        function BitmovinAnalyticsDatasourceQueryCtrl($scope, $injector, templateSrv, $q, uiSegmentSrv) {
          var _this;

          _classCallCheck(this, BitmovinAnalyticsDatasourceQueryCtrl);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(BitmovinAnalyticsDatasourceQueryCtrl).call(this, $scope, $injector));
          _this.scope = $scope;
          _this.$q = $q;
          _this.uiSegmentSrv = uiSegmentSrv;
          _this.metrics = AGGREGATION_LIST;
          _this.fields = ATTRIBUTE_LIST;
          _this.groupByFields = GROUP_BY_ATTRIBUTE_LIST;
          _this.orderByFields = ORDERBY_ATTRIBUTES_LIST;

          if (_this.datasource.isAdAnalytics === true) {
            _this.fields = AD_ATTRIBUTE_LIST;
            _this.groupByFields = GROUP_BY_AD_ATTRIBUTE_LIST;
            _this.orderByFields = ORDERBY_AD_ATTRIBUTES_LIST;
          }

          _this.licenses = [];
          _this.resultFormats = [ResultFormat.TIME_SERIES, ResultFormat.TABLE];
          _this.intervals = QUERY_INTERVAL_LIST;
          _this.filterSegment = _this.uiSegmentSrv.newPlusButton();
          _this.groupBySegment = _this.uiSegmentSrv.newPlusButton();
          _this.orderBySegment = _this.uiSegmentSrv.newPlusButton();
          _this.groupByParts = _this.target.groupBy ? _this.target.groupBy.map(function (e) {
            return _this.createGroupByPartsEntry(e);
          }) : [];
          _this.orderBySegments = _this.target.orderBy ? _this.target.orderBy.map(function (e) {
            return _this.createOrderBySegment(e);
          }) : [];
          _this.filterSegments = _this.target.filter ? _this.target.filter.map(function (f) {
            return _this.createFilterSegment(f);
          }) : [];
          _this.target.metric = _this.target.metric || _this.metrics[0];
          _this.target.percentileValue = _this.target.percentileValue || 95;
          _this.target.dimension = _this.target.dimension || _this.fields[0];
          _this.target.license = _this.target.license || _this.licenses[0];
          _this.target.resultFormat = _this.target.resultFormat || _this.resultFormats[0];
          _this.target.interval = _this.target.interval || QUERY_INTERVAL.AUTO;
          _this.target.alias = _this.target.alias || '';
          _this.target.groupBy = _this.target.groupBy || [];
          _this.target.orderBy = _this.target.orderBy || [];
          _this.target.filter = _this.target.filter || [];
          _this.target.limit = _this.target.limit;
          _this.lastQueryError = [];

          _this.datasource.licenseService.fetchLicenses().then(function (licenses) {
            _this.licenses = [DEFAULT_LICENSE].concat(licenses);

            if (!_this.target.license || !_this.licenses.find(function (l) {
              return l.licenseKey === _this.target.license;
            })) {
              _this.target.license = DEFAULT_LICENSE.licenseKey;
            }
          });

          _this.panelCtrl.events.on('data-received', _this.onDataReceived.bind(_assertThisInitialized(_this)), $scope);

          _this.panelCtrl.events.on('data-error', _this.onDataError.bind(_assertThisInitialized(_this)), $scope);

          return _this;
        }

        _createClass(BitmovinAnalyticsDatasourceQueryCtrl, [{
          key: "onDataReceived",
          value: function onDataReceived(dataList) {
            this.lastQueryError = [];
          }
        }, {
          key: "onDataError",
          value: function onDataError(err) {
            this.handleQueryCtrlError(err);
          }
        }, {
          key: "handleQueryCtrlError",
          value: function handleQueryCtrlError(err) {
            if (err.config && err.config.data && err.config.resultTarget !== this.target.refId && err.config.resultTarget !== this.target.alias) {
              return;
            }

            if (err.error && err.error.data && err.error.data.error) {
              this.lastQueryError[this.target.refId] = err.error.data.error.message;
            } else if (err.error && err.error.data) {
              this.lastQueryError[this.target.refId] = err.error.data.message;
            } else if (err.data && err.data.error) {
              this.lastQueryError[this.target.refId] = err.data.error.message;
            } else if (err.data && err.data.message) {
              this.lastQueryError[this.target.refId] = err.data.message;
            } else {
              this.lastQueryError[this.target.refId] = err;
            }
          }
        }, {
          key: "onChangeInternal",
          value: function onChangeInternal() {
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: "getGroupByOptions",
          value: function getGroupByOptions() {
            var options = getAsOptionsList(this.groupByFields);
            return Promise.resolve(options);
          }
        }, {
          key: "getFilterOptions",
          value: function getFilterOptions() {
            var options = getAsOptionsList(this.fields);
            return Promise.resolve(options);
          }
        }, {
          key: "getFilterSegmentOptions",
          value: function getFilterSegmentOptions() {
            var options = getAsOptionsList(this.fields);
            options.unshift({
              value: REMOVE_ITEM_TEXT,
              text: REMOVE_ITEM_TEXT
            });
            return Promise.resolve(options);
          }
        }, {
          key: "getFilterOperatorOptions",
          value: function getFilterOperatorOptions() {
            var options = getAsOptionsList(OPERATOR_LIST);
            return Promise.resolve(options);
          }
        }, {
          key: "getFilterValueOptions",
          value: function getFilterValueOptions(segment, $index) {
            return Promise.resolve([]);
          }
        }, {
          key: "getOrderByDimensionOptions",
          value: function getOrderByDimensionOptions() {
            var options = getAsOptionsList(this.orderByFields);
            options.unshift({
              value: REMOVE_ITEM_TEXT,
              text: REMOVE_ITEM_TEXT
            });
            return Promise.resolve(options);
          }
        }, {
          key: "getOrderByOperatorOptions",
          value: function getOrderByOperatorOptions() {
            var options = getAsOptionsList(ORDERBY_LIST);
            return Promise.resolve(options);
          }
        }, {
          key: "createGroupByPartsEntry",
          value: function createGroupByPartsEntry(groupByValue) {
            return {
              params: [groupByValue],
              def: {
                type: 'dimension',
                params: [{
                  optional: false
                }]
              }
            };
          }
        }, {
          key: "groupByAction",
          value: function groupByAction() {
            this.target.groupBy.push(this.groupBySegment.value);
            this.groupByParts.push(this.createGroupByPartsEntry(this.groupBySegment.value));
            var plusButton = this.uiSegmentSrv.newPlusButton();
            this.groupBySegment.value = plusButton.value;
            this.groupBySegment.html = plusButton.html;
            this.panelCtrl.refresh();
          }
        }, {
          key: "createFilter",
          value: function createFilter(name, operator) {
            var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var filter = {
              name: name,
              operator: operator || DEFAULT_OPERATOR,
              value: value
            };
            filter.value = convertFilterValueToProperType(filter);
            return filter;
          }
        }, {
          key: "createFilterSegment",
          value: function createFilterSegment(filter) {
            return {
              html: filter.name,
              operator: {
                html: filter.operator || DEFAULT_OPERATOR
              },
              filterValue: {
                html: filter.value || 'set filter value'
              }
            };
          }
        }, {
          key: "createOrderBy",
          value: function createOrderBy(name, order) {
            return {
              name: name,
              order: order || GROUPBY_DEFAULT_ORDER
            };
          }
        }, {
          key: "createOrderBySegment",
          value: function createOrderBySegment(orderBy) {
            return {
              html: orderBy.name,
              order: {
                html: orderBy.order || GROUPBY_DEFAULT_ORDER
              }
            };
          }
        }, {
          key: "filterAction",
          value: function filterAction() {
            var _this2 = this;

            var filter = this.target.filter.find(function (f) {
              return f.name === _this2.filterSegment.name;
            });

            if (!filter) {
              var newFilter = this.createFilter(this.filterSegment.value);
              this.target.filter.push(newFilter);
              this.filterSegments.push(this.createFilterSegment(newFilter));
            }

            var plusButton = this.uiSegmentSrv.newPlusButton();
            this.filterSegment.value = plusButton.value;
            this.filterSegment.html = plusButton.html;
            this.panelCtrl.refresh();
          }
        }, {
          key: "orderByAction",
          value: function orderByAction() {
            var _this3 = this;

            var orderBy = this.target.orderBy.find(function (e) {
              return e.name === _this3.orderBySegment.name;
            });

            if (!orderBy) {
              var newOrderBy = this.createOrderBy(this.orderBySegment.value);
              this.target.orderBy.push(newOrderBy);
              this.orderBySegments.push(this.createOrderBySegment(newOrderBy));
            }

            var plusButton = this.uiSegmentSrv.newPlusButton();
            this.orderBySegment.value = plusButton.value;
            this.orderBySegment.html = plusButton.html;
            this.panelCtrl.refresh();
          }
        }, {
          key: "handleGroupByPartEvent",
          value: function handleGroupByPartEvent(selectParts, part, evt) {
            switch (evt.name) {
              case 'action':
                {
                  this.target.groupBy.splice(part, 1);
                  this.groupByParts.splice(part, 1);
                  this.panelCtrl.refresh();
                  break;
                }

              case 'get-part-actions':
                {
                  return this.$q.when([{
                    text: 'Remove',
                    value: 'remove-part'
                  }]);
                }
            }
          }
        }, {
          key: "filterSegmentUpdate",
          value: function filterSegmentUpdate(segment, $index) {
            if (segment.value === REMOVE_ITEM_TEXT) {
              this.target.filter.splice($index, 1);
              this.filterSegments.splice($index, 1);
            } else {
              this.target.filter[$index].name = segment.value;
            }

            this.panelCtrl.refresh();
          }
        }, {
          key: "filterOperatorSegmentUpdate",
          value: function filterOperatorSegmentUpdate(segment, $index) {
            this.target.filter[$index].operator = segment.operator.value;
            this.panelCtrl.refresh();
          }
        }, {
          key: "filterValueSegmentUpdate",
          value: function filterValueSegmentUpdate(segment, $index) {
            this.target.filter[$index].value = segment.filterValue.value;
            this.panelCtrl.refresh();
          }
        }, {
          key: "orderByDimensionSegmentUpdate",
          value: function orderByDimensionSegmentUpdate(segment, $index) {
            if (segment.value === REMOVE_ITEM_TEXT) {
              this.target.orderBy.splice($index, 1);
              this.orderBySegments.splice($index, 1);
            } else {
              this.target.orderBy[$index].name = segment.value;
            }

            this.panelCtrl.refresh();
          }
        }, {
          key: "orderByOrderSegmentUpdate",
          value: function orderByOrderSegmentUpdate(segment, $index) {
            this.target.orderBy[$index].order = segment.order.value;
            this.panelCtrl.refresh();
          }
        }, {
          key: "isDimensionAMetric",
          value: function isDimensionAMetric(dimension) {
            return METRICS_ATTRIBUTE_LIST.includes(dimension);
          }
        }]);

        return BitmovinAnalyticsDatasourceQueryCtrl;
      }(QueryCtrl));

      BitmovinAnalyticsDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
