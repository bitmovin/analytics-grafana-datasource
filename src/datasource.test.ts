import { AD_HOC_NULL_VALUE, DataSource, BitmovinVariableSupport } from './datasource';
import { DataQueryRequest, DataSourceInstanceSettings } from '@grafana/data';
import { BitmovinAnalyticsDataQuery, BitmovinDataSourceOptions } from './types/grafanaTypes';
import { BitmovinVariableQuery } from './types/variableQuery';
// eslint-disable-next-line no-restricted-imports
import moment from 'moment';
import { lastValueFrom, of, throwError } from 'rxjs';

const mockFetch = jest.fn();

// Minimal getTemplateSrv().replace mock. Supports `${var}` and `$var` syntax and forwards
// multi-value variables (arrays) to the format callback, mirroring real Grafana behaviour.
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({ fetch: mockFetch }),
  getTemplateSrv: () => ({
    replace: (
      value: string,
      scopedVars?: Record<string, { value: string | string[] }>,
      format?: (v: string | string[]) => string
    ) => {
      if (!value) {
        return value;
      }
      const vars = scopedVars ?? {};
      return value.replace(/\$\{(\w+)\}|\$(\w+)/g, (match, braced, bare) => {
        const key = braced ?? bare;
        if (!(key in vars)) {
          return match;
        }
        const resolved = vars[key].value;
        if (Array.isArray(resolved)) {
          return format ? format(resolved) : resolved.join(',');
        }
        return format ? format(resolved) : resolved;
      });
    },
  }),
}));

function createDataSource(jsonData: Partial<BitmovinDataSourceOptions> = {}): DataSource {
  const instanceSettings = {
    id: 1,
    uid: 'test',
    name: 'Bitmovin Test',
    type: 'bitmovin-analytics-datasource',
    url: 'http://localhost',
    jsonData: { apiKey: 'test-key', ...jsonData },
    meta: {} as any,
    readOnly: false,
    access: 'proxy' as any,
  } as DataSourceInstanceSettings<BitmovinDataSourceOptions>;

  return new DataSource(instanceSettings);
}

function createRequest(
  target: Partial<BitmovinAnalyticsDataQuery>,
  scopedVars: Record<string, { text: string; value: string | string[] }> = {}
): DataQueryRequest<BitmovinAnalyticsDataQuery> {
  const fullTarget: BitmovinAnalyticsDataQuery = {
    refId: 'A',
    license: 'test-license',
    dimension: 'IMPRESSION_ID',
    metric: 'count',
    filter: [],
    groupBy: [],
    orderBy: [],
    resultFormat: 'table',
    ...target,
  } as BitmovinAnalyticsDataQuery;

  const from = moment('2024-01-01T00:00:00Z');
  const to = moment('2024-01-02T00:00:00Z');

  return {
    targets: [fullTarget],
    range: { from, to, raw: { from: from.toDate(), to: to.toDate() } },
    scopedVars,
  } as unknown as DataQueryRequest<BitmovinAnalyticsDataQuery>;
}

/** Returns the request body sent to the API for the first query in the request. */
function lastSentPayload(): any {
  return mockFetch.mock.calls[0][0].data;
}

describe('DataSource.query - template variable interpolation', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockReturnValue(of({ data: { data: { result: { rows: [], rowCount: 0, columnLabels: [] } } } }));
  });

  it('interpolates a template variable in a filter value', async () => {
    const ds = createDataSource();
    const request = createRequest(
      { filter: [{ name: 'COUNTRY', operator: 'EQ', value: '${country}' }] },
      { country: { text: 'DE', value: 'DE' } }
    );

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([{ name: 'COUNTRY', operator: 'EQ', value: 'DE' }]);
  });

  it('interpolates a multi-value variable into a JSON array for an IN filter', async () => {
    const ds = createDataSource();
    const request = createRequest(
      { filter: [{ name: 'BROWSER', operator: 'IN', value: '${browsers}' }] },
      { browsers: { text: 'Firefox + Chrome', value: ['Firefox', 'Chrome'] } }
    );

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([{ name: 'BROWSER', operator: 'IN', value: ['Firefox', 'Chrome'] }]);
  });

  it('keeps a single selected value valid for an IN filter', async () => {
    const ds = createDataSource();
    const request = createRequest(
      { filter: [{ name: 'BROWSER', operator: 'IN', value: '${browsers}' }] },
      { browsers: { text: 'Firefox', value: 'Firefox' } }
    );

    await ds.query(request);

    expect(lastSentPayload().filters[0].value).toEqual(['Firefox']);
  });

  it('applies only the first value when a multi-value variable is used with a non-IN operator', async () => {
    const ds = createDataSource();
    const request = createRequest(
      { filter: [{ name: 'BROWSER', operator: 'EQ', value: '${browsers}' }] },
      { browsers: { text: 'Firefox + Chrome', value: ['Firefox', 'Chrome'] } }
    );

    await ds.query(request);

    expect(lastSentPayload().filters[0]).toEqual({ name: 'BROWSER', operator: 'EQ', value: 'Firefox' });
  });

  it('applies a single selected value for a non-IN operator', async () => {
    const ds = createDataSource();
    const request = createRequest(
      { filter: [{ name: 'BROWSER', operator: 'EQ', value: '${browsers}' }] },
      { browsers: { text: 'Firefox', value: ['Firefox'] } }
    );

    await ds.query(request);

    expect(lastSentPayload().filters[0]).toEqual({ name: 'BROWSER', operator: 'EQ', value: 'Firefox' });
  });

  it('drops a filter that resolves to the "$__all" sentinel', async () => {
    const ds = createDataSource();
    const request = createRequest(
      { filter: [{ name: 'COUNTRY', operator: 'EQ', value: '${country}' }] },
      { country: { text: 'All', value: '$__all' } }
    );

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([]);
  });

  it('preserves an empty value as a null ("IS NULL") filter for null-filterable attributes', async () => {
    const ds = createDataSource();
    const request = createRequest({ filter: [{ name: 'CUSTOM_DATA_1', operator: 'EQ', value: '' }] });

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([{ name: 'CUSTOM_DATA_1', operator: 'EQ', value: null }]);
  });

  it('interpolates a template variable in the alias / series name', async () => {
    const ds = createDataSource();
    const request = createRequest({ alias: 'Panel ${country}' }, { country: { text: 'DE', value: 'DE' } });

    const result = await ds.query(request);

    expect(result.data[0].name).toBe('Panel DE');
  });

  it('leaves the series name undefined when no alias is set', async () => {
    const ds = createDataSource();
    const request = createRequest({ alias: undefined });

    const result = await ds.query(request);

    expect(result.data[0].name).toBeUndefined();
  });

  it('uses the picked license verbatim when useVariableForLicense is false', async () => {
    const ds = createDataSource();
    const request = createRequest({ license: '${licenseVar}', useVariableForLicense: false });

    await ds.query(request);

    // Not interpolated — the literal value is sent.
    expect(lastSentPayload().licenseKey).toBe('${licenseVar}');
  });

  it('interpolates the license when useVariableForLicense is true', async () => {
    const ds = createDataSource();
    const request = createRequest(
      { license: '${licenseVar}', useVariableForLicense: true },
      { licenseVar: { text: 'resolved-key', value: 'resolved-key' } }
    );

    await ds.query(request);

    expect(lastSentPayload().licenseKey).toBe('resolved-key');
  });

  it('merges ad-hoc filters from the request and maps their operators', async () => {
    const ds = createDataSource();
    const request = createRequest({ filter: [] });
    (request as any).filters = [
      { key: 'COUNTRY', operator: '=', value: 'DE', condition: '' },
      { key: 'BROWSER', operator: '!=', value: 'Firefox', condition: '' },
    ];

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([
      { name: 'COUNTRY', operator: 'EQ', value: 'DE' },
      { name: 'BROWSER', operator: 'NE', value: 'Firefox' },
    ]);
  });

  it('skips multi-value ad-hoc operators (=| / !=|), which have no Bitmovin equivalent', async () => {
    const ds = createDataSource();
    const request = createRequest({ filter: [] });
    (request as any).filters = [
      { key: 'BROWSER', operator: '=|', value: 'Firefox', values: ['Firefox', 'Chrome'], condition: '' },
      { key: 'COUNTRY', operator: '!=|', value: 'DE', values: ['DE'], condition: '' },
    ];

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([]);
  });

  it('appends ad-hoc filters after the panel filters and skips unsupported operators', async () => {
    const ds = createDataSource();
    const request = createRequest({ filter: [{ name: 'BROWSER', operator: 'EQ', value: 'Firefox' }] });
    (request as any).filters = [
      { key: 'COUNTRY', operator: '=', value: 'DE', condition: '' },
      { key: 'OPERATING_SYSTEM', operator: 'something-unsupported', value: 'x', condition: '' },
    ];

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([
      { name: 'BROWSER', operator: 'EQ', value: 'Firefox' },
      { name: 'COUNTRY', operator: 'EQ', value: 'DE' },
    ]);
  });

  it('turns the "(empty)" sentinel on a null-filterable attribute into a null ("IS NULL") filter', async () => {
    const ds = createDataSource();
    const request = createRequest({ filter: [] });
    // Grafana drops empty-value filters, so the "(empty)" option carries a non-empty sentinel.
    (request as any).filters = [{ key: 'CUSTOM_DATA_1', operator: '=', value: AD_HOC_NULL_VALUE, condition: '' }];

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([{ name: 'CUSTOM_DATA_1', operator: 'EQ', value: null }]);
  });

  it('leaves the query unchanged when no ad-hoc filters are present (older Grafana)', async () => {
    const ds = createDataSource();
    const request = createRequest({ filter: [] });
    // No request.filters and the template service has no getAdhocFilters -> no-op.

    await ds.query(request);

    expect(lastSentPayload().filters).toEqual([]);
  });
});

describe('DataSource.metricFindQuery', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  const licensesResponse = (licenseKey: string) => of({ data: { data: { result: { items: [{ licenseKey }] } } } });

  const countResponse = (values: string[]) => of({ data: { data: { result: { rows: values.map((v) => [v, 1]) } } } });

  it('returns the distinct dimension values from the API rows', async () => {
    const ds = createDataSource();
    mockFetch
      .mockReturnValueOnce(licensesResponse('first-license'))
      .mockReturnValueOnce(countResponse(['DE', 'US', 'GB']));

    const result = await ds.metricFindQuery('dimension:COUNTRY');

    expect(result).toEqual([
      { text: 'DE', value: 'DE' },
      { text: 'US', value: 'US' },
      { text: 'GB', value: 'GB' },
    ]);
    // First call resolves the license, second runs the grouped count.
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[1][0].data.groupBy).toEqual(['COUNTRY']);
  });

  it('uses an explicit license from the query text without fetching the license list', async () => {
    const ds = createDataSource();
    mockFetch.mockReturnValueOnce(countResponse(['DE', 'US']));

    const result = await ds.metricFindQuery('dimension:COUNTRY license:explicit-key');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0].data.licenseKey).toBe('explicit-key');
    expect(result).toEqual([
      { text: 'DE', value: 'DE' },
      { text: 'US', value: 'US' },
    ]);
  });

  it('queries the non-ad count endpoint with IMPRESSION_ID by default', async () => {
    const ds = createDataSource();
    mockFetch.mockReturnValueOnce(countResponse(['DE']));

    await ds.metricFindQuery('dimension:COUNTRY license:lic');

    const call = mockFetch.mock.calls[0][0];
    expect(call.url).toBe('http://localhost/analytics/queries/count');
    expect(call.data.dimension).toBe('IMPRESSION_ID');
    expect(call.data.groupBy).toEqual(['COUNTRY']);
  });

  it('queries the ads count endpoint with AD_IMPRESSION_ID for an ad-analytics datasource', async () => {
    const ds = createDataSource({ isAdAnalytics: true });
    mockFetch.mockReturnValueOnce(countResponse(['sys-a', 'sys-b']));

    const result = await ds.metricFindQuery('dimension:AD_SYSTEM license:lic');

    const call = mockFetch.mock.calls[0][0];
    expect(call.url).toBe('http://localhost/analytics/ads/queries/count');
    expect(call.data.dimension).toBe('AD_IMPRESSION_ID');
    expect(call.data.groupBy).toEqual(['AD_SYSTEM']);
    expect(result).toEqual([
      { text: 'sys-a', value: 'sys-a' },
      { text: 'sys-b', value: 'sys-b' },
    ]);
  });

  it('throws when an explicitly requested license variable cannot be resolved', async () => {
    const ds = createDataSource();

    // No scopedVar for "missing", so getTemplateSrv().replace leaves "${missing}" in place.
    await expect(ds.metricFindQuery('dimension:COUNTRY license:${missing}')).rejects.toThrow(/license/i);
    // It must not silently query the first license instead.
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('interpolates a resolved variable in the query text before parsing', async () => {
    const ds = createDataSource();
    mockFetch.mockReturnValueOnce(countResponse(['DE']));

    const result = await ds.metricFindQuery('dimension:COUNTRY license:${licenseVar}', {
      scopedVars: { licenseVar: { text: 'resolved-key', value: 'resolved-key' } },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0].data.licenseKey).toBe('resolved-key');
    expect(result).toEqual([{ text: 'DE', value: 'DE' }]);
  });

  it('queries a fixed 24h window regardless of the dashboard time range', async () => {
    const ds = createDataSource();
    mockFetch.mockReturnValueOnce(countResponse(['DE']));

    await ds.metricFindQuery('dimension:COUNTRY license:key');

    const payload = mockFetch.mock.calls[0][0].data;
    const windowMs = payload.end.getTime() - payload.start.getTime();
    expect(windowMs).toBe(24 * 60 * 60 * 1000);
  });

  it('returns an empty array for an empty query without calling the API', async () => {
    const ds = createDataSource();
    expect(await ds.metricFindQuery('')).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns an empty array when the query has no dimension', async () => {
    const ds = createDataSource();
    expect(await ds.metricFindQuery('not-a-valid-query')).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns an empty array when no license can be resolved', async () => {
    const ds = createDataSource();
    mockFetch.mockReturnValueOnce(of({ data: { data: { result: { items: [] } } } }));

    const result = await ds.metricFindQuery('dimension:COUNTRY');

    expect(result).toEqual([]);
  });

  it('surfaces an API error from the count query instead of returning empty', async () => {
    const ds = createDataSource();
    mockFetch
      .mockReturnValueOnce(licensesResponse('first-license'))
      .mockReturnValueOnce(throwError(() => ({ status: 500, data: { message: 'boom' } })));

    await expect(ds.metricFindQuery('dimension:COUNTRY')).rejects.toThrow('Failed to load variable values: 500 boom');
  });

  it('surfaces an API error from the license lookup instead of returning empty', async () => {
    const ds = createDataSource();
    mockFetch.mockReturnValueOnce(throwError(() => ({ status: 401, statusText: 'Unauthorized' })));

    await expect(ds.metricFindQuery('dimension:COUNTRY')).rejects.toThrow('Failed to load licenses: 401 Unauthorized');
  });

  it('returns the account licenses for the "licenses" keyword', async () => {
    const ds = createDataSource();
    mockFetch.mockReturnValueOnce(
      of({
        data: {
          data: {
            result: {
              items: [
                { licenseKey: 'key-1', name: 'My App' },
                { licenseKey: 'key-2', name: 'Other App' },
              ],
            },
          },
        },
      })
    );

    const result = await ds.metricFindQuery('licenses');

    expect(result).toEqual([
      { text: 'My App', value: 'key-1' },
      { text: 'Other App', value: 'key-2' },
    ]);
  });

  it('surfaces an API error for the "licenses" keyword', async () => {
    const ds = createDataSource();
    mockFetch.mockReturnValueOnce(throwError(() => ({ status: 403, statusText: 'Forbidden' })));

    await expect(ds.metricFindQuery('licenses')).rejects.toThrow('Failed to load licenses: 403 Forbidden');
  });
});

describe('BitmovinVariableSupport', () => {
  function createVariableRequest(query: string): DataQueryRequest<BitmovinVariableQuery> {
    return {
      targets: [{ refId: 'A', query }],
      range: { from: 'now-6h', to: 'now' },
      scopedVars: {},
    } as unknown as DataQueryRequest<BitmovinVariableQuery>;
  }

  it('maps metricFindQuery results into a data frame with text and value fields', async () => {
    const metricFindQuery = jest.fn().mockResolvedValue([
      { text: 'DE', value: 'DE' },
      { text: 'US', value: 'US' },
    ]);
    const datasource = { metricFindQuery } as unknown as DataSource;
    const variableSupport = new BitmovinVariableSupport(datasource);

    const response = await lastValueFrom(variableSupport.query(createVariableRequest('dimension:COUNTRY')));

    const frame = response.data[0];
    const textField = frame.fields.find((f: any) => f.name === 'text');
    const valueField = frame.fields.find((f: any) => f.name === 'value');
    expect(textField.values).toEqual(['DE', 'US']);
    expect(valueField.values).toEqual(['DE', 'US']);
  });

  it('forwards the query text and scopedVars to metricFindQuery', async () => {
    const metricFindQuery = jest.fn().mockResolvedValue([]);
    const datasource = { metricFindQuery } as unknown as DataSource;
    const variableSupport = new BitmovinVariableSupport(datasource);
    const request = createVariableRequest('dimension:BROWSER');

    await lastValueFrom(variableSupport.query(request));

    expect(metricFindQuery).toHaveBeenCalledWith('dimension:BROWSER', {
      scopedVars: request.scopedVars,
    });
  });

  it('returns an empty frame for an empty target list', async () => {
    const metricFindQuery = jest.fn().mockResolvedValue([]);
    const datasource = { metricFindQuery } as unknown as DataSource;
    const variableSupport = new BitmovinVariableSupport(datasource);

    const response = await lastValueFrom(
      variableSupport.query({
        targets: [],
        range: {},
        scopedVars: {},
      } as unknown as DataQueryRequest<BitmovinVariableQuery>)
    );

    expect(metricFindQuery).toHaveBeenCalledWith('', expect.anything());
    expect(response.data[0].fields[0].values).toEqual([]);
  });
});

describe('DataSource ad-hoc filter tag keys/values', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('getTagKeys returns standard filter attributes for a non-ad datasource', async () => {
    const ds = createDataSource();
    const keys = (await ds.getTagKeys()).map((k) => k.text);

    expect(keys).toContain('BROWSER');
    expect(keys).not.toContain('ADVERTISER_NAME');
  });

  it('getTagKeys returns ad attributes for an ad-analytics datasource', async () => {
    const ds = createDataSource({ isAdAnalytics: true });
    const keys = (await ds.getTagKeys()).map((k) => k.text);

    expect(keys).toContain('ADVERTISER_NAME');
  });

  it('getTagValues returns the distinct values of the chosen dimension', async () => {
    const ds = createDataSource();
    mockFetch
      .mockReturnValueOnce(of({ data: { data: { result: { items: [{ licenseKey: 'lic' }] } } } }))
      .mockReturnValueOnce(
        of({
          data: {
            data: {
              result: {
                rows: [
                  ['DE', 1],
                  ['US', 1],
                ],
              },
            },
          },
        })
      );

    const result = await ds.getTagValues({ key: 'COUNTRY' });

    expect(result).toEqual([
      { text: 'DE', value: 'DE' },
      { text: 'US', value: 'US' },
    ]);
    expect(mockFetch.mock.calls[1][0].data.groupBy).toEqual(['COUNTRY']);
  });

  it('getTagValues offers an "(empty)" option for null-filterable attributes', async () => {
    const ds = createDataSource();
    mockFetch
      .mockReturnValueOnce(of({ data: { data: { result: { items: [{ licenseKey: 'lic' }] } } } }))
      .mockReturnValueOnce(of({ data: { data: { result: { rows: [['custom-a', 1]] } } } }));

    // CUSTOM_DATA_1 is a null-filterable attribute.
    const result = await ds.getTagValues({ key: 'CUSTOM_DATA_1' });

    expect(result).toEqual([
      { text: '(empty)', value: AD_HOC_NULL_VALUE },
      { text: 'custom-a', value: 'custom-a' },
    ]);
  });

  it('getTagValues does not offer the "(empty)" option for non-null-filterable attributes', async () => {
    const ds = createDataSource();
    mockFetch
      .mockReturnValueOnce(of({ data: { data: { result: { items: [{ licenseKey: 'lic' }] } } } }))
      .mockReturnValueOnce(of({ data: { data: { result: { rows: [['DE', 1]] } } } }));

    const result = await ds.getTagValues({ key: 'COUNTRY' });

    expect(result).toEqual([{ text: 'DE', value: 'DE' }]);
  });
});
