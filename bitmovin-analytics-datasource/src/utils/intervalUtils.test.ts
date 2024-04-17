import { calculateQueryInterval } from './intervalUtils';

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
