import { differenceWith, sortBy } from 'lodash';
import { intervalToMilliseconds } from './intervalUtils';

/**
 * Adds padding to a given time series to fill in any missing timestamps for a given interval.
 * @param {Array<Array<string | number>>} data The time series data to be padded.
 * @param {number} startTimestamp The start timestamp for the padding interval.
 * @param {number} endTimestamp The end timestamp for the padding interval.
 * @param {String} interval The interval used for the query, e.g. SECOND, MINUTE, HOUR, ... .
 * @returns {Array<Array<string | number>>} The padded and sorted time series data.
 */
export function padAndSortTimeSeries(
  data: Array<Array<string | number>>,
  startTimestamp: number,
  endTimestamp: number,
  interval: string
): Array<Array<string | number>> {
  //TODOMY error handling for when this method returns -1 and the data is empty
  const intervalInMs = intervalToMilliseconds(interval);

  let rowData: (string | number)[] = [0];
  const zeroValueTimeSeries: Array<Array<string | number>> = [];

  // Preserve groupBys in the data if present
  if (data[0].length > 2) {
    rowData = [...data[0].slice(1, data[0].length - 1), 0];
  }

  // Create zero value time series data for the entire interval
  for (let timestamp = startTimestamp; timestamp <= endTimestamp; timestamp += intervalInMs) {
    const row = [timestamp, ...rowData];
    zeroValueTimeSeries.push(row);
  }

  // Find the missing time series data
  const missingTimestampRows = differenceWith(zeroValueTimeSeries, data, (first, second) => first[0] === second[0]);

  // Pad data with the zero value data
  const paddedData = data.concat(missingTimestampRows);

  // Sort data by timestamp
  const sortedData = sortBy(paddedData, (row) => row[0]);

  return sortedData;
}
