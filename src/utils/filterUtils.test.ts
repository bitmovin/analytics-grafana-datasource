import { convertFilterValueToProperType, normalizeMultiValueFilter } from './filterUtils';

describe('normalizeMultiValueFilter', () => {
  it('converts Grafana glob format {val1,val2} to JSON array', () => {
    expect(normalizeMultiValueFilter('{Firefox,Chrome}')).toBe('["Firefox","Chrome"]');
  });

  it('converts CSV format val1,val2 to JSON array', () => {
    expect(normalizeMultiValueFilter('Firefox,Chrome')).toBe('["Firefox","Chrome"]');
  });

  it('passes through an existing JSON array unchanged', () => {
    expect(normalizeMultiValueFilter('["Firefox","Chrome"]')).toBe('["Firefox","Chrome"]');
  });

  it('returns a single value unchanged', () => {
    expect(normalizeMultiValueFilter('Firefox')).toBe('Firefox');
  });
});

describe('convertFilterValueToProperType', () => {
  it('should return null if rawValue is empty and attribute a NullFilter', () => {
    //arrange & act
    const result = convertFilterValueToProperType('', 'CUSTOM_DATA_1', 'IN', false);

    //assert
    expect(result).toBeNull();
  });

  it('should throw an error if value for IN filter is not a json array', () => {
    //arrange & act && assert
    expect(() => convertFilterValueToProperType('Firefox', 'BROWSER', 'IN', false)).toThrow(
      new Error('Couldn\'t parse IN filter. Provide a JSON array (e.g.: ["Firefox", "Chrome"]) or select multiple values from a Grafana variable.')
    );
  });

  it('should correctly parse value for IN filter', () => {
    //arrange & act
    const result = convertFilterValueToProperType('["Firefox", "Safari"]', 'BROWSER', 'IN', false);

    //assert
    expect(result).toEqual(['Firefox', 'Safari']);
  });

  it('should correctly convert to boolean value for ad attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType('true', 'IS_LINEAR', 'EQ', true);

    //assert
    expect(result).toEqual(true);
  });

  it('should correctly convert to int value for ad attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType('2000', 'CLICK_POSITION', 'EQ', true);

    //assert
    expect(result).toEqual(2000);
  });

  it('should throw error if int parsing fails for ad attributes', () => {
    //arrange & act & assert
    expect(() => convertFilterValueToProperType('true', 'CLICK_POSITION', 'EQ', true)).toThrow(
      new Error(`Couldn't parse filter value, please provide data as an integer number`)
    );
  });

  it('should correctly convert to float value for ad attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType('12.56', 'CLICK_PERCENTAGE', 'EQ', true);

    //assert
    expect(result).toEqual(12.56);
  });

  it('should throw error if float parsing fails for ad attributes', () => {
    //arrange & act & assert
    expect(() => convertFilterValueToProperType('two', 'CLICK_PERCENTAGE', 'EQ', true)).toThrow(
      new Error(`Couldn't parse filter value, please provide data as a floating point number`)
    );
  });

  it('should correctly convert to boolean value for attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType('true', 'IS_CASTING', 'EQ', false);

    //assert
    expect(result).toEqual(true);
  });

  it('should correctly convert to int value for attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType('2000', 'AUDIO_BITRATE', 'EQ', false);

    //assert
    expect(result).toEqual(2000);
  });

  it('should throw error if int parsing fails for attributes', () => {
    //arrange & act & assert
    expect(() => convertFilterValueToProperType('zero', 'AUDIO_BITRATE', 'EQ', false)).toThrow(
      new Error(`Couldn't parse filter value, please provide data as an integer number`)
    );
  });

  it('should correctly convert to float value for attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType('12.56', 'ERROR_PERCENTAGE', 'EQ', false);

    //assert
    expect(result).toEqual(12.56);
  });

  it('should throw error if float parsing fails for attributes', () => {
    //arrange & act & assert
    expect(() => convertFilterValueToProperType('two', 'ERROR_PERCENTAGE', 'EQ', false)).toThrow(
      new Error(`Couldn't parse filter value, please provide data as a floating point number`)
    );
  });
});
