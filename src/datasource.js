import _ from "lodash";

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

    if (typeof instanceSettings.tenantOrgId === 'string' && instanceSettings.tenantOrgId.length > 0) {
      this.headers['X-Tenant-Org-Id'] = instanceSettings.tenantOrgId;
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
      target.metric = target.metric || 'count';
      target.dimension = target.dimension || 'LICENSE_KEY';
      target.resultFormat = target.resultFormat || 'time_series';
      target.interval = target.interval || 'MINUTE';

      var data = {
        licenseKey: target.license,
        dimension: target.dimension,
        start: options.range.from.toISOString(),
        end: options.range.to.toISOString(),
        filters: _.map(target.filter, filter => {
          return {
            name: filter.name,
            operator: filter.operator,
            value: this.convertFilterValueToProperType(filter)
          }
        })
      };

      if (target.metric === 'percentile') {
        data['percentile'] = target.percentileValue;
      }

      if (target.resultFormat === 'time_series') {
        data['interval'] = target.interval;
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

  convertFilterValueToProperType(filter) {
    switch(filter.name) {
      case 'IS_LIVE':
      case 'IS_CASTING':
      case 'IS_MUTED': return filter.value === 'true';
      case 'PLAYER_STARTUPTIME':
      case 'VIDEO_STARTUPTIME':
      case 'CLIENT_TIME':
      case 'VIDEOTIME':
      case 'VIDEOTIME':
      case 'STARTUPTIME':
      case 'PAGE_LOAD_TIME': return parseInt(filter.value, 10);
      default: return filter.value
    }
  }
}
