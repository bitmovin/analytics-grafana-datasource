import {
  padAndSortTimeSeries,
  transformGroupedTimeSeriesData,
  transformSimpleTimeSeries,
  transformTableData,
} from './dataUtils';
import { FieldType } from '@grafana/data';

describe('padAndSortTimeSeries', () => {
  it('should return sorted and padded data for simple time series data', () => {
    //arrange
    const data = [
      [1712919600000, 2], //Friday, 12 April 2024 11:00:00
      [1712919720000, 5], //Friday, 12 April 2024 11:02:00
    ];

    const startTimestamp = 1712919540000; //Friday, 12 April 2024 10:59:00
    const endTimestamp = 1712919780000; //Friday, 12 April 2024 11:03:00

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'MINUTE');

    //assert
    expect(result).toEqual([
      [1712919540000, 0],
      [1712919600000, 2],
      [1712919660000, 0],
      [1712919720000, 5],
      [1712919780000, 0],
    ]);
  });

  it('should return sorted and padded data for grouped time series data', () => {
    //arrange
    const data = [
      [1712919600000, 'BROWSER', 'DEVICE_TYPE', 2], //Friday, 12 April 2024 11:00:00
      [1712919720000, 'BROWSER', 'DEVICE_TYPE', 5], //Friday, 12 April 2024 11:02:00
    ];

    const startTimestamp = 1712919540000; //Friday, 12 April 2024 10:59:00
    const endTimestamp = 1712919780000; //Friday, 12 April 2024 11:03:00

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'MINUTE');

    //assert
    expect(result).toEqual([
      [1712919540000, 'BROWSER', 'DEVICE_TYPE', 0],
      [1712919600000, 'BROWSER', 'DEVICE_TYPE', 2],
      [1712919660000, 'BROWSER', 'DEVICE_TYPE', 0],
      [1712919720000, 'BROWSER', 'DEVICE_TYPE', 5],
      [1712919780000, 'BROWSER', 'DEVICE_TYPE', 0],
    ]);
  });

  it('should throw error when interval is not valid', () => {
    //arrange
    const data = [[0, 0]];

    //act && assert
    expect(() => padAndSortTimeSeries(data, 0, 0, 'INVALID INTERVAL')).toThrow(
      new Error('Query interval INVALID INTERVAL is not a valid interval.')
    );
  });

  it('should return empty array when provided data is empty', () => {
    // arrange && act
    const result = padAndSortTimeSeries([], 0, 0, 'MINUTE');

    //assert
    expect(result).toEqual([]);
  });
});

describe('transformGroupedTimeSeriesData', () => {
  it('should return correctly grouped Data Frame time series data', () => {
    //arrange
    const data = [
      [1712919540000, 'Firefox', 'Mac', 3],
      [1712919540000, 'Safari', 'Mac', 3],
      [1712919540000, 'Safari', 'iPhone', 6],
      [1712919600000, 'Safari', 'Mac', 10],
      [1712919660000, 'Firefox', 'Mac', 9],
      [1712919720000, 'Safari', 'iPhone', 10],
      [1712919780000, 'Chrome Mobile', 'iPhone', 1],
    ];

    const startTimestamp = 1712919540000; //Friday, 12 April 2024 10:59:00
    const endTimestamp = 1712919780000; //Friday, 12 April 2024 11:03:00

    //act
    const result = transformGroupedTimeSeriesData(data, startTimestamp, endTimestamp, 'MINUTE');

    //assert
    expect(result).toEqual([
      {
        name: 'Time',
        values: [1712919540000, 1712919600000, 1712919660000, 1712919720000, 1712919780000],
        type: FieldType.time,
      },
      { name: 'Firefox, Mac', values: [3, 0, 9, 0, 0], type: FieldType.number },
      { name: 'Safari, Mac', values: [3, 10, 0, 0, 0], type: FieldType.number },
      { name: 'Safari, iPhone', values: [6, 0, 0, 10, 0], type: FieldType.number },
      { name: 'Chrome Mobile, iPhone', values: [0, 0, 0, 0, 1], type: FieldType.number },
    ]);
  });

  it('should return empty array for empty dataRows', () => {
    //arrange
    const startTimestamp = 1712919540000; //Friday, 12 April 2024 10:59:00
    const endTimestamp = 1712919780000; //Friday, 12 April 2024 11:03:00

    //act
    const result = transformGroupedTimeSeriesData([], startTimestamp, endTimestamp, 'MINUTE');

    //assert
    expect(result).toEqual([]);
  });

  it('should throw error if interval is not valid', () => {
    //arrange
    const data = [
      [1712919540000, 'Firefox', 'Mac', 3],
      [1712919540000, 'Safari', 'Mac', 3],
      [1712919540000, 'Safari', 'iPhone', 6],
      [1712919600000, 'Safari', 'Mac', 10],
      [1712919660000, 'Firefox', 'Mac', 9],
      [1712919720000, 'Safari', 'iPhone', 10],
      [1712919780000, 'Chrome Mobile', 'iPhone', 1],
    ];

    const startTimestamp = 1712919540000; //Friday, 12 April 2024 10:59:00
    const endTimestamp = 1712919780000; //Friday, 12 April 2024 11:03:00

    //act && assert
    expect(() => transformGroupedTimeSeriesData(data, startTimestamp, endTimestamp, 'INVALID INTERVAL')).toThrow(
      new Error('Query interval INVALID INTERVAL is not a valid interval.')
    );
  });
});

describe('transformSimpleTimeSeries', () => {
  it('should return correct Data Frame time series data', () => {
    //arrange
    const data = [
      [1712919540000, 3],
      [1712919600000, 10],
      [1712919780000, 1],
    ];

    const startTimestamp = 1712919540000; //Friday, 12 April 2024 10:59:00
    const endTimestamp = 1712919780000; //Friday, 12 April 2024 11:03:00

    //act
    const result = transformSimpleTimeSeries(data, 'Impression Id', startTimestamp, endTimestamp, 'MINUTE');

    //assert
    expect(result).toEqual([
      {
        name: 'Time',
        values: [1712919540000, 1712919600000, 1712919660000, 1712919720000, 1712919780000],
        type: FieldType.time,
      },
      { name: 'Impression Id', values: [3, 10, 0, 0, 1], type: FieldType.number },
    ]);
  });

  it('should return empty array for empty dataRows', () => {
    //arrange
    const startTimestamp = 1712919540000; //Friday, 12 April 2024 10:59:00
    const endTimestamp = 1712919780000; //Friday, 12 April 2024 11:03:00

    //act
    const result = transformSimpleTimeSeries([], 'Impression Id', startTimestamp, endTimestamp, 'MINUTE');

    //assert
    expect(result).toEqual([]);
  });

  it('should throw error when interval is not valid', () => {
    //arrange
    const data = [
      [1712919540000, 3],
      [1712919600000, 10],
      [1712919780000, 1],
    ];

    const startTimestamp = 1712919540000; //Friday, 12 April 2024 10:59:00
    const endTimestamp = 1712919780000; //Friday, 12 April 2024 11:03:00

    //act && assert
    expect(() =>
      transformSimpleTimeSeries(data, 'Impression Id', startTimestamp, endTimestamp, 'INVALID INTERVAL')
    ).toThrow(new Error('Query interval INVALID INTERVAL is not a valid interval.'));
  });
});

describe('transformTableData', () => {
  it('should return correct Data Frame table data', () => {
    //arrange
    const data = [
      ['Firefox', 'Mac', 3],
      ['Opera', 'iPhone', 10],
      ['Chrome', 'iPhone', 1],
      ['Chrome', 'Pixel 7', 4],
    ];

    const columnLabels = [
      { key: 'BROWSER', label: 'Browser Name' },
      { key: 'DEVICE_TYPE', label: 'Device Type' },
      { key: 'IMPRESSION_ID', label: 'Impression Id' },
    ];

    //act
    const result = transformTableData(data, columnLabels);

    //assert
    expect(result).toEqual([
      {
        name: 'Browser Name',
        values: ['Firefox', 'Opera', 'Chrome', 'Chrome'],
        type: FieldType.string,
      },
      {
        name: 'Device Type',
        values: ['Mac', 'iPhone', 'iPhone', 'Pixel 7'],
        type: FieldType.string,
      },
      { name: 'Impression Id', values: [3, 10, 1, 4], type: FieldType.number },
    ]);
  });

  it('should return empty array for empty data rows', () => {
    //arrange && act

    const result = transformTableData([], []);

    //assert
    expect(result).toEqual([]);
  });

  it('should return array with auto generated labels for empty labels array', () => {
    //arrange
    const data = [
      ['Firefox', 'Mac', 3],
      ['Opera', 'iPhone', 10],
      ['Chrome', 'iPhone', 1],
      ['Chrome', 'Pixel 7', 4],
    ];

    // act
    const result = transformTableData(data, []);

    //assert
    expect(result).toEqual([
      {
        name: 'Column 1',
        values: ['Firefox', 'Opera', 'Chrome', 'Chrome'],
        type: FieldType.string,
      },
      {
        name: 'Column 2',
        values: ['Mac', 'iPhone', 'iPhone', 'Pixel 7'],
        type: FieldType.string,
      },
      { name: 'Column 3', values: [3, 10, 1, 4], type: FieldType.number },
    ]);
  });
});
