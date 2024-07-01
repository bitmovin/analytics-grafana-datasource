import { calculateQueryInterval, ceilTimestampAccordingToQueryInterval } from './intervalUtils';

describe('calculateQueryInterval', () => {
  it('should return correct given interval if interval is not AUTO', () => {
    //arrange
    const startTimestamp = 1713349080000; //Wednesday, 17 April 2024 10:18:00
    const endTimestamp = 1713356280000; //Wednesday, 17 April 2024 12:18:00
    const interval = 'MINUTE';

    // act
    const result = calculateQueryInterval(interval, startTimestamp, endTimestamp);

    //assert
    expect(result).toEqual(interval);
  });

  it('should return MINUTE interval if interval is AUTO and time interval below 3 hours', () => {
    //arrange
    const startTimestamp = 1713349080000; //Wednesday, 17 April 2024 10:18:00
    const endTimestamp = 1713356280000; //Wednesday, 17 April 2024 12:18:00

    // act
    const result = calculateQueryInterval('AUTO', startTimestamp, endTimestamp);

    //assert
    expect(result).toEqual('MINUTE');
  });

  it('should return HOUR interval if interval is AUTO and time interval bigger 3 hours and than below 6 hours', () => {
    //arrange
    const startTimestamp = 1713345420000; //Wednesday, 17 April 2024 09:17:00
    const endTimestamp = 1713356280000; //Wednesday, 17 April 2024 12:18:00

    // act
    const result = calculateQueryInterval('AUTO', startTimestamp, endTimestamp);

    //assert
    expect(result).toEqual('HOUR');
  });

  it('should return DAY interval if interval is AUTO and time interval bigger than 6 days', () => {
    //arrange
    const startTimestamp = 1712837820000; //Thursday, 11 April 2024 12:17:00
    const endTimestamp = 1713356280000; //Wednesday, 17 April 2024 12:18:00

    // act
    const result = calculateQueryInterval('AUTO', startTimestamp, endTimestamp);

    //assert
    expect(result).toEqual('DAY');
  });
});

describe('ceilTimestampAccordingToQueryInterval', () => {
  it('should return same timestamp for already rounded MINUTE interval start timestamp ', () => {
    //arrange
    const startTimestamp = 1713513900000; //Friday, 19 April 2024 08:05:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'MINUTE', 0);

    //assert
    expect(result).toEqual(startTimestamp);
  });

  it('should return ceiled timestamp for MINUTE interval and start timestamp with milliseconds != 0', () => {
    //arrange
    const startTimestamp = 1713513900100; //Friday, 19 April 2024 08:05:00.100
    const expectedTimestamp = 1713513960000; //Friday, 19 April 2024 08:06:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'MINUTE', 0);

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for MINUTE interval and start timestamp with seconds != 0', () => {
    //arrange
    const startTimestamp = 1713513912000; //Friday, 19 April 2024 08:05:12
    const expectedTimestamp = 1713513960000; //Friday, 19 April 2024 08:06:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'MINUTE', 0);

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return same timestamp for already rounded HOUR interval start timestamp ', () => {
    //arrange
    const startTimestamp = 1713513600000; //Friday, 19 April 2024 08:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'HOUR', 0);

    //assert
    expect(result).toEqual(startTimestamp);
  });

  it('should return ceiled timestamp for HOUR interval and start timestamp with milliseconds != 0', () => {
    //arrange
    const startTimestamp = 1713513600100; //Friday, 19 April 2024 08:00:00.100
    const expectedTimestamp = 1713517200000; //Friday, 19 April 2024 09:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'HOUR', 0);

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for HOUR interval and start timestamp with seconds != 0', () => {
    //arrange
    const startTimestamp = 1713513612000; //Friday, 19 April 2024 08:00:12
    const expectedTimestamp = 1713517200000; //Friday, 19 April 2024 09:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'HOUR', 0);

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for HOUR interval and start timestamp with minutes != 0', () => {
    //arrange
    const startTimestamp = 1713514320000; //Friday, 19 April 2024 08:12:00
    const expectedTimestamp = 1713517200000; //Friday, 19 April 2024 09:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'HOUR', 0);

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return correct timestamp with DAY interval and start timestamp before data timestamp', () => {
    //arrange
    const startTimestamp = 1713514320000; //Friday, 19 April 2024 08:12:00
    const dataTimestamp = 1713954600000; //Wednesday, 24 April 2024 10:30:00
    const expectedTimestamp = 1713522600000; //Friday, 19 April 2024 10:30:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'DAY', dataTimestamp);

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp with DAY interval and start timestamp after data timestamp', () => {
    //arrange
    const startTimestamp = 1713522184000; //Friday, 19 April 2024 10:23:04
    const dataTimestamp = 1713517200000; //Friday, 19 April 2024 09:00:00
    const expectedTimestamp = 1713603600000; //Saturday, 20 April 2024 09:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(startTimestamp, 'DAY', dataTimestamp);

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp with DAY interval and start timestamp after data timestamp and start timestamp being last day of a month', () => {
    //arrange
    const timestamp = 1714474760000; //Tuesday, 30 April 2024 10:59:20
    const dataTimestamp = 1714467600000; //Tuesday, 30 April 2024 09:00:00
    const expectedTimestamp = 1714554000000; //Wednesday, 1 May 2024 09:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'DAY', dataTimestamp);

    //assert
    expect(result).toEqual(expectedTimestamp);
  });
});
