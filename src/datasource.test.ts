import { DataSource } from './datasource';
import { DataSourceInstanceSettings } from '@grafana/data';
import { BitmovinDataSourceOptions } from './types/grafanaTypes';
import { of } from 'rxjs';

const mockRequest = jest.fn();

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({ fetch: mockRequest }),
  getTemplateSrv: () => ({
    replace: (value: string, scopedVars?: Record<string, { value: string }>) => {
      if (!value || !scopedVars) {
        return value;
      }
      return value.replace(/\$\{(\w+)\}/g, (_, key) => scopedVars[key]?.value ?? `\${${key}}`);
    },
  }),
}));

function createDataSource(): DataSource {
  const instanceSettings = {
    id: 1,
    uid: 'test',
    name: 'Bitmovin Test',
    type: 'bitmovin-analytics-datasource',
    url: 'http://localhost',
    jsonData: {
      apiKey: 'test-key',
    },
    meta: {} as any,
    readOnly: false,
    access: 'proxy' as any,
  } as DataSourceInstanceSettings<BitmovinDataSourceOptions>;

  return new DataSource(instanceSettings);
}

describe('DataSource.applyTemplateVariables', () => {
  it('replaces a template variable in a filter value', () => {
    const ds = createDataSource();
    const query = {
      refId: 'A',
      license: 'my-license',
      alias: '',
      filter: [{ name: 'COUNTRY', operator: 'EQ', value: '${country}' }],
      groupBy: [],
      orderBy: [],
      resultFormat: 'time_series' as const,
    };
    const scopedVars = { country: { text: 'DE', value: 'DE' } };

    const result = ds.applyTemplateVariables(query, scopedVars);

    expect(result.filter[0].value).toBe('DE');
  });

  it('replaces a template variable in alias', () => {
    const ds = createDataSource();
    const query = {
      refId: 'A',
      license: 'my-license',
      alias: 'Panel ${country}',
      filter: [],
      groupBy: [],
      orderBy: [],
      resultFormat: 'time_series' as const,
    };
    const scopedVars = { country: { text: 'DE', value: 'DE' } };

    const result = ds.applyTemplateVariables(query, scopedVars);

    expect(result.alias).toBe('Panel DE');
  });

  it('replaces a template variable in license', () => {
    const ds = createDataSource();
    const query = {
      refId: 'A',
      license: '${licenseKey}',
      alias: '',
      filter: [],
      groupBy: [],
      orderBy: [],
      resultFormat: 'time_series' as const,
    };
    const scopedVars = { licenseKey: { text: 'abc-123', value: 'abc-123' } };

    const result = ds.applyTemplateVariables(query, scopedVars);

    expect(result.license).toBe('abc-123');
  });

  it('leaves values unchanged when no matching scopedVars', () => {
    const ds = createDataSource();
    const query = {
      refId: 'A',
      license: 'static-license',
      alias: 'static-alias',
      filter: [{ name: 'COUNTRY', operator: 'EQ', value: 'DE' }],
      groupBy: [],
      orderBy: [],
      resultFormat: 'time_series' as const,
    };

    const result = ds.applyTemplateVariables(query, {});

    expect(result.license).toBe('static-license');
    expect(result.alias).toBe('static-alias');
    expect(result.filter[0].value).toBe('DE');
  });
});

describe('DataSource.metricFindQuery', () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  function makeCountResponse(values: string[]) {
    return of({
      data: {
        data: {
          result: {
            rows: values.map((v) => [v, 1]),
            rowCount: values.length,
            columnLabels: [],
          },
        },
      },
    });
  }

  function makeLicenseResponse(licenseKey: string) {
    return of({
      data: {
        data: {
          result: {
            licenses: [{ licenseKey }],
          },
        },
      },
    });
  }

  it('returns metric find values from API rows', async () => {
    const ds = createDataSource();
    mockRequest
      .mockReturnValueOnce(makeLicenseResponse('test-license'))
      .mockReturnValueOnce(makeCountResponse(['DE', 'US', 'GB']));

    const result = await ds.metricFindQuery('dimension:COUNTRY');

    expect(result).toEqual([
      { text: 'DE', value: 'DE' },
      { text: 'US', value: 'US' },
      { text: 'GB', value: 'GB' },
    ]);
  });

  it('uses license from query string when provided', async () => {
    const ds = createDataSource();
    mockRequest.mockReturnValueOnce(makeCountResponse(['DE', 'US']));

    const result = await ds.metricFindQuery('dimension:COUNTRY license:explicit-key');

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      { text: 'DE', value: 'DE' },
      { text: 'US', value: 'US' },
    ]);
  });

  it('returns empty array for empty query', async () => {
    const ds = createDataSource();
    const result = await ds.metricFindQuery('');
    expect(result).toEqual([]);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('returns empty array when query has no dimension', async () => {
    const ds = createDataSource();
    const result = await ds.metricFindQuery('invalid');
    expect(result).toEqual([]);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('returns empty array on API error', async () => {
    const ds = createDataSource();
    mockRequest
      .mockReturnValueOnce(makeLicenseResponse('test-license'))
      .mockReturnValueOnce({ subscribe: (obs: any) => obs.error(new Error('API error')) });

    const result = await ds.metricFindQuery('dimension:COUNTRY');

    expect(result).toEqual([]);
  });
});

describe('DataSource.getTagKeys', () => {
  it('returns an entry for COUNTRY, BROWSER, and PLATFORM', async () => {
    const ds = createDataSource();
    const result = await ds.getTagKeys();
    const texts = result.map((r) => r.text);
    expect(texts).toContain('COUNTRY');
    expect(texts).toContain('BROWSER');
    expect(texts).toContain('PLATFORM');
  });
});

describe('DataSource.getTagValues', () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  it('calls metricFindQuery with the correct dimension', async () => {
    const ds = createDataSource();
    mockRequest
      .mockReturnValueOnce(of({
        data: { data: { result: { licenses: [{ licenseKey: 'test-license' }] } } },
      }))
      .mockReturnValueOnce(of({
        data: { data: { result: { rows: [['DE', 1], ['US', 1]], rowCount: 2, columnLabels: [] } } },
      }));

    const result = await ds.getTagValues({ key: 'COUNTRY' });

    expect(result).toEqual([
      { text: 'DE', value: 'DE' },
      { text: 'US', value: 'US' },
    ]);
  });

  it('returns empty array when no license is available', async () => {
    const ds = createDataSource();
    mockRequest.mockReturnValueOnce(of({
      data: { data: { result: { licenses: [] } } },
    }));

    const result = await ds.getTagValues({ key: 'COUNTRY' });

    expect(result).toEqual([]);
  });
});
