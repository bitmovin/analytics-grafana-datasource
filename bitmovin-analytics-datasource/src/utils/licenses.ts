import { lastValueFrom } from 'rxjs';
import { getBackendSrv } from '@grafana/runtime';
import { SelectableValue } from '@grafana/data';

type AnalyticsLicense = {
  readonly name: string;
  readonly id: string;
  readonly licenseKey?: string;
};

const licenseEndpoints = [
  {
    endpoint: '/analytics/licenses',
    mapperFunc: (license: AnalyticsLicense): SelectableValue => ({
      value: license.licenseKey,
      label: license.name ? license.name : license.licenseKey,
    }),
  },
  {
    endpoint: '/analytics/virtual-licenses',
    mapperFunc: (license: AnalyticsLicense): SelectableValue => ({
      value: license.id,
      label: license.name ? license.name : license.id,
    }),
  },
  {
    endpoint: '/analytics/demo-licenses',
    mapperFunc: (license: AnalyticsLicense): SelectableValue => ({
      value: license.id,
      label: license.name ? license.name : license.id,
    }),
  },
];

async function fetchLicensesForEndpoint(
  url: string,
  apiKey: string,
  mapperFunc: (license: AnalyticsLicense) => SelectableValue
) {
  const options = {
    url: url,
    headers: { 'X-Api-Key': apiKey },
    method: 'GET',
  };

  const response = await lastValueFrom(getBackendSrv().fetch(options));
  // @ts-ignore
  const licenses = response.data.data.result.items;

  const selectableLicenses = [];
  for (const license of licenses) {
    selectableLicenses.push(mapperFunc(license));
  }

  return selectableLicenses;
}

export async function fetchLicenses(apiKey: string, baseUrl: string): Promise<SelectableValue[]> {
  const allLicenses: SelectableValue[] = [];

  for (const licenseEndpoint of licenseEndpoints) {
    const licenses = await fetchLicensesForEndpoint(
      baseUrl + licenseEndpoint.endpoint,
      apiKey,
      licenseEndpoint.mapperFunc
    );
    allLicenses.push(...licenses);
  }

  return allLicenses;
}
