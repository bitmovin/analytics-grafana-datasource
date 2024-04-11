import { differenceWith, sortBy, zip } from 'lodash';
import { intervalToMilliseconds } from './intervalUtils';
import { Field, FieldType } from '@grafana/data';

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

  let dataRows: (string | number)[] = [0];
  const zeroValueTimeSeries: Array<Array<string | number>> = [];

  // Preserve groupBys in the data if present
  if (data[0].length > 2) {
    dataRows = [...data[0].slice(1, -1), 0];
  }

  // Create zero value time series data for the entire interval
  for (let timestamp = startTimestamp; timestamp <= endTimestamp; timestamp += intervalInMs) {
    const row = [timestamp, ...dataRows];
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

/**
 * Transforms grouped time series data into the Data Frame format.
 *
 * @param {Array<Array<string | number>>} dataRows The grouped time series data to be transformed.
 * @param {number} startTimestamp The start timestamp for the time series data.
 * @param {number} endTimestamp The end timestamp for the time series data.
 * @param {string} interval The interval used for the time series data.
 * @returns {Array<Partial<Field>>} The transformed time series data.
 */
export function transformGroupedTimeSeriesData(
  dataRows: Array<Array<string | number>>,
  startTimestamp: number,
  endTimestamp: number,
  interval: string
): Array<Partial<Field>> {
  const fields: Array<Partial<Field>> = [];

  // Group the data by the groupBy values to display multiple time series in one graph
  const groupedTimeSeriesMap = new Map<string, Array<Array<string | number>>>();
  dataRows.forEach((row) => {
    const groupKey = row.slice(1, -1).toString();
    if (!groupedTimeSeriesMap.has(groupKey)) {
      groupedTimeSeriesMap.set(groupKey, []);
    }
    groupedTimeSeriesMap.get(groupKey)?.push(row as []);
  });

  // Pad grouped data as there can only be one time field for a graph with multiple time series
  const paddedTimeSeries: Array<Array<Array<string | number>>> = [];
  groupedTimeSeriesMap.forEach((data) => {
    paddedTimeSeries.push(padAndSortTimeSeries(data, startTimestamp, endTimestamp, interval!));
  });

  // Extract and save timestamps from the first group data
  const transposedFirstGroupData = zip(...paddedTimeSeries[0]);
  const timestamps = transposedFirstGroupData[0];
  fields.push({ name: 'Time', values: timestamps, type: FieldType.time });

  // Extract and save the values for every grouped time series
  paddedTimeSeries.forEach((data) => {
    // Field name consisting of the groupBy values of the current time series
    const name = data[0].slice(1, -1).join(', ');

    //extract values
    const columns = zip(...data);
    const valueColumn = columns.slice(-1);

    fields.push({
      name: name,
      values: valueColumn[0] as number[],
      type: FieldType.number,
    });
  });

  return fields;
}
