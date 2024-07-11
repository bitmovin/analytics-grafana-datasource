import { differenceWith, sortBy, zip } from 'lodash';
import { getMomentTimeUnitForQueryInterval, QueryInterval } from './intervalUtils';
import { Field, FieldType } from '@grafana/data';
// eslint-disable-next-line  no-restricted-imports
import moment from 'moment';
import type { DurationInputArg2 } from 'moment/moment';

export type MixedDataRow = Array<string | number>;
export type MixedDataRowList = MixedDataRow[];

export type NumberDataRow = number[];
export type NumberDataRowList = NumberDataRow[];

/**
 * Calculates the start timestamp for a time series based on a given interval,
 * the start timestamp of the interval and a reference data point timestamp.
 *
 * @param {number} dataTimestamp - The timestamp of a reference data point, from which to take the correct min, hour and date (in milliseconds).
 * @param {number} intervalStartTimestamp - The start timestamp of the interval (in milliseconds).
 * @param {QueryInterval} interval - The interval used for the query, e.g. MINUTE, HOUR, ... .
 * @returns {number} - The calculated start timestamp for the time series (in milliseconds).
 */
export function calculateTimeSeriesStartTimestamp(
  dataTimestamp: number,
  intervalStartTimestamp: number,
  interval: QueryInterval
): number {
  const referenceDataDate = new Date(dataTimestamp);
  const intervalStartDate = new Date(intervalStartTimestamp);

  switch (interval) {
    case 'MINUTE':
      return intervalStartDate.setSeconds(0, 0);
    case 'HOUR':
      return intervalStartDate.setMinutes(0, 0, 0);
    case 'DAY':
      return intervalStartDate.setHours(referenceDataDate.getHours(), referenceDataDate.getMinutes(), 0, 0);
    case 'MONTH':
      referenceDataDate.getDate() === 1
        ? intervalStartDate.setDate(referenceDataDate.getDate())
        : intervalStartDate.setDate(0); // sets the date to the last day of the previous month
      return intervalStartDate.setHours(referenceDataDate.getHours(), referenceDataDate.getMinutes(), 0, 0);
  }
}

/**
 * Adds padding to a given time series to fill in any missing timestamps for a given interval.
 *
 * @param {MixedDataRowList} data The time series data to be padded. Each data row must have the following structure: [timestamp: number, groupBy1?: string, ... , groupByN?: string, value: number] where each row has the same groupByValue. If the groupByValues differ from row to row, only the groupByValues of the first row are considered.
 * @param {number} startTimestamp The start timestamp in milliseconds for the padding interval.
 * @param {number} endTimestamp The end timestamp in milliseconds for the padding interval.
 * @param {QueryInterval} interval The interval used for the query, e.g. MINUTE, HOUR, ... .
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

  const momentInterval = getMomentTimeUnitForQueryInterval(interval);
  if (momentInterval == null) {
    throw new Error(`Query interval ${interval} is not a valid interval.`);
  }

  const zeroValueTimeSeries: MixedDataRowList = [];
  // Create zero value data for padding and preserve groupBys in the data if present
  const zeroValueDataRow = data[0].length > 2 ? [...data[0].slice(1, -1), 0] : [0];

  let momentStartTimestamp = moment(startTimestamp);

  // Create zero value time series data for the entire interval
  while (momentStartTimestamp.valueOf() <= endTimestamp) {
    const row = [momentStartTimestamp.valueOf(), ...zeroValueDataRow];
    zeroValueTimeSeries.push(row);

    // Move the timestamp forward by one interval unit
    momentStartTimestamp.add(1, momentInterval as DurationInputArg2);

    // Handle the special case for monthly intervals with last day of the month data timestamps
    // This code ensures that intervals starting at the end of a month correctly transition to the
    // last day of the next month. E.g. adding one month to 30th April with moment results in 30th May,
    // but the last day of the month, i.e., 31st May is the correct value.
    if (interval === 'MONTH' && momentStartTimestamp.date() !== 1) {
      momentStartTimestamp.set('date', momentStartTimestamp.daysInMonth());
    }
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
 * @param {QueryInterval} interval The interval used for the time series data.
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
    paddedTimeSeries.push(
      padAndSortTimeSeries(
        data,
        calculateTimeSeriesStartTimestamp(data[0][0] as number, startTimestamp, interval),
        endTimestamp,
        interval
      )
    );
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
 * @param {QueryInterval} interval The interval used for the time series data.
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
  const paddedData = padAndSortTimeSeries(
    dataRows,
    calculateTimeSeriesStartTimestamp(dataRows[0][0], startTimestamp, interval),
    endTimestamp,
    interval
  );
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
