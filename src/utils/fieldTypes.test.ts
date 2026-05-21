import { inferFieldValueType } from './fieldTypes';

describe('inferFieldValueType', () => {
  it('returns boolean for IS_LIVE', () => {
    expect(inferFieldValueType('IS_LIVE')).toBe('boolean');
  });

  it('returns boolean for IS_CASTING', () => {
    expect(inferFieldValueType('IS_CASTING')).toBe('boolean');
  });

  it('returns boolean for IS_MUTED', () => {
    expect(inferFieldValueType('IS_MUTED')).toBe('boolean');
  });

  it('returns number for VIDEO_STARTUPTIME', () => {
    expect(inferFieldValueType('VIDEO_STARTUPTIME')).toBe('number');
  });

  it('returns string for COUNTRY', () => {
    expect(inferFieldValueType('COUNTRY')).toBe('string');
  });

  it('returns string for BROWSER', () => {
    expect(inferFieldValueType('BROWSER')).toBe('string');
  });
});
