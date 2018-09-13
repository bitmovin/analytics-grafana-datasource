import _ from 'lodash';
import {convertFilterValueToProperType, ATTRIBUTE} from './types/queryAttributes';
import { AGGREGATION } from './types/aggregations';
import { QUERY_INTERVAL } from './types/intervals';

export class BitmovinAnalyticsDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;

    this.headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': instanceSettings.jsonData.apiKey,
    };

    const tenantOrgId = instanceSettings.jsonData.tenantOrgId;
    if (typeof tenantOrgId === 'string' && tenantOrgId.length > 0) {
      this.headers['X-Tenant-Org-Id'] = tenantOrgId;
    }

    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }
  }

  query(options) {
    var query = this.buildQueryParameters(options);
    query.targets = query.targets.filter(t => !t.hide);

    if (query.targets.length <= 0) {
      return this.q.when({data: []});
    }

    if (this.templateSrv.getAdhocFilters) {
      query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
    } else {
      query.adhocFilters = [];
    }

    let targetResponsePromises = _.map(query.targets, target => {
      target.metric = target.metric || AGGREGATION.COUNT;
      target.dimension = target.dimension || ATTRIBUTE.LICENSE_KEY;
      target.resultFormat = target.resultFormat || 'time_series';
      target.interval = target.interval || QUERY_INTERVAL.HOUR;

      var data = {
        licenseKey: target.license,
        dimension: target.dimension,
        start: options.range.from.toISOString(),
        end: options.range.to.toISOString(),
        filters: _.map(target.filter, filter => {
          return {
            name: filter.name,
            operator: filter.operator,
            value: convertFilterValueToProperType(filter)
          }
        })
      };

      if (target.metric === 'percentile') {
        data['percentile'] = target.percentileValue;
      }

      if (target.resultFormat === 'time_series') {
        data['interval'] = target.interval;
      } else if (target.resultFormat === 'table'){
        data['groupBy'] = target.groupBy;
        data['limit'] = target.limit;
      }

      return this.doRequest({
        url: this.url + '/analytics/queries/' + target.metric,
        data: data,
        method: 'POST',
        resultTarget: target.alias || target.refId,
        resultFormat: target.resultFormat
      });
    });

    return Promise.all(targetResponsePromises).then(targetResponses => {
      return {
        data: _.map(targetResponses, response => {
          var datapoints = _.map(response.data.data.result.rows, row => {
            return [row[1], row[0]]; // value, timestamp
          });

          if (response.config.resultFormat === 'time_series') {
            datapoints = _.orderBy(datapoints, [1], 'asc')
          }

          return {
            target: response.config.resultTarget,
            datapoints: datapoints
          };
        })
      };
    });
  }

  testDatasource() {
    return this.getLicenses().then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }

  annotationQuery(options) {

  }

  metricFindQuery(query) {

  }

  doRequest(options) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;

    return this.backendSrv.datasourceRequest(options);
  }

  buildQueryParameters(options) {
    return options;
  }

  getLicenses() {
    return this.doRequest({
      url: this.url + '/analytics/licenses',
      method: 'GET',
    });
  }
}
