import {ResultFormat} from './types/resultFormat';

const transformDataToTable = (analyticsResult, options) => {
  let datapoints = _.map(analyticsResult.rows, row => {
    return [row[1], row[0]]; // value, timestamp
  });

  return {
    target: options.resultTarget,
    datapoints: datapoints
  }
}

const transformDataToTimeSeries = (analyticsResult, options) => {
  const groupBys = options.data.groupBy;
  const results = [];
  if (groupBys.length > 0) {
    let groupings = {};
    _.map(analyticsResult.rows, row => {
      const metricLabel = row[1];
      if (!groupings[metricLabel]) {
        groupings[metricLabel] = [];
      }
      groupings[metricLabel].push([row[2], row[0]]); // value, timestamp
    });
    Object.keys(groupings).map(key => {
      const datapoints = groupings[key];
      const series = {
        target: key,
        datapoints: _.orderBy(datapoints, [1], 'asc')
      }
      results.push(series);
    });
  } else {
    let result =  transformDataToTable(analyticsResult, options);
    result.datapoints = _.orderBy(result.datapoints, [1], 'asc');
    results.push(result);
  }
  return results;
}

export const transform = (response, options) => {
  const analyticsResult = response.data.data.result;
  const config = response.config;
  if (config.resultFormat === ResultFormat.TABLE) {
    return [transformDataToTable(analyticsResult, config)];
  } else if (config.resultFormat === ResultFormat.TIME_SERIES) {
    return transformDataToTimeSeries(analyticsResult, config);
  }
}
