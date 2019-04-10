import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

import _ from 'lodash';
import { ATTRIBUTE_LIST, convertFilterValueToProperType, getAsOptionsList } from './types/queryAttributes';
import { OPERATOR_LIST, OPERATOR } from './types/operators';
import { QUERY_INTERVAL, QUERY_INTERVAL_LIST } from './types/intervals';
import { AGGREGATION_LIST } from './types/aggregations';
import { ResultFormat } from './types/resultFormat';

const REMOVE_FILTER_TEXT = '-- Remove Filter --';
const DEFAULT_LICENSE = {licenseKey: '<YOUR LICENSE KEY>', label: '-- Select License --'};
const DEFAULT_OPERATOR = OPERATOR.EQ;

export class BitmovinAnalyticsDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, templateSrv, $q, uiSegmentSrv)  {
    super($scope, $injector);

    this.scope = $scope;
    this.$q = $q;
    this.uiSegmentSrv = uiSegmentSrv;

    this.metrics = AGGREGATION_LIST;
    this.fields = ATTRIBUTE_LIST;
    this.operators = OPERATOR_LIST;
    this.licenses = [];
    this.resultFormats = [ResultFormat.TIME_SERIES, ResultFormat.TABLE];
    this.intervals = QUERY_INTERVAL_LIST;
    this.filterSegment = this.uiSegmentSrv.newPlusButton();
    this.groupBySegment = this.uiSegmentSrv.newPlusButton();
    this.groupByParts = this.target.groupBy ? this.target.groupBy.map(e => this.createGroupByPartsEntry(e)) : [];
    this.filterSegments = this.target.filter ? this.target.filter.map(f => this.createFilterSegment(f)) : [];

    this.target.metric = this.target.metric || this.metrics[0];
    this.target.percentileValue = this.target.percentileValue || 95;
    this.target.dimension = this.target.dimension || this.fields[0];
    this.target.license = this.target.license || this.licenses[0];
    this.target.resultFormat = this.target.resultFormat || this.resultFormats[0];
    this.target.interval = this.target.interval || QUERY_INTERVAL.HOUR;
    this.target.alias = this.target.alias || '';
    this.target.groupBy = this.target.groupBy || [];
    this.target.filter = this.target.filter || [];
    this.target.limit = this.target.limit;
    this.lastQueryError = [];

    this.datasource.getLicenses().then(response => {
      if (response.status === 200) {
        this.licenses = [DEFAULT_LICENSE];

        for (var item of response.data.data.result.items) {
          item['label'] = item.name ? item.name : item.licenseKey;
          this.licenses.push(item);
        }

        if (!this.target.license || !this.licenses.find(l => l.licenseKey === this.target.license)) {
          this.target.license = DEFAULT_LICENSE.licenseKey;
        }
      }
    });

    this.panelCtrl.events.on('data-received', this.onDataReceived.bind(this), $scope);
    this.panelCtrl.events.on('data-error', this.onDataError.bind(this), $scope);
  }

  onDataReceived(dataList) {
    this.lastQueryError = [];
  }

  onDataError(err) {
    this.handleQueryCtrlError(err);
  }

  handleQueryCtrlError(err) {
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

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }

  getGroupByOptions() {
    let options = getAsOptionsList(this.fields);
    return Promise.resolve(options);
  }

  getFilterOptions() {
    let options = getAsOptionsList(this.fields);
    return Promise.resolve(options);
  }

  getFilterSegmentOptions() {
    var options = getAsOptionsList(this.fields);

    options.unshift({
      value: REMOVE_FILTER_TEXT,
      text: REMOVE_FILTER_TEXT
    })

    return Promise.resolve(options);
  }

  getFilterOperatorOptions() {
    let options = getAsOptionsList(this.operators);

    return Promise.resolve(options);
  }

  getFilterValueOptions(segment, $index) {
    return Promise.resolve([]);
  }

  createGroupByPartsEntry(groupByValue) {
    return {
      params: [groupByValue],
      def: {
        type: 'dimension',
        params: [{
          optional: false
        }]
      }
    }
  }

  groupByAction() {
    this.target.groupBy.push(this.groupBySegment.value);

    this.groupByParts.push(this.createGroupByPartsEntry(this.groupBySegment.value));

    const plusButton = this.uiSegmentSrv.newPlusButton();
    this.groupBySegment.value = plusButton.value;
    this.groupBySegment.html = plusButton.html;
    this.panelCtrl.refresh();
  }

  createFilter(name, operator, value=null) {
    const filter = {name, operator: operator || DEFAULT_OPERATOR, value};
    filter.value = convertFilterValueToProperType(filter)
    return filter;
  }

  createFilterSegment(filter) {
    return {html: filter.name, operator: {html: filter.operator || DEFAULT_OPERATOR}, filterValue: {html: filter.value || 'set filter value'}};
  }

  filterAction() {
    const filter = this.target.filter.find(f => f.name === this.filterSegment.name);
    if (!filter) {
      const newFilter = this.createFilter(this.filterSegment.value)
      this.target.filter.push(newFilter);

      this.filterSegments.push(this.createFilterSegment(newFilter));
    }

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

