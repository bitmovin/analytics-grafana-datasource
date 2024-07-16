import { test, expect } from '@grafana/plugin-e2e';

// request interception and response mocking
test.beforeEach(async ({ context }) => {
  const licenseJson = {
    data: {
      result: {
        totalCount: 2,
        items: [
          {
            id: 'first-test-license-id',
            licenseKey: 'first-test-license-key',
            name: 'First Test License',
            timeZone: '02:00',
          },
          {
            id: 'second-test-license-id',
            licenseKey: 'second-test-license-key',
            name: 'Second Test License',
            timeZone: '04:00',
          },
        ],
      },
    },
  };

  const emptyLicenseJson = {
    data: {
      result: {
        totalCount: 0,
        items: [],
      },
    },
  };

  await context.route('*/**/analytics/licenses', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(licenseJson),
    });
  });

  await context.route('*/**/analytics/virtual-licenses', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(emptyLicenseJson) });
  });

  await context.route('*/**/analytics/demo-licenses', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(emptyLicenseJson) });
  });

  await context.route('*/**/analytics/queries/undefined', (route) => {
    route.abort();
  });

  await context.route('*/**/analytics/queries/count', async (route) => {
    //TODOMY return after last call to check whether data was rendered?
    //TODOMY actual integration tests or everything mocked?
    //TODOMY count the times it gets called to check whether it gets called after every change
    route.abort();
  });
});

test('Query Editor should send correct query with timeseries data', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  // read and select datasource
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);

  // select query interval
  await panelEditPage.getByGrafanaSelector(selectors.components.TimePicker.openButton).click();
  await page.getByText('Last 3 hours').click();

  // add filter
  await page.locator('#query-editor_add-new-filter-button').click();
  await page.locator('#query-editor_filter-attribute-select').click();
  await page.getByText('VIDEO_STARTUPTIME', { exact: true }).click();
  await page.locator('#query-editor_filter-operator-select').click();
  await page.getByText('GT', { exact: true }).click();
  await page.locator('#query-editor_filter-value-input').fill('0');
  await page.locator('#query-editor_filter-save-button').click();

  // add group by
  await page.locator('#query-editor_add-group-by-button').click();
  await page.locator('#query-editor_group-by-select').click();
  await page.getByText('BROWSER', { exact: true }).click();

  // add order by
  await page.locator('#query-editor_add-order-by-button').click();
  await page.locator('#query-editor_order-by-select').click();
  await page.getByText('FUNCTION', { exact: true }).click();
  await page.getByTitle('Sort by descending').click();

  // add limit
  await page.locator('#query-editor_limit-input').fill('10');

  // select license
  await page.locator('#query-editor_license-select').click();
  await page.getByText('First Test License', { exact: true }).click();

  // select aggregation method
  await page.locator('#query-editor_aggregation-method-select').click();
  await page.getByText('count', { exact: true }).click();

  // select dimension
  const queryRequestPromise = page.waitForRequest('*/**/analytics/queries/count');
  await page.locator('#query-editor_dimension-select').click();
  await page.getByText('IMPRESSION_ID', { exact: true }).click();

  // check for right values in request Payload
  const queryRequest = await queryRequestPromise;
  expect(queryRequest.url().endsWith('queries/count')).toBeTruthy();
  expect(queryRequest.headers()['x-api-client']).toBe('analytics-grafana-datasource');
  expect(queryRequest.postDataJSON().licenseKey).toBe('first-test-license-key');
  expect(queryRequest.postDataJSON().dimension).toBe('IMPRESSION_ID');
  expect(queryRequest.postDataJSON().filters[0].name).toBe('VIDEO_STARTUPTIME');
  expect(queryRequest.postDataJSON().filters[0].operator).toBe('GT');
  expect(queryRequest.postDataJSON().filters[0].value).toBe(0);
  expect(queryRequest.postDataJSON().groupBy[0]).toBe('BROWSER');
  expect(queryRequest.postDataJSON().orderBy[0].name).toBe('FUNCTION');
  expect(queryRequest.postDataJSON().orderBy[0].order).toBe('DESC');
  expect(queryRequest.postDataJSON().limit).toBe(10);
  expect(queryRequest.postDataJSON().interval).toBe('MINUTE');
  expect(queryRequest.postDataJSON().start).not.toBeUndefined();
  expect(queryRequest.postDataJSON().end).not.toBeUndefined();
});

// test('Query Editor should send selected request data to API with timeseries data and metric selected', async ({
//   panelEditPage,
//   readProvisionedDataSource,
//   selectors,
//   page,
// }) => {
//   //TODOMY implement
// });
//
// test('Query Editor should send selected request data to API with percentile selected', async ({
//   panelEditPage,
//   readProvisionedDataSource,
//   selectors,
//   page,
// }) => {
//   //TODOMY implement
// });
//
// test('Query Editor should send correct request data to API table data selected', async ({
//   panelEditPage,
//   readProvisionedDataSource,
//   selectors,
//   page,
// }) => {
//   //TODOMY implement
// });
