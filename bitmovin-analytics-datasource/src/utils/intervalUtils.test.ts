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
  it('should return same timestamp for already rounded MINUTE interval timestamp ', () => {
    //arrange
    const timestamp = 1713513900000; //Friday, 19 April 2024 08:05:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'MINUTE');

    //assert
    expect(result).toEqual(timestamp);
  });

  it('should return ceiled timestamp for MINUTE interval timestamp with milliseconds != 0', () => {
    //arrange
    const timestamp = 1713513900100; //Friday, 19 April 2024 08:05:00.100
    const expectedTimestamp = 1713513960000; //Friday, 19 April 2024 08:06:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'MINUTE');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for MINUTE interval timestamp with seconds != 0', () => {
    //arrange
    const timestamp = 1713513912000; //Friday, 19 April 2024 08:05:12
    const expectedTimestamp = 1713513960000; //Friday, 19 April 2024 08:06:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'MINUTE');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return same timestamp for already rounded HOUR interval timestamp ', () => {
    //arrange
    const timestamp = 1713513600000; //Friday, 19 April 2024 08:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'HOUR');

    //assert
    expect(result).toEqual(timestamp);
  });

  it('should return ceiled timestamp for HOUR interval timestamp with milliseconds != 0', () => {
    //arrange
    const timestamp = 1713513600100; //Friday, 19 April 2024 08:00:00.100
    const expectedTimestamp = 1713517200000; //Friday, 19 April 2024 09:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'HOUR');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for HOUR interval timestamp with seconds != 0', () => {
    //arrange
    const timestamp = 1713513612000; //Friday, 19 April 2024 08:00:12
    const expectedTimestamp = 1713517200000; //Friday, 19 April 2024 09:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'HOUR');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for HOUR interval timestamp with minutes != 0', () => {
    //arrange
    const timestamp = 1713514320000; //Friday, 19 April 2024 08:12:00
    const expectedTimestamp = 1713517200000; //Friday, 19 April 2024 09:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'HOUR');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return same timestamp for already rounded DAY interval timestamp ', () => {
    //arrange
    const timestamp = 1713484800000; //Friday, 19 April 2024 00:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'DAY');

    //assert
    expect(result).toEqual(timestamp);
  });

  it('should return ceiled timestamp for DAY interval timestamp with milliseconds != 0', () => {
    //arrange
    const timestamp = 1713484800100; //Friday, 19 April 2024 00:00:00.100
    const expectedTimestamp = 1713571200000; //Saturday, 20 April 2024 00:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'DAY');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for DAY interval timestamp with seconds != 0', () => {
    //arrange
    const timestamp = 1713484812000; //Friday, 19 April 2024 00:00:12
    const expectedTimestamp = 1713571200000; //Saturday, 20 April 2024 00:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'DAY');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for DAY interval timestamp with minutes != 0', () => {
    //arrange
    const timestamp = 1713485520000; //Friday, 19 April 2024 00:12:0
    const expectedTimestamp = 1713571200000; //Saturday, 20 April 2024 00:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'DAY');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });

  it('should return ceiled timestamp for DAY interval timestamp with hours != 0', () => {
    //arrange
    const timestamp = 1713528000000; //Friday, 19 April 2024 12:00:00
    const expectedTimestamp = 1713571200000; //Saturday, 20 April 2024 00:00:00

    //act
    const result = ceilTimestampAccordingToQueryInterval(timestamp, 'DAY');

    //assert
    expect(result).toEqual(expectedTimestamp);
  });
});
