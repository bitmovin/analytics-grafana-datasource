import _ from 'lodash';
import { convertFilterValueToProperType, ATTRIBUTE, ATTRIBUTE_LIST, AD_ATTRIBUTE_LIST, METRICS_ATTRIBUTE_LIST, ORDERBY_ATTRIBUTES, getAsOptionsList } from './types/queryAttributes';
import { AGGREGATION } from './types/aggregations';
import { calculateAutoInterval, getMomentTimeUnitForQueryInterval, QUERY_INTERVAL } from './types/intervals';
import { transform } from './result_transformer';
import { ResultFormat } from './types/resultFormat';
import { OPERATOR } from './types/operators';

const getApiRequestUrl = (baseUrl, isAdAnalytics, isMetric) => {
  if (isAdAnalytics === true) {
    return baseUrl + '/analytics/ads/queries';
  }
  if (isMetric == true) {
    return baseUrl + '/analytics/metrics';
  }
  return baseUrl + '/analytics/queries';
};

const mapMathOperatorToAnalyticsFilterOperator = (operator) => {
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

export class BitmovinAnalyticsDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.isAdAnalytics = instanceSettings.jsonData.isAdAnalytics;
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
    const query = this.buildQueryParameters(options);
    query.targets = query.targets.filter(t => !t.hide);

    if (query.targets.length <= 0) {
      return this.q.when({ data: [] });
    }

    if (this.templateSrv.getAdhocFilters) {
      query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
    } else {
      query.adhocFilters = [];
    }

    const targetResponsePromises = _.map(query.targets, target => {
      target.resultFormat = target.resultFormat || ResultFormat.TIME_SERIES;
      target.interval = target.interval || QUERY_INTERVAL.HOUR;

      const filters = _.map([...target.filter, ...query.adhocFilters], e => {
        let filter = {
          name: (e.name) ? e.name : e.key,
          operator: mapMathOperatorToAnalyticsFilterOperator(e.operator),
          value: this.templateSrv.replace(e.value, options.scopedVars)
        }
        return {
          name: filter.name,
          operator: filter.operator,
          value: convertFilterValueToProperType(filter)
        }
      });
      const orderBy = _.map(target.orderBy, e => ({ name: e.name, order: e.order }));
      const data = {
        licenseKey: target.license,
        start: options.range.from.toISOString(),
        end: options.range.to.toISOString(),
        filters,
        orderBy
      };

      let isMetric = METRICS_ATTRIBUTE_LIST.includes(target.dimension);
      let urlAppendix = '';

      if (isMetric) {
        urlAppendix = target.dimension;
        data['metric'] = target.dimension
      } else {
        target.metric = target.metric || AGGREGATION.COUNT;
        target.dimension = target.dimension || ATTRIBUTE.LICENSE_KEY;
        urlAppendix = target.metric
        data['dimension'] = target.dimension;

        if (target.metric === 'percentile') {
          data['percentile'] = target.percentileValue;
        }
      }

      if (target.resultFormat === ResultFormat.TIME_SERIES) {
        data['interval'] = target.interval;
        if (target.interval === QUERY_INTERVAL.AUTO) {
          const intervalMs = options.range.to.valueOf() - options.range.from.valueOf();
          data['interval'] = calculateAutoInterval(intervalMs);
        }

        if (target.intervalSnapTo === true) {
          const intervalTimeUnit = getMomentTimeUnitForQueryInterval(data['interval']);
          if (intervalTimeUnit != null) {
            data['start'] = options.range.from.startOf(intervalTimeUnit).toISOString();
            data['end'] = options.range.to.startOf(intervalTimeUnit).toISOString();
          }
        }
      }
      data['groupBy'] = target.groupBy;
      data['orderBy'].forEach(e => {
        if (e.name == ORDERBY_ATTRIBUTES.INTERVAL) {
          e.name = data['interval'];
        }
      });
      data['limit'] = Number(target.limit) || undefined;
      var apiRequestUrl = getApiRequestUrl(this.url, this.isAdAnalytics, isMetric);

      return this.doRequest({
        url: apiRequestUrl + '/' + urlAppendix,
        data: data,
        method: 'POST',
        resultTarget: target.alias || target.refId,
        resultFormat: target.resultFormat
      });
    });

    return Promise.all(targetResponsePromises).then(targetResponses => {
      let result = [];
      _.map(targetResponses, response => {
        const series = transform(response, options);
        result = [...result, ...series];
      });
      return {
        data: result
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

  getTagKeys(options) {
    if (this.isAdAnalytics) {
      return Promise.resolve(getAsOptionsList(AD_ATTRIBUTE_LIST));
    }
    return Promise.resolve(getAsOptionsList(ATTRIBUTE_LIST));
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
