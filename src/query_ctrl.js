import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

import _ from 'lodash';
import { ATTRIBUTE_LIST, convertFilterValueToProperType, getAsOptionsList, ORDERBY_ATTRIBUTES_LIST, AD_ATTRIBUTE_LIST, ORDERBY_AD_ATTRIBUTES_LIST } from './types/queryAttributes';
import { OPERATOR_LIST, OPERATOR, ORDERBY_LIST, ORDERBY } from './types/operators';
import { QUERY_INTERVAL, QUERY_INTERVAL_LIST } from './types/intervals';
import { AGGREGATION_LIST } from './types/aggregations';
import { ResultFormat } from './types/resultFormat';

const REMOVE_ITEM_TEXT = '-- Remove --';
const DEFAULT_LICENSE = {licenseKey: '<YOUR LICENSE KEY>', label: '-- Select License --'};
const DEFAULT_OPERATOR = OPERATOR.EQ;
const GROUPBY_DEFAULT_ORDER = ORDERBY.ASC;

export class BitmovinAnalyticsDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, templateSrv, $q, uiSegmentSrv)  {
    super($scope, $injector);

    this.scope = $scope;
    this.$q = $q;
    this.uiSegmentSrv = uiSegmentSrv;

    this.metrics = AGGREGATION_LIST;
    this.fields = ATTRIBUTE_LIST;
    this.orderByFields = ORDERBY_ATTRIBUTES_LIST;
    if (this.datasource.isAdAnalytics === true) {
      this.fields = AD_ATTRIBUTE_LIST;
      this.orderByFields = ORDERBY_AD_ATTRIBUTES_LIST;
    }
    this.licenses = [];
    this.resultFormats = [ResultFormat.TIME_SERIES, ResultFormat.TABLE];
    this.intervals = QUERY_INTERVAL_LIST;
    this.filterSegment = this.uiSegmentSrv.newPlusButton();
    this.groupBySegment = this.uiSegmentSrv.newPlusButton();
    this.orderBySegment = this.uiSegmentSrv.newPlusButton();
    this.groupByParts = this.target.groupBy ? this.target.groupBy.map(e => this.createGroupByPartsEntry(e)) : [];
    this.orderBySegments = this.target.orderBy ? this.target.orderBy.map(e => this.createOrderBySegment(e)) : [];
    this.filterSegments = this.target.filter ? this.target.filter.map(f => this.createFilterSegment(f)) : [];

    this.target.metric = this.target.metric || this.metrics[0];
    this.target.percentileValue = this.target.percentileValue || 95;
    this.target.dimension = this.target.dimension || this.fields[0];
    this.target.license = this.target.license || this.licenses[0];
    this.target.resultFormat = this.target.resultFormat || this.resultFormats[0];
    this.target.interval = this.target.interval || QUERY_INTERVAL.HOUR;
    this.target.alias = this.target.alias || '';
    this.target.groupBy = this.target.groupBy || [];
    this.target.orderBy = this.target.orderBy || [];
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
      value: REMOVE_ITEM_TEXT,
      text: REMOVE_ITEM_TEXT
    })

    return Promise.resolve(options);
  }

  getFilterOperatorOptions() {
    let options = getAsOptionsList(OPERATOR_LIST);
    return Promise.resolve(options);
  }

  getFilterValueOptions(segment, $index) {
    return Promise.resolve([]);
  }

  getOrderByDimensionOptions() {
    var options = getAsOptionsList(this.orderByFields);

    options.unshift({
      value: REMOVE_ITEM_TEXT,
      text: REMOVE_ITEM_TEXT
    })

    return Promise.resolve(options);
  }

  getOrderByOperatorOptions() {
    let options = getAsOptionsList(ORDERBY_LIST);
    return Promise.resolve(options);
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

  createOrderBy(name, order) {
    return {name, order: order || GROUPBY_DEFAULT_ORDER};
  }

  createOrderBySegment(orderBy) {
    return {html: orderBy.name, order: {html: orderBy.order || GROUPBY_DEFAULT_ORDER}};
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

  orderByAction() {
    const orderBy = this.target.orderBy.find(e => e.name === this.orderBySegment.name);
    if (!orderBy) {
      const newOrderBy = this.createOrderBy(this.orderBySegment.value)
      this.target.orderBy.push(newOrderBy);

      this.orderBySegments.push(this.createOrderBySegment(newOrderBy));
    }

    const plusButton = this.uiSegmentSrv.newPlusButton();
    this.orderBySegment.value = plusButton.value;
    this.orderBySegment.html = plusButton.html;
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
    if (segment.value === REMOVE_ITEM_TEXT) {
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

  orderByDimensionSegmentUpdate(segment, $index) {
    if (segment.value === REMOVE_ITEM_TEXT) {
      this.target.orderBy.splice($index, 1);
      this.orderBySegments.splice($index, 1);
    } else {
      this.target.orderBy[$index].name = segment.value;
    }

    this.panelCtrl.refresh();
  }

  orderByOrderSegmentUpdate(segment, $index) {
    this.target.orderBy[$index].order = segment.order.value;
    this.panelCtrl.refresh();
  }
}

BitmovinAnalyticsDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

