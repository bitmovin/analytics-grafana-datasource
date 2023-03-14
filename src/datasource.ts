import {
  ATTRIBUTE,
  ATTRIBUTE_LIST,
  AD_ATTRIBUTE_LIST,
  METRICS_ATTRIBUTE_LIST,
  QUERY_SPECIFIC_ORDERBY_ATTRIBUTES
} from './types/queryAttributes';
import {getAsOptionsList} from './utils/uiUtils'
import { convertFilterValueToProperType } from './utils/queryUtils'
import { AGGREGATION } from './types/aggregations';
import { calculateAutoInterval, getMomentTimeUnitForQueryInterval } from './utils/intervalUtils';
import { QUERY_INTERVAL } from './types/intervals';
import { transform } from './result_transformer';
import { ResultFormat } from './types/resultFormat';
import { OPERATOR } from './types/operators';
import LicenseService from './licenseService';
import RequestHandler from './requestHandler';

const getApiRequestUrl = (baseUrl, isAdAnalytics, isMetric): string => {
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

  //TODOMY besser unknonw als any
  type: string;
  url: string;
  isAdAnalytics: boolean;
  name: string;
  q: any;
  backendSrv: any;
  templateSrv: any;
  withCredentials: boolean;
  requestHandler: RequestHandler;
  licenseService: LicenseService;

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.isAdAnalytics = instanceSettings.jsonData.isAdAnalytics;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;

    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': instanceSettings.jsonData.apiKey,
    };

    const tenantOrgId = instanceSettings.jsonData.tenantOrgId;
    if (typeof tenantOrgId === 'string' && tenantOrgId.length > 0) {
      headers['X-Tenant-Org-Id'] = tenantOrgId;
    }

    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      headers['Authorization'] = instanceSettings.basicAuth;
    }

    this.requestHandler = new RequestHandler(backendSrv, headers, instanceSettings.withCredentials)
    this.licenseService = new LicenseService(this.requestHandler, instanceSettings.url);
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


    const targetResponsePromises = query.targets.map(target => {
      target.resultFormat = target.resultFormat || ResultFormat.TIME_SERIES;
      target.interval = target.interval || QUERY_INTERVAL.HOUR;

      const filters = [...target.filter, ...query.adhocFilters].map( e => {
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
      const orderBy = target.orderBy.map(e => ({ name: e.name, order: e.order }));
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
        if (e.name == QUERY_SPECIFIC_ORDERBY_ATTRIBUTES.INTERVAL) {
          e.name = data['interval'];
        }
      });
      data['limit'] = Number(target.limit) || undefined;
      var apiRequestUrl = getApiRequestUrl(this.url, this.isAdAnalytics, isMetric);

      const requestOptions = {
        url: apiRequestUrl + '/' + urlAppendix,
        data: data,
        method: 'POST',
        resultTarget: target.alias || target.refId,
        resultFormat: target.resultFormat
      };
      return this.requestHandler.doRequest(requestOptions);
    });

    return Promise.all(targetResponsePromises).then(targetResponses => {
      let result = {
        series: [],
        datapointsCnt: 0
      };
      targetResponses.map(response => {
        const partialResult = transform(response, options);
        result.series = [...result.series, ...partialResult.series];
        result.datapointsCnt += partialResult.datapointsCnt
      });
      return {
        data: result.series,
        error: this.generateWarningsForResult(result)
      };
    });
  }

  testDatasource() {
    const requestOptions = {
      url: this.url + '/analytics/licenses',
      method: 'GET',
    };
    return this.requestHandler.doRequest(requestOptions).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
      return { status: "error", message: "Data source is not working", title: "Error" };
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

  buildQueryParameters(options) {
    return options;
  }

  // returns DataQueryError https://github.com/grafana/grafana/blob/08bf2a54523526a7f59f7c6a8dafaace79ab87db/packages/grafana-data/src/types/datasource.ts#L400
  generateWarningsForResult(result) {
    if (result.datapointsCnt == 200) {
      return {
        cancelled: false,
        message: "Your request reached the max row limit of the API. You might see incomplete data. This problem might be caused by the use of high cardinality columns in group by, too small interval or too big of a time range.",
        status: "WARNING"
      }
    }

    return null
  }
}
