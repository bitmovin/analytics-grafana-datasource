import {
  calculateTimeSeriesStartTimestamp,
  padAndSortTimeSeries,
  transformGroupedTimeSeriesData,
  transformSimpleTimeSeries,
  transformTableData,
} from './dataUtils';
import { FieldType } from '@grafana/data';

describe('calculateTimeSeriesStartTimestamp', () => {
  it('should return correct timestamp for MINUTE interval', () => {
    //arrange
    const referenceDataTimestamp = 1720598700000; // Wednesday, 10 July 2024 08:05:00
    const intervalStartTimestamp = 1720598508400; // Wednesday, 10 July 2024 08:01:48.400

    //act
    const result = calculateTimeSeriesStartTimestamp(referenceDataTimestamp, intervalStartTimestamp, 'MINUTE');

    //assert
    expect(result).toEqual(1720598460000); //Wednesday, 10 July 2024 08:01:00
  });

  it('should return correct timestamp for HOUR interval', () => {
    //arrange
    const referenceDataTimestamp = 1720600200000; // Wednesday, 10 July 2024 08:30:00
    const intervalStartTimestamp = 1720591381300; // Wednesday, 10 July 2024 06:03:01.300

    //act
    const result = calculateTimeSeriesStartTimestamp(referenceDataTimestamp, intervalStartTimestamp, 'HOUR');

    //assert
    expect(result).toEqual(1720593000000); // Wednesday, 10 July 2024 06:00:00
  });

  it('should return correct timestamp for DAY interval', () => {
    //arrange
    const referenceDataTimestamp = 1720650600000; // Wednesday, 10 July 2024 22:30:00
    const intervalStartTimestamp = 1720442041020; // Monday, 8 July 2024 12:34:01.020

    //act
    const result = calculateTimeSeriesStartTimestamp(referenceDataTimestamp, intervalStartTimestamp, 'DAY');

    //assert
    expect(result).toEqual(1720477800000); // Monday, 8 July 2024 22:30:00
  });

  it('should return correct timestamp for MONTH interval with dataTimestamp being the first day of a month', () => {
    //arrange
    const referenceDataTimestamp = 1719873000000; // Monday, 1 July 2024 22:30:00
    const intervalStartTimestamp = 1714915205040; // Sunday, 5 May 2024 13:20:05.040

    //act
    const result = calculateTimeSeriesStartTimestamp(referenceDataTimestamp, intervalStartTimestamp, 'MONTH');

    //assert
    expect(result).toEqual(1714602600000); //  Wednesday, 1 May 2024 22:30:00
  });

  it('should return correct timestamp for MONTH interval with dataTimestamp being the last day of a month', () => {
    //arrange
    const referenceDataTimestamp = 1719786600000; // Sunday, 30 June 2024 22:30:00
    const intervalStartTimestamp = 1711374785001; // Monday, 25 March 2024 13:53:05.001

    //act
    const result = calculateTimeSeriesStartTimestamp(referenceDataTimestamp, intervalStartTimestamp, 'MONTH');

    //assert
    expect(result).toEqual(1709245800000); // Thursday, 29 February 2024 22:30:00
  });
});

describe('padAndSortTimeSeries', () => {
  it('should return sorted and padded data for simple time series data for MINUTE interval', () => {
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
      [1712919540000, 0], //Friday, 12 April 2024 10:59:00
      data[0],
      [1712919660000, 0], //Friday, 12 April 2024 11:01:00
      data[1],
      [1712919780000, 0], //Friday, 12 April 2024 11:03:00
    ]);
  });

  it('should return sorted and padded data for simple time series data for HOUR Interval', () => {
    //arrange
    const data = [
      [1712919600000, 7], //Friday, 12 April 2024 11:00:00
      [1712930400000, 5], //Friday, 12 April 2024 14:00:00
      [1712934000000, 2], //Friday, 12 April 2024 15:00:00
    ];

    const startTimestamp = 1712916000000; //Friday, 12 April 2024 10:00:00
    const endTimestamp = 1712935444000; //Friday, 12 April 2024 15:24:04

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'HOUR');

    //assert
    expect(result).toEqual([
      [1712916000000, 0], //Friday, 12 April 2024 10:00:00
      data[0],
      [1712923200000, 0], //Friday, 12 April 2024 12:00:00
      [1712926800000, 0], //Friday, 12 April 2024 13:00:00
      data[1],
      data[2],
    ]);
  });

  it('should return sorted and padded data for simple time series data for DAY interval', () => {
    //arrange
    const data = [
      [1713004200000, 2], //Saturday, 13 April 2024 10:30:00
      [1713263400000, 5], //Tuesday, 16 April 2024 10:30:00
    ];

    const startTimestamp = 1712917800000; //Friday, 12 April 2024 10:30:00
    const endTimestamp = 1713351560000; //Wednesday, 17 April 2024 10:59:20

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'DAY');

    //assert
    expect(result).toEqual([
      [1712917800000, 0], //Friday, 12 April 2024 10:30:00
      data[0],
      [1713090600000, 0], //Sunday, 14 April 2024 10:30:00
      [1713177000000, 0], //Monday, 15 April 2024 10:30:00
      data[1],
      [1713349800000, 0], //Wednesday, 17 April 2024 10:30:00
    ]);
  });

  it('should return sorted and padded data for simple time series data for MONTH interval with start Day being the last of a month', () => {
    //arrange
    const data = [
      [1706740200000, 1], //Wednesday, 31 January 2024 22:30:00
      [1711924200000, 2], //Sunday, 31 March 2024 22:30:00
      [1714516200000, 5], //Tuesday, 30 April 2024 22:30:00
    ];

    const startTimestamp = 1706740200000; //Wednesday, 31 January 2024 22:30:00
    const endTimestamp = 1718454244000; //Saturday, 15 June 2024 12:24:04

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'MONTH');

    //assert
    expect(result).toEqual([
      data[0],
      [1709245800000, 0], //Thursday, 29 February 2024 22:30:00
      data[1],
      data[2],
      [1717194600000, 0], // Friday, 31 May 2024 22:30:00
    ]);
  });

  it('should return sorted and padded data for simple time series data for MONTH interval with start Day being the first of a month', () => {
    //arrange
    const data = [
      [1712010600000, 2], //Monday, 1 April 2024 22:30:00
      [1714602600000, 5], //Wednesday, 1 May 2024 22:30:00
    ];

    const startTimestamp = 1706826600000; //Thursday, 1 February 2024 22:30:00
    const endTimestamp = 1718454244000; //Saturday, 15 June 2024 12:24:04

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'MONTH');

    //assert
    expect(result).toEqual([
      [1706826600000, 0], //Thursday, 1 February 2024 22:30:00
      [1709332200000, 0], //Friday, 1 March 2024 22:30:00
      data[0],
      data[1],
      [1717281000000, 0], //Saturday, 1 June 2024 22:30:00
    ]);
  });

  it('should return sorted and padded data for grouped time series data for MINUTE interval', () => {
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
      [1712919540000, 'BROWSER', 'DEVICE_TYPE', 0], //Friday, 12 April 2024 10:59:00
      data[0],
      [1712919660000, 'BROWSER', 'DEVICE_TYPE', 0], //Friday, 12 April 2024 11:01:00
      data[1],
      [1712919780000, 'BROWSER', 'DEVICE_TYPE', 0], //Friday, 12 April 2024 11:03:00
    ]);
  });

  it('should return sorted and padded data for grouped time series data for HOUR interval', () => {
    //arrange
    const data = [
      [1712919600000, 'BROWSER', 'DEVICE_TYPE', 7], //Friday, 12 April 2024 11:00:00
      [1712930400000, 'BROWSER', 'DEVICE_TYPE', 5], //Friday, 12 April 2024 14:00:00
      [1712934000000, 'BROWSER', 'DEVICE_TYPE', 2], //Friday, 12 April 2024 15:00:00
    ];

    const startTimestamp = 1712916000000; //Friday, 12 April 2024 10:00:00
    const endTimestamp = 1712935444000; //Friday, 12 April 2024 15:24:04

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'HOUR');

    //assert
    expect(result).toEqual([
      [1712916000000, 'BROWSER', 'DEVICE_TYPE', 0], //Friday, 12 April 2024 10:00:00
      data[0],
      [1712923200000, 'BROWSER', 'DEVICE_TYPE', 0], //Friday, 12 April 2024 12:00:00
      [1712926800000, 'BROWSER', 'DEVICE_TYPE', 0], //Friday, 12 April 2024 13:00:00
      data[1],
      data[2],
    ]);
  });

  it('should return sorted and padded data for grouped time series data for DAY interval', () => {
    //arrange
    const data = [
      [1713004200000, 'BROWSER', 'DEVICE_TYPE', 2], //Saturday, 13 April 2024 10:30:00
      [1713263400000, 'BROWSER', 'DEVICE_TYPE', 5], //Tuesday, 16 April 2024 10:30:00
    ];

    const startTimestamp = 1712917800000; //Friday, 12 April 2024 10:30:00
    const endTimestamp = 1713351560000; //Wednesday, 17 April 2024 10:59:20

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'DAY');

    //assert
    expect(result).toEqual([
      [1712917800000, 'BROWSER', 'DEVICE_TYPE', 0], //Friday, 12 April 2024 10:30:00
      data[0],
      [1713090600000, 'BROWSER', 'DEVICE_TYPE', 0], //Sunday, 14 April 2024 10:30:00
      [1713177000000, 'BROWSER', 'DEVICE_TYPE', 0], //Monday, 15 April 2024 10:30:00
      data[1],
      [1713349800000, 'BROWSER', 'DEVICE_TYPE', 0], //Wednesday, 17 April 2024 10:30:00
    ]);
  });

  it('should return sorted and padded data for grouped time series data for MONTH interval with start Day being the last of a month', () => {
    //arrange
    const data = [
      [1706740200000, 'BROWSER', 'DEVICE_TYPE', 1], //Wednesday, 31 January 2024 22:30:00
      [1711924200000, 'BROWSER', 'DEVICE_TYPE', 2], //Sunday, 31 March 2024 22:30:00
      [1714516200000, 'BROWSER', 'DEVICE_TYPE', 5], //Tuesday, 30 April 2024 22:30:00
    ];

    const startTimestamp = 1706740200000; //Wednesday, 31 January 2024 22:30:00
    const endTimestamp = 1718454244000; //Saturday, 15 June 2024 12:24:04

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'MONTH');

    //assert
    expect(result).toEqual([
      data[0],
      [1709245800000, 'BROWSER', 'DEVICE_TYPE', 0], //Thursday, 29 February 2024 22:30:00
      data[1],
      data[2],
      [1717194600000, 'BROWSER', 'DEVICE_TYPE', 0], // Friday, 31 May 2024 22:30:00
    ]);
  });

  it('should return sorted and padded data for grouped time series data for MONTH interval with start Day being the first of a month', () => {
    //arrange
    const data = [
      [1712010600000, 'BROWSER', 'DEVICE_TYPE', 2], //Monday, 1 April 2024 22:30:00
      [1714602600000, 'BROWSER', 'DEVICE_TYPE', 5], //Wednesday, 1 May 2024 22:30:00
    ];

    const startTimestamp = 1706826600000; //Thursday, 1 February 2024 22:30:00
    const endTimestamp = 1718454244000; //Saturday, 15 June 2024 12:24:04

    //act
    const result = padAndSortTimeSeries(data, startTimestamp, endTimestamp, 'MONTH');

    //assert
    expect(result).toEqual([
      [1706826600000, 'BROWSER', 'DEVICE_TYPE', 0], //Thursday, 1 February 2024 22:30:00
      [1709332200000, 'BROWSER', 'DEVICE_TYPE', 0], //Friday, 1 March 2024 22:30:00
      data[0],
      data[1],
      [1717281000000, 'BROWSER', 'DEVICE_TYPE', 0], //Saturday, 1 June 2024 22:30:00
    ]);
  });

  it('should throw error when interval is not valid', () => {
    //arrange
    const data = [[0, 0]];

    //act && assert
    // @ts-ignore
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
    // @ts-ignore
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
    // @ts-ignore
    expect(() =>
      // @ts-ignore
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
