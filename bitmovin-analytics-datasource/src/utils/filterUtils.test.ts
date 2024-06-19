import { convertFilterValueToProperType, mapQueryFilterValueToRawFilterValue } from './filterUtils';
import { QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { QUERY_FILTER_OPERATORS } from '../types/queryFilter';
import { QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';

describe('convertFilterValueToProperType', () => {
  it('should return null if rawValue is empty and attribute a NullFilter', () => {
    //arrange & act
    const result = convertFilterValueToProperType('', QUERY_ATTRIBUTES.CUSTOM_DATA_1, QUERY_FILTER_OPERATORS.IN, false);

    //assert
    expect(result).toBeNull();
  });

  it('should throw an error if value for IN filter is not a json array', () => {
    //arrange & act && assert
    expect(() =>
      convertFilterValueToProperType('Firefox', QUERY_ATTRIBUTES.BROWSER, QUERY_FILTER_OPERATORS.IN, false)
    ).toThrow(
      new Error('Couldn\'t parse IN filter, please provide data in JSON array form (e.g.: ["Firefox", "Chrome"]).')
    );
  });

  it('should correctly parse value for IN filter', () => {
    //arrange & act
    const result = convertFilterValueToProperType(
      '["Firefox", "Safari"]',
      QUERY_ATTRIBUTES.BROWSER,
      QUERY_FILTER_OPERATORS.IN,
      false
    );

    //assert
    expect(result).toEqual(['Firefox', 'Safari']);
  });

  it('should correctly convert to boolean value for ad attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType(
      'true',
      QUERY_AD_ATTRIBUTES.IS_LINEAR,
      QUERY_FILTER_OPERATORS.EQ,
      true
    );

    //assert
    expect(result).toEqual(true);
  });

  it('should correctly convert to int value for ad attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType(
      '2000',
      QUERY_AD_ATTRIBUTES.CLICK_POSITION,
      QUERY_FILTER_OPERATORS.EQ,
      true
    );

    //assert
    expect(result).toEqual(2000);
  });

  it('should throw error if int parsing fails for ad attributes', () => {
    //arrange & act & assert
    expect(() =>
      convertFilterValueToProperType('true', QUERY_AD_ATTRIBUTES.CLICK_POSITION, QUERY_FILTER_OPERATORS.EQ, true)
    ).toThrow(new Error(`Couldn't parse filter value, please provide data as an integer number`));
  });

  it('should correctly convert to float value for ad attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType(
      '12.56',
      QUERY_AD_ATTRIBUTES.CLICK_PERCENTAGE,
      QUERY_FILTER_OPERATORS.EQ,
      true
    );

    //assert
    expect(result).toEqual(12.56);
  });

  it('should throw error if float parsing fails for ad attributes', () => {
    //arrange & act & assert
    expect(() =>
      convertFilterValueToProperType('two', QUERY_AD_ATTRIBUTES.CLICK_PERCENTAGE, QUERY_FILTER_OPERATORS.EQ, true)
    ).toThrow(new Error(`Couldn't parse filter value, please provide data as a floating point number`));
  });

  it('should correctly convert to boolean value for attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType(
      'true',
      QUERY_ATTRIBUTES.IS_CASTING,
      QUERY_FILTER_OPERATORS.EQ,
      false
    );

    //assert
    expect(result).toEqual(true);
  });

  it('should correctly convert to int value for attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType(
      '2000',
      QUERY_AD_ATTRIBUTES.AUDIO_BITRATE,
      QUERY_FILTER_OPERATORS.EQ,
      false
    );

    //assert
    expect(result).toEqual(2000);
  });

  it('should throw error if int parsing fails for attributes', () => {
    //arrange & act & assert
    expect(() =>
      convertFilterValueToProperType('zero', QUERY_ATTRIBUTES.AUDIO_BITRATE, QUERY_FILTER_OPERATORS.EQ, false)
    ).toThrow(new Error(`Couldn't parse filter value, please provide data as an integer number`));
  });

  it('should correctly convert to float value for attributes', () => {
    //arrange & act
    const result = convertFilterValueToProperType(
      '12.56',
      QUERY_ATTRIBUTES.ERROR_PERCENTAGE,
      QUERY_FILTER_OPERATORS.EQ,
      false
    );

    //assert
    expect(result).toEqual(12.56);
  });

  it('should throw error if float parsing fails for attributes', () => {
    //arrange & act & assert
    expect(() =>
      convertFilterValueToProperType('two', QUERY_ATTRIBUTES.ERROR_PERCENTAGE, QUERY_FILTER_OPERATORS.EQ, false)
    ).toThrow(new Error(`Couldn't parse filter value, please provide data as a floating point number`));
  });
});

describe('mapQueryFilterValueToRawFilterValue', () => {
  it('should return empty string for null filter value', () => {
    //arrange && act
    const result = mapQueryFilterValueToRawFilterValue(null);

    //assert
    expect(result).toEqual('');
  });

  it('should return boolean as string', () => {
    //arrange && act
    const result = mapQueryFilterValueToRawFilterValue(true);

    //assert
    expect(result).toEqual('true');
  });

  it('should return integer as string', () => {
    //arrange && act
    const result = mapQueryFilterValueToRawFilterValue(23);

    //assert
    expect(result).toEqual('23');
  });

  it('should return float as string', () => {
    //arrange && act
    const result = mapQueryFilterValueToRawFilterValue(23.5);

    //assert
    expect(result).toEqual('23.5');
  });

  it('should return string as string', () => {
    //arrange && act
    const result = mapQueryFilterValueToRawFilterValue('de');

    //assert
    expect(result).toEqual('de');
  });

  it('should return string array as string', () => {
    //arrange && act
    const result = mapQueryFilterValueToRawFilterValue(['Firefox', 'Opera']);

    //assert
    expect(result).toEqual('["Firefox","Opera"]');
  });
});
