import { test, expect } from '@grafana/plugin-e2e';
import { BitmovinDataSourceOptions } from '../src/types/grafanaTypes';

test('should save and test valid configuration', async ({
  createDataSourceConfigPage,
  readProvisionedDataSource,
  page,
  selectors,
}) => {
  await page.route('*/**/analytics/licenses', async (route) => {
    await route.fulfill({ status: 200, body: 'OK' });
  });
  const ds = await readProvisionedDataSource<BitmovinDataSourceOptions>({ fileName: 'datasources.yml' });
  const configPage = await createDataSourceConfigPage({ type: ds.type });

  await page.locator(`#config-editor-${configPage.datasource.name}_api-key-input`).fill('test-api-key');
  await page.locator(`#config-editor-${configPage.datasource.name}_tenant-org-id-input`).fill('test-tenant-org-id');

  const queryPromise = page.waitForRequest('*/**/analytics/licenses');
  await configPage.getByGrafanaSelector(selectors.pages.DataSource.saveAndTest).click();
  const queryRequest = await queryPromise;

  expect(queryRequest.headers()['x-api-client']).toBe('analytics-grafana-datasource');
  expect(queryRequest.headers()['x-api-key']).toBe('test-api-key');
  expect(queryRequest.headers()['x-tenant-org-id']).toBe('test-tenant-org-id');

  expect(configPage).toHaveAlert('success');
});

test('should not save invalid configuration', async ({
  createDataSourceConfigPage,
  readProvisionedDataSource,
  page,
  selectors,
}) => {
  const ds = await readProvisionedDataSource<BitmovinDataSourceOptions>({ fileName: 'datasources.yml' });
  const configPage = await createDataSourceConfigPage({ type: ds.type });

  await page.locator(`#config-editor-${configPage.datasource.name}_api-key-input`).fill('grafana-invalid-api-key');

  const responsePromise = page.waitForResponse('*/**/analytics/licenses');
  await configPage.getByGrafanaSelector(selectors.pages.DataSource.saveAndTest).click();
  const response = await responsePromise;

  expect(response.status()).toBe(403);
  expect(configPage).toHaveAlert('error');
});
