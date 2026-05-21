import { inferFieldConfig } from './fieldConfig';

describe('inferFieldConfig', () => {
  it('returns ms unit for VIDEO_STARTUPTIME', () => {
    expect(inferFieldConfig('VIDEO_STARTUPTIME')).toEqual({ unit: 'ms' });
  });

  it('returns percentunit with 2 decimals for REBUFFER_PERCENTAGE', () => {
    expect(inferFieldConfig('REBUFFER_PERCENTAGE')).toEqual({ unit: 'percentunit', decimals: 2 });
  });

  it('returns bps unit for DOWNLOAD_SPEED', () => {
    expect(inferFieldConfig('DOWNLOAD_SPEED')).toEqual({ unit: 'bps' });
  });

  it('returns empty config for unmapped dimension COUNTRY', () => {
    expect(inferFieldConfig('COUNTRY')).toEqual({});
  });

  it('returns empty config for undefined', () => {
    expect(inferFieldConfig(undefined)).toEqual({});
  });
});
