import {ResultFormat} from './types/resultFormat';
import {padTimeSeriesAndSortByDate} from './utils';

const transformDataToTable = (rows, options) => {
  let datapoints = _.map(rows, row => {
    const timestmap = row[0];
    const value = row[1];
    return [value, timestmap];
  });

  return {
    target: options.resultTarget,
    datapoints: datapoints
  }
}

const transformDataToTimeSeries = (analyticsResult, options) => {
  const groupBys = options.data.groupBy;
  const results = [];

  const interval = options.data.interval;
  const fromDate = new Date(options.data.start).getTime();
  const toDate = new Date(options.data.end).getTime();
  if (groupBys.length > 0) {
    let groupings = {};
    _.map(analyticsResult.rows, row => {
      const metricLabel = row[1];
      if (!groupings[metricLabel]) {
        groupings[metricLabel] = [];
      }
      const value = row[2];
      const timestamp = row[0];
      groupings[metricLabel].push([value, timestamp]);
    });
    for (let key of Object.keys(groupings)) {
      const datapoints = groupings[key];
      const series = {
        target: key,
        datapoints: _.orderBy(datapoints, [1], 'asc')
      }
      results.push(series);
    }
  } else {
    const paddedSeries = padTimeSeriesAndSortByDate(analyticsResult.rows, fromDate, toDate, interval);
    let result =  transformDataToTable(paddedSeries, options);
    result.datapoints = _.orderBy(result.datapoints, [1], 'asc');
    results.push(result);
  }
  return results;
}

export const transform = (response, options) => {
  const analyticsResult = response.data.data.result;
  const config = response.config;
  if (config.resultFormat === ResultFormat.TABLE) {
    return [transformDataToTable(analyticsResult.rows, config)];
  } else if (config.resultFormat === ResultFormat.TIME_SERIES) {
    return transformDataToTimeSeries(analyticsResult, config);
  }
}
