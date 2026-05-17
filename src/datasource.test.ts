import { DataSource } from './datasource';
import { DataSourceInstanceSettings } from '@grafana/data';
import { BitmovinDataSourceOptions } from './types/grafanaTypes';

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(),
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
