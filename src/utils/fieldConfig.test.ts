import { inferFieldConfig } from './fieldConfig';

describe('inferFieldConfig', () => {
  it('returns ms for a duration dimension under a value-preserving aggregation', () => {
    expect(inferFieldConfig('VIDEO_STARTUPTIME', 'avg')).toEqual({ unit: 'ms' });
    expect(inferFieldConfig('PLAYED', 'sum')).toEqual({ unit: 'ms' });
  });

  it('returns bps for bitrate / download speed', () => {
    expect(inferFieldConfig('VIDEO_BITRATE', 'avg')).toEqual({ unit: 'bps' });
    expect(inferFieldConfig('DOWNLOAD_SPEED', 'max')).toEqual({ unit: 'bps' });
  });

  it('returns bytes for download size', () => {
    expect(inferFieldConfig('VIDEO_SEGMENTS_DOWNLOAD_SIZE', 'sum')).toEqual({ unit: 'bytes' });
  });

  it('returns percentunit with 2 decimals for percentage dimensions', () => {
    expect(inferFieldConfig('REBUFFER_PERCENTAGE', 'avg')).toEqual({ unit: 'percentunit', decimals: 2 });
    expect(inferFieldConfig('ERROR_PERCENTAGE', 'avg')).toEqual({ unit: 'percentunit', decimals: 2 });
  });

  it('returns an empty config for unmapped dimensions', () => {
    expect(inferFieldConfig('COUNTRY', 'avg')).toEqual({});
    expect(inferFieldConfig('BROWSER', 'sum')).toEqual({});
  });

  it('returns an empty config when the aggregation is count, even for a unit-mapped dimension', () => {
    // count produces absolute counts of impressions/ads — the dimension's unit doesn't apply.
    expect(inferFieldConfig('VIDEO_STARTUPTIME', 'count')).toEqual({});
    expect(inferFieldConfig('VIDEO_BITRATE', 'count')).toEqual({});
  });

  it('returns an empty config for an undefined dimension', () => {
    expect(inferFieldConfig(undefined)).toEqual({});
    expect(inferFieldConfig(undefined, 'avg')).toEqual({});
  });
});
