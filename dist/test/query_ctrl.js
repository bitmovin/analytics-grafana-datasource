'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitmovinAnalyticsDatasourceQueryCtrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('app/plugins/sdk');

require('./css/query-editor.css!');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var REMOVE_FILTER_TEXT = '-- Remove Filter --';
var DEFAULT_OPERATOR = 'EQ';

var BitmovinAnalyticsDatasourceQueryCtrl = exports.BitmovinAnalyticsDatasourceQueryCtrl = function (_QueryCtrl) {
  _inherits(BitmovinAnalyticsDatasourceQueryCtrl, _QueryCtrl);

  function BitmovinAnalyticsDatasourceQueryCtrl($scope, $injector, templateSrv, $q, uiSegmentSrv) {
    _classCallCheck(this, BitmovinAnalyticsDatasourceQueryCtrl);

    var _this = _possibleConstructorReturn(this, (BitmovinAnalyticsDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(BitmovinAnalyticsDatasourceQueryCtrl)).call(this, $scope, $injector));

    _this.scope = $scope;
    _this.$q = $q;
    _this.uiSegmentSrv = uiSegmentSrv;

    _this.metrics = ['count', 'sum', 'avg', 'min', 'max', 'stddev', 'percentile', 'variance', 'median'];
    _this.fields = ['LICENSE_KEY', 'PLAYER_KEY', 'IMPRESSION_ID', 'USER_ID', 'DOMAIN', 'PATH', 'LANGUAGE', 'PLAYER_TECH', 'SCREEN_WIDTH', 'SCREEN_HEIGHT', 'IP_ADDRESS', 'STREAM_FORMAT', 'PLAYER', 'PLAYER_VERSION', 'ANALYTICS_VERSION', 'VIDEO_DURATION', 'IS_LIVE', 'IS_CASTING', 'IS_MUTED', 'VIDEO_ID', 'PLAYER_STARTUPTIME', 'VIDEO_STARTUPTIME', 'CUSTOM_USER_ID', 'CLIENT_TIME', 'SIZE', 'VIDEO_WINDOW_WIDTH', 'VIDEO_WINDOW_HEIGHT', 'DROPPED_FRAMES', 'PLAYED', 'PAUSED', 'BUFFERED', 'AD', 'SEEKED', 'VIDEO_PLAYBACK_WIDTH', 'VIDEO_PLAYBACK_HEIGHT', 'VIDEO_BITRATE', 'AUDIO_BITRATE', 'VIDEOTIME_START', 'VIDEOTIME_END', 'DURATION', 'STARTUPTIME', 'BROWSER', 'BROWSER_VERSION_MAJOR', 'OPERATINGSYSTEM', 'OPERATINGSYSTEM_VERSION_MAJOR', 'DEVICE_TYPE', 'COUNTRY', 'REGION', 'CITY', 'CDN_PROVIDER', 'MPD_URL', 'M3U8_URL', 'PROG_URL', 'ERROR_CODE', 'SCALE_FACTOR', 'PAGE_LOAD_TIME', 'PAGE_LOAD_TYPE', 'AUTOPLAY', 'CUSTOM_DATA_1', 'CUSTOM_DATA_2', 'CUSTOM_DATA_3', 'CUSTOM_DATA_4', 'CUSTOM_DATA_5', 'EXPERIMENT_NAME'];
    _this.operators = ['EQ', 'NE', 'LT', 'LTE', 'GT', 'GTE', 'CONTAINS', 'NOTCONTAINS'];
    _this.licenses = [];
    _this.resultFormats = ['time_series', 'table'];
    _this.intervals = ['MINUTE', 'HOUR', 'DAY', 'MONTH'];
    _this.filterSegment = _this.uiSegmentSrv.newPlusButton();
    _this.groupBySegment = _this.uiSegmentSrv.newPlusButton();
    _this.groupByParts = [];
    _this.filterSegments = _this.target.filter ? _this.target.filter.map(function (f) {
      return _this.createFilterSegment(f);
    }) : [];

    _this.target.metric = _this.target.metric || _this.metrics[0];
    _this.target.percentileValue = _this.target.percentileValue || 95;
    _this.target.dimension = _this.target.dimension || _this.fields[0];
    _this.target.license = _this.target.license || _this.licenses[0];
    _this.target.resultFormat = _this.target.resultFormat || _this.resultFormats[0];
    _this.target.interval = _this.target.interval || _this.intervals[0];
    _this.target.alias = _this.target.alias || '';
    _this.target.groupBy = _this.target.groupBy || [];
    _this.target.filter = _this.target.filter || [];

    _this.datasource.getLicenses().then(function (response) {
      if (response.status === 200) {
        _this.licenses = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = response.data.data.result.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            item['label'] = item.name + ' (' + item.licenseKey + ')';
            _this.licenses.push(item);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!_this.target.license || !_this.licenses.find(function (l) {
          return l.licenseKey === _this.target.license;
        })) {
          _this.target.license = _this.licenses[0].licenseKey;
        }
      }
    });
    return _this;
  }

  _createClass(BitmovinAnalyticsDatasourceQueryCtrl, [{
    key: 'onChangeInternal',
    value: function onChangeInternal() {
      this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
  }, {
    key: 'getGroupByOptions',
    value: function getGroupByOptions() {
      var options = _lodash2.default.map(this.fields, function (field) {
        return { value: field, text: field };
      });

      return Promise.resolve(options);
    }
  }, {
    key: 'getFilterOptions',
    value: function getFilterOptions() {
      var options = _lodash2.default.map(this.fields, function (field) {
        return { value: field, text: field };
      });

      return Promise.resolve(options);
    }
  }, {
    key: 'getFilterSegmentOptions',
    value: function getFilterSegmentOptions() {
      var options = _lodash2.default.map(this.fields, function (field) {
        return { value: field, text: field };
      });

      options.unshift({
        value: REMOVE_FILTER_TEXT,
        text: REMOVE_FILTER_TEXT
      });

      return Promise.resolve(options);
    }
  }, {
    key: 'getFilterOperatorOptions',
    value: function getFilterOperatorOptions() {
      var options = _lodash2.default.map(this.operators, function (op) {
        return { value: op, text: op };
      });

      return Promise.resolve(options);
    }
  }, {
    key: 'getFilterValueOptions',
    value: function getFilterValueOptions(segment, $index) {
      return Promise.resolve([]);
    }
  }, {
    key: 'groupByAction',
    value: function groupByAction() {
      this.target.groupBy.push(this.groupBySegment.value);

      this.groupByParts.push({
        params: [this.groupBySegment.value],
        def: {
          type: 'dimension',
          params: [{
            optional: false
          }]
        }
      });

      var plusButton = this.uiSegmentSrv.newPlusButton();
      this.groupBySegment.value = plusButton.value;
      this.groupBySegment.html = plusButton.html;
      this.panelCtrl.refresh();
    }
  }, {
    key: 'createFilter',
    value: function createFilter(name, operator) {
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      return { name: name, operator: operator || DEFAULT_OPERATOR, value: value };
    }
  }, {
    key: 'createFilterSegment',
    value: function createFilterSegment(filter) {
      return { html: filter.name, operator: { html: filter.operator || DEFAULT_OPERATOR }, filterValue: { html: filter.value || 'set filter value' } };
    }
  }, {
    key: 'filterAction',
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
    key: 'handleGroupByPartEvent',
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
            return this.$q.when([{ text: 'Remove', value: 'remove-part' }]);
          }
      }
    }
  }, {
    key: 'filterSegmentUpdate',
    value: function filterSegmentUpdate(segment, $index) {
      if (segment.value === REMOVE_FILTER_TEXT) {
        this.target.filter.splice($index, 1);
        this.filterSegments.splice($index, 1);
      } else {
        this.target.filter[$index].name = segment.value;
      }

      this.panelCtrl.refresh();
    }
  }, {
    key: 'filterOperatorSegmentUpdate',
    value: function filterOperatorSegmentUpdate(segment, $index) {
      this.target.filter[$index].operator = segment.operator.value;
      this.panelCtrl.refresh();
    }
  }, {
    key: 'filterValueSegmentUpdate',
    value: function filterValueSegmentUpdate(segment, $index) {
      this.target.filter[$index].value = segment.filterValue.value;
      this.panelCtrl.refresh();
    }
  }]);

  return BitmovinAnalyticsDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

BitmovinAnalyticsDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map
