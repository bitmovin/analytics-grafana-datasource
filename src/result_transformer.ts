import {ResultFormat} from './types/resultFormat';
import {padTimeSeriesAndSortByDate} from './utils/dataUtils';

const transformDataToTable = (rows, options) => {
  let datapoints = rows.map(row => {
    const timestamp = row[0];
    const value = row[1];
    return [value, timestamp];
  });

  return {
    target: options.resultTarget,
    datapoints: datapoints
  }
}

const transformDataToTimeSeries = (analyticsResult, options) => {
  const groupBys = options.data.groupBy;
  const series = [];
  let datapointsCnt = 0;

  const interval = options.data.interval;
  const fromDate = new Date(options.data.start).getTime();
  const toDate = new Date(options.data.end).getTime();
  if (groupBys.length > 0) {
    let groupings: {
      [id: string]: [Array<number>];
    } = {};
    analyticsResult.rows.map(row => {
      const metricLabel = row[1];
      if (!groupings[metricLabel]) {
        groupings[metricLabel] = [[]];
      }
      const value = row[2];
      const timestamp = row[0];
      groupings[metricLabel].push([value, timestamp]);
      datapointsCnt++;
    });
    for (let key of Object.keys(groupings)) {
      const datapoints = groupings[key];
      const groupData = {
        target: key,
        datapoints: sortDatapointsByTime(datapoints)
      }
      series.push(groupData);
    }
  } else {
    const paddedSeries = padTimeSeriesAndSortByDate(analyticsResult.rows, fromDate, toDate, interval);
    let result =  transformDataToTable(paddedSeries, options);
    result.datapoints = sortDatapointsByTime(result.datapoints)
    series.push(result);
    datapointsCnt = result.datapoints.length
  }
  return {
    series,
    datapointsCnt
  };
}

const sortDatapointsByTime = (datapoints: [Array<number>]): [Array<number>] => {
  return datapoints.sort((a, b) => {return a[1] - b[1]})
}

export const transform = (response, options) => {
  const analyticsResult = response.data.data.result;
  const config = response.config;
  if (config.resultFormat === ResultFormat.TABLE) {
    const tableData = transformDataToTable(analyticsResult.rows, config)
    return {
      series: [tableData],
      datapointsCnt: tableData.datapoints.length
    };
  } else if (config.resultFormat === ResultFormat.TIME_SERIES) {
    return transformDataToTimeSeries(analyticsResult, config);
  }
}
