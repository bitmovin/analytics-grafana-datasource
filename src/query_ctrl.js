import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

import _ from 'lodash';

const REMOVE_FILTER_TEXT = '-- Remove Filter --';
const DEFAULT_OPERATOR = 'EQ';

export class BitmovinAnalyticsDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, templateSrv, $q, uiSegmentSrv)  {
    super($scope, $injector);

    this.scope = $scope;
    this.$q = $q;
    this.uiSegmentSrv = uiSegmentSrv;

    this.metrics = ['count', 'sum', 'avg', 'min', 'max', 'stddev', 'percentile', 'variance', 'median'];
    this.fields = ['LICENSE_KEY', 'PLAYER_KEY', 'IMPRESSION_ID', 'USER_ID', 'DOMAIN', 'PATH', 'LANGUAGE', 'PLAYER_TECH', 'SCREEN_WIDTH',
                   'SCREEN_HEIGHT', 'IP_ADDRESS', 'STREAM_FORMAT', 'PLAYER', 'PLAYER_VERSION', 'ANALYTICS_VERSION', 'VIDEO_DURATION',
                   'IS_LIVE', 'IS_CASTING', 'IS_MUTED', 'VIDEO_ID', 'PLAYER_STARTUPTIME', 'VIDEO_STARTUPTIME', 'CUSTOM_USER_ID',
                   'CLIENT_TIME', 'SIZE', 'VIDEO_WINDOW_WIDTH', 'VIDEO_WINDOW_HEIGHT', 'DROPPED_FRAMES', 'PLAYED', 'PAUSED',
                   'BUFFERED', 'AD', 'SEEKED', 'VIDEO_PLAYBACK_WIDTH', 'VIDEO_PLAYBACK_HEIGHT', 'VIDEO_BITRATE', 'AUDIO_BITRATE',
                   'VIDEOTIME_START', 'VIDEOTIME_END', 'DURATION', 'STARTUPTIME', 'BROWSER', 'BROWSER_VERSION_MAJOR', 'OPERATINGSYSTEM',
                   'OPERATINGSYSTEM_VERSION_MAJOR', 'DEVICE_TYPE', 'COUNTRY', 'REGION', 'CITY', 'CDN_PROVIDER', 'MPD_URL', 'M3U8_URL',
                   'PROG_URL', 'ERROR_CODE', 'SCALE_FACTOR', 'PAGE_LOAD_TIME', 'PAGE_LOAD_TYPE', 'AUTOPLAY', 'CUSTOM_DATA_1',
                   'CUSTOM_DATA_2', 'CUSTOM_DATA_3', 'CUSTOM_DATA_4', 'CUSTOM_DATA_5', 'EXPERIMENT_NAME'];
    this.operators = ['EQ', 'NE', 'LT', 'LTE', 'GT', 'GTE', 'CONTAINS', 'NOTCONTAINS']
    this.licenses = [];
    this.resultFormats = ['time_series', 'table'];
    this.intervals = ['MINUTE', 'HOUR', 'DAY', 'MONTH'];
    this.filterSegment = this.uiSegmentSrv.newPlusButton();
    this.groupBySegment = this.uiSegmentSrv.newPlusButton();
    this.groupByParts = [];
    this.filterSegments = [];

    this.target.metric = this.target.metric || this.metrics[0];
    this.target.percentileValue = this.target.percentileValue || 95;
    this.target.dimension = this.target.dimension || this.fields[0];
    this.target.license = this.target.license || this.licenses[0];
    this.target.resultFormat = this.target.resultFormat || this.resultFormats[0];
    this.target.interval = this.target.interval || this.intervals[0];
    this.target.alias = this.target.alias || '';
    this.target.groupBy = this.target.groupBy || [];
    this.target.filter = this.target.filter || [];

    this.datasource.getLicenses().then(response => {
      if (response.status === 200) {
        this.licenses = [];

        for (var item of response.data.data.result.items) {
          item['label'] = item.name + ' (' + item.licenseKey + ')';
          this.licenses.push(item);
        }

        this.target.license = this.licenses[0].licenseKey;
      }
    });
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }

  getGroupByOptions() {
    let options = _.map(this.fields, function(field) {
      return { value: field, text: field };
    });

    return Promise.resolve(options);
  }

  getFilterOptions() {
    let options = _.map(this.fields, function(field) {
      return { value: field, text: field };
    });

    return Promise.resolve(options);
  }

  getFilterSegmentOptions() {
    var options = _.map(this.fields, function(field) {
      return { value: field, text: field };
    });

    options.unshift({
      value: REMOVE_FILTER_TEXT,
      text: REMOVE_FILTER_TEXT
    })

    return Promise.resolve(options);
  }

  getFilterOperatorOptions() {
    let options = _.map(this.operators, function(op) {
      return { value: op, text: op };
    });

    return Promise.resolve(options);
  }

  getFilterValueOptions(segment, $index) {
    return Promise.resolve([]);
  }

  groupByAction() {
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

    const plusButton = this.uiSegmentSrv.newPlusButton();
    this.groupBySegment.value = plusButton.value;
    this.groupBySegment.html = plusButton.html;
    this.panelCtrl.refresh();
  }

  filterAction() {
    this.target.filter.push({
      name: this.filterSegment.value,
      operator: DEFAULT_OPERATOR,
      value: ''
    });

    this.filterSegments.push({
      html: this.filterSegment.value,
      operator: {html: DEFAULT_OPERATOR},
      filterValue: {html: 'set filter value'}
    });

    const plusButton = this.uiSegmentSrv.newPlusButton();
    this.filterSegment.value = plusButton.value;
    this.filterSegment.html = plusButton.html;
    this.panelCtrl.refresh();
  }

  handleGroupByPartEvent(selectParts, part, evt) {
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
  }

  filterSegmentUpdate(segment, $index) {
    if (segment.value === REMOVE_FILTER_TEXT) {
      this.target.filter.splice($index, 1);
      this.filterSegments.splice($index, 1);
    } else {
      this.target.filter[$index].name = segment.value;
    }

    this.panelCtrl.refresh();
  }

  filterOperatorSegmentUpdate(segment, $index) {
    this.target.filter[$index].operator = segment.operator.value;
    this.panelCtrl.refresh();
  }

  filterValueSegmentUpdate(segment, $index) {
    this.target.filter[$index].value = segment.filterValue.value;
    this.panelCtrl.refresh();
  }
}

BitmovinAnalyticsDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

