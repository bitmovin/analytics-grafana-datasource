import { differenceWith, sortBy, zip } from 'lodash';
import { intervalToMilliseconds, QueryInterval } from './intervalUtils';
import { Field, FieldType } from '@grafana/data';
import { MixedDataRow, MixedDataRowList, NumberDataRow, NumberDataRowList } from '../types';

/**
 * Adds padding to a given time series to fill in any missing timestamps for a given interval.
 *
 * @param {MixedDataRowList} data The time series data to be padded. Each data row must have the following structure: [timestamp: number, groupBy1?: string, ... , groupByN?: string, value: number] where each row has the same groupByValue. If the groupByValues differ from row to row, only the groupByValues of the first row are considered.
 * @param {number} startTimestamp The start timestamp in milliseconds for the padding interval.
 * @param {number} endTimestamp The end timestamp in milliseconds for the padding interval.
 * @param {String} interval The interval used for the query, e.g. MINUTE, HOUR, ... .
 * @returns {MixedDataRowList} The padded and sorted time series data.
 */
export function padAndSortTimeSeries(
  data: MixedDataRowList,
  startTimestamp: number,
  endTimestamp: number,
  interval: QueryInterval
): MixedDataRowList {
  if (data.length === 0) {
    return [];
  }

  const intervalInMs = intervalToMilliseconds(interval);
  if (intervalInMs < 0) {
    throw new Error(`Query interval ${interval} is not a valid interval.`);
  }

  let dataRows: MixedDataRow = [0];
  const zeroValueTimeSeries: MixedDataRowList = [];

  // Preserve groupBys in the data if present
  if (data[0].length > 2) {
    dataRows = [...data[0].slice(1, -1), 0];
  }

  //TODOMY fix rounding of end and start timestamp, starttimestamp does not begin with the full hour always, so the increment from the first timestamp to the seconds needs to be to the next full hour or full day, what to do with days? whats the hour there?

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
 * @param {MixedDataRowList} dataRows The grouped time series data to be transformed. Each data row must have the following structure: [timestamp: number, groupBy1: string, groupBy2: string, ... ,groupByN: string, value: number]
 * @param {number} startTimestamp The start timestamp in milliseconds for the time series data.
 * @param {number} endTimestamp The end timestamp in milliseconds for the time series data.
 * @param {string} interval The interval used for the time series data.
 * @returns {Array<Partial<Field>>} The transformed time series data.
 */
export function transformGroupedTimeSeriesData(
  dataRows: MixedDataRowList,
  startTimestamp: number,
  endTimestamp: number,
  interval: QueryInterval
): Array<Partial<Field>> {
  if (dataRows.length === 0) {
    return [];
  }

  const fields: Array<Partial<Field>> = [];

  // Group the data by the groupBy values to display multiple time series in one graph
  const groupedTimeSeriesMap = new Map<string, MixedDataRowList>();
  dataRows.forEach((row) => {
    const groupKey = row.slice(1, -1).toString();
    if (!groupedTimeSeriesMap.has(groupKey)) {
      groupedTimeSeriesMap.set(groupKey, []);
    }
    groupedTimeSeriesMap.get(groupKey)?.push(row as []);
  });

  // Pad grouped data as there can only be one time field for a graph with multiple time series
  const paddedTimeSeries: MixedDataRowList[] = [];
  groupedTimeSeriesMap.forEach((data) => {
    paddedTimeSeries.push(padAndSortTimeSeries(data, startTimestamp, endTimestamp, interval));
  });

  // Extract and save timestamps from the first group data
  const transposedFirstGroupTimeSeriesData = zip(...paddedTimeSeries[0]);
  const timestamps = transposedFirstGroupTimeSeriesData[0];
  fields.push({ name: 'Time', values: timestamps as NumberDataRow, type: FieldType.time });

  // Extract time series values per group
  paddedTimeSeries.forEach((data) => {
    // Field name consisting of the groupBy values of the current time series
    const name = data[0].slice(1, -1).join(', ');

    //extract values
    const columns = zip(...data);
    const valueColumn = columns.slice(-1);

    fields.push({
      name: name,
      values: valueColumn[0] as NumberDataRow,
      type: FieldType.number,
    });
  });

  return fields;
}

/**
 * Transforms simple time series data into the Data Frame format.
 *
 * @param {NumberDataRowList} dataRows The time series data to be transformed. Each data row must have the following structure: [timestamp: number, value: number]
 * @param {string} columnName The name for the value column in the time series data.
 * @param {number} startTimestamp The start timestamp in milliseconds for the time series data.
 * @param {number} endTimestamp The end timestamp in milliseconds for the time series data.
 * @param {string} interval The interval used for the time series data.
 * @returns {Array<Partial<Field>>} The transformed time series data.
 */
export function transformSimpleTimeSeries(
  dataRows: NumberDataRowList,
  columnName: string,
  startTimestamp: number,
  endTimestamp: number,
  interval: QueryInterval
): Array<Partial<Field>> {
  if (dataRows.length === 0) {
    return [];
  }

  const fields: Array<Partial<Field>> = [];
  const paddedData = padAndSortTimeSeries(dataRows, startTimestamp, endTimestamp, interval);
  const columns = zip(...paddedData);

  fields.push({ name: 'Time', values: columns[0] as NumberDataRow, type: FieldType.time });
  fields.push({
    name: columnName,
    values: columns[columns.length - 1] as NumberDataRow,
    type: FieldType.number,
  });

  return fields;
}

/**
 * Transforms table data into the Data Frame format.
 *
 * @param {MixedDataRowList} dataRows The table data to be transformed. Each data row must have the following structure: [groupBy1: string, groupBy2: string, ... , groupByN: string, value: number]
 * @param {Array<{ key: string; label: string }>} columnLabels The labels for each column in the table data.
 * @returns {Array<Partial<Field>>} The transformed table data.
 */
export function transformTableData(
  dataRows: MixedDataRowList,
  columnLabels: Array<{ key: string; label: string }>
): Array<Partial<Field>> {
  if (dataRows.length === 0) {
    return [];
  }

  const fields: Array<Partial<Field>> = [];
  const columns = zip(...dataRows);

  let columnNames: string[] = [];
  if (columnLabels.length === 0) {
    for (let i = 0; i < columns.length; i++) {
      columnNames.push(`Column ${i + 1}`);
    }
  } else {
    columnNames.push(...columnLabels.map((label) => label.label));
  }

  const containsGroupByValues = dataRows[0].length > 1;
  if (containsGroupByValues) {
    const groupByColumns = columns.slice(0, -1);

    groupByColumns.forEach((column, index) => {
      fields.push({
        name: columnNames[index],
        values: column as string[],
        type: FieldType.string,
      });
    });
  }

  // Add the last column as a number field
  fields.push({
    name: columnNames[columnNames.length - 1],
    values: columns[columns.length - 1] as NumberDataRow,
    type: FieldType.number,
  });

  return fields;
}
