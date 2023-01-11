import {intervalToMilliseconds} from './intervalUtils';

const fillDataRow = (series: Array<[timestamp: any, value: number]>, timestamp: any, value: number) => {
    const dataRow = series.find(i => i[0] === timestamp);
    if (dataRow == null) {
        series.push([timestamp, value]);
    }
}

/**
 * Add padding to the series where no data is available for given interval.
 * @param {Array<[timestamp: any, value: number]>} series Series that should be null-padded
 * @param {number} fromDate Start date of query as unix timestamp
 * @param {number} toDate End date of query as unix timestamp
 * @param {String} interval The interval used for the query, e.g. SECOND, MINUTE, HOUR, ...
 * @param {number} padWith The value that is used for padding, defaults to null
 */
export const padTimeSeriesAndSortByDate = (series: Array<[timestamp: any, value: number]>, fromDate: number, toDate: number, interval: string, padWith: number = null): Array<[timestamp: any, value: number]> => {
    const intervalInMillis = intervalToMilliseconds(interval);
    if (series == null || series.length === 0 || intervalInMillis < 0) {
        return series;
    }

    const timestampIndex = 0;
    const referenceDate = series[0][timestampIndex];
    for (let timestamp = referenceDate; timestamp < toDate; timestamp += intervalInMillis) {
        fillDataRow(series, timestamp, padWith);
    }
    for (let timestamp = referenceDate - intervalInMillis; timestamp >= fromDate; timestamp -= intervalInMillis) {
        fillDataRow(series, timestamp, padWith);
    }
    return series;
}