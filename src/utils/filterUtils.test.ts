import {
  convertFilterValueToProperType,
  getMultiValueOperatorWarning,
  isBooleanFilter,
  normalizeInFilterValue,
  VariableLike,
} from './filterUtils';

describe('normalizeInFilterValue', () => {
  it('passes an explicit JSON array through unchanged', () => {
    expect(normalizeInFilterValue('["Firefox","Chrome"]')).toBe('["Firefox","Chrome"]');
  });

  it('converts a Grafana multi-value glob to a JSON array', () => {
    expect(normalizeInFilterValue('{Firefox,Chrome}')).toBe('["Firefox","Chrome"]');
  });

  it('converts a comma separated list to a JSON array', () => {
    expect(normalizeInFilterValue('Firefox, Chrome')).toBe('["Firefox","Chrome"]');
  });

  it('wraps a single value into a one-element array', () => {
    expect(normalizeInFilterValue('Firefox')).toBe('["Firefox"]');
  });

  it('returns an empty array for an empty string', () => {
    expect(normalizeInFilterValue('')).toBe('[]');
  });
});

describe('convertFilterValueToProperType', () => {
  it('should return null if rawValue is empty and attribute a NullFilter', () => {
    //arrange & act
    const result = convertFilterValueToProperType('', 'CUSTOM_DATA_1', 'IN', false);

    //assert
    expect(result).toBeNull();
  });

  it('should normalize a single value into a one-element array for IN filter', () => {
    //arrange & act
    const result = convertFilterValueToProperType('Firefox', 'BROWSER', 'IN', false);

    //assert
    expect(result).toEqual(['Firefox']);
  });

  it('should normalize a Grafana multi-value glob into an array for IN filter', () => {
    //arrange & act
    const result = convertFilterValueToProperType('{Firefox,Chrome}', 'BROWSER', 'IN', false);

    //assert
    expect(result).toEqual(['Firefox', 'Chrome']);
  });

  it('should normalize a comma separated list into an array for IN filter', () => {
    //arrange & act
    const result = convertFilterValueToProperType('Firefox,Chrome', 'BROWSER', 'IN', false);

    //assert
    expect(result).toEqual(['Firefox', 'Chrome']);
  });

  it('should throw an error if value for IN filter is a malformed JSON array', () => {
    //arrange & act && assert
    expect(() => convertFilterValueToProperType('["Firefox"', 'BROWSER', 'IN', false)).toThrow(
      new Error(
        'Couldn\'t parse IN filter. Provide a JSON array (e.g.: ["Firefox", "Chrome"]) or select values from a multi-value Grafana variable.'
      )
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

describe('getMultiValueOperatorWarning', () => {
  const multiVar: VariableLike = { name: 'browsers', multi: true };
  const singleValueVar: VariableLike = { name: 'country', multi: false };

  it('warns for a non-IN operator referencing a multi-value variable (${name} syntax)', () => {
    expect(getMultiValueOperatorWarning('${browsers}', 'EQ', [multiVar])).toContain('IN');
  });

  it('warns for the $name syntax too', () => {
    expect(getMultiValueOperatorWarning('$browsers', 'NE', [multiVar])).toContain('IN');
  });

  it('does not warn for the IN operator', () => {
    expect(getMultiValueOperatorWarning('${browsers}', 'IN', [multiVar])).toBeUndefined();
  });

  it('does not warn for a single-value (non-multi) variable', () => {
    expect(getMultiValueOperatorWarning('${country}', 'EQ', [singleValueVar])).toBeUndefined();
  });

  it('does not warn for a literal value with no variable', () => {
    expect(getMultiValueOperatorWarning('Firefox', 'EQ', [multiVar])).toBeUndefined();
  });

  it('does not warn when the referenced variable is not defined', () => {
    expect(getMultiValueOperatorWarning('${unknown}', 'EQ', [multiVar])).toBeUndefined();
  });

  it('returns undefined for an empty value or missing operator', () => {
    expect(getMultiValueOperatorWarning('', 'EQ', [multiVar])).toBeUndefined();
    expect(getMultiValueOperatorWarning('${browsers}', undefined, [multiVar])).toBeUndefined();
  });
});

describe('isBooleanFilter', () => {
  it('returns true for non-ad boolean attribute', () => {
    expect(isBooleanFilter('IS_CASTING', false)).toBe(true);
    expect(isBooleanFilter('AUTOPLAY', false)).toBe(true);
  });

  it('returns true for ad boolean attribute', () => {
    expect(isBooleanFilter('IS_LINEAR', true)).toBe(true);
    expect(isBooleanFilter('AUTOPLAY', true)).toBe(true);
  });

  it('returns false for non-boolean attributes', () => {
    expect(isBooleanFilter('BROWSER', false)).toBe(false);
  });

  it('respects the isAdAnalytics flag (different boolean sets)', () => {
    // IS_LINEAR is an ad-only boolean.
    expect(isBooleanFilter('IS_LINEAR', false)).toBe(false);
    // IS_LIVE is a non-ad-only boolean
    expect(isBooleanFilter('IS_CASTING', true)).toBe(false);
  });
});
