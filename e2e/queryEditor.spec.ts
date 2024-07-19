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
});

test('should trigger correct number of queries with correct payload', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  let queryCounter = 0;
  await page.route('*/**/analytics/queries/count', (route) => {
    queryCounter++;
    route.abort();
  });
  // read and select datasource
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);

  // select query interval
  await panelEditPage.getByGrafanaSelector(selectors.components.TimePicker.openButton).click();
  await page.getByText('Last 3 hours').click();

  // select license
  await page.locator('#query-editor_license-select').click();
  await page.getByText('First Test License', { exact: true }).click();

  // select aggregation method
  await page.locator('#query-editor_aggregation-method-select').click();
  await page.getByText('count', { exact: true }).click();

  // select dimension
  await page.locator('#query-editor_dimension-select').click();
  await page.getByText('IMPRESSION_ID', { exact: true }).click(); // request triggered

  // add filter
  await page.locator('#query-editor_add-new-filter-button').click();
  await page.locator('#query-editor_filter-attribute-select').click();
  await page.getByText('VIDEO_STARTUPTIME', { exact: true }).click();
  await page.locator('#query-editor_filter-operator-select').click();
  await page.getByText('GT', { exact: true }).click();
  await page.locator('#query-editor_filter-value-input').fill('0');
  await page.locator('#query-editor_filter-save-button').click(); // request triggered

  // add group by
  await page.locator('#query-editor_add-group-by-button').click(); // request triggered
  await page.locator('#query-editor_group-by-select').click();
  await page.getByText('BROWSER', { exact: true }).click(); // request triggered

  // add order by
  await page.locator('#query-editor_add-order-by-button').click(); // request triggered
  await page.locator('#query-editor_order-by-select').click();
  await page.getByText('FUNCTION', { exact: true }).click(); // request triggered
  await page.getByTitle('Sort by descending').click(); // request triggered

  // add limit
  await page.locator('#query-editor_limit-input').fill('10');
  await page.locator('#query-editor_limit-input').blur(); // request triggered

  // add alias
  await page.locator('#query-editor_alias-by-input').fill('TestAlias');
  const queryRequestPromise = page.waitForRequest('*/**/analytics/queries/count');
  await page.locator('#query-editor_alias-by-input').blur(); // request triggered

  // check for right values in last request Payload
  const queryRequest = await queryRequestPromise;
  expect(queryCounter).toEqual(9);
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
  expect(queryRequest.postDataJSON().percentile).toBeUndefined();
});

test('should send correct query if a metric was selected', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  let queryCounter = 0;
  await page.route('*/**/analytics/metrics/AVG_CONCURRENTVIEWERS', (route) => {
    queryCounter++;
    route.abort();
  });

  // read and select datasource
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);

  // select query interval
  await panelEditPage.getByGrafanaSelector(selectors.components.TimePicker.openButton).click();
  await page.getByText('Last 3 hours').click();

  // select license
  await page.locator('#query-editor_license-select').click();
  await page.getByText('First Test License', { exact: true }).click();

  // select dimension
  const queryRequestPromise = page.waitForRequest('*/**/analytics/metrics/AVG_CONCURRENTVIEWERS');
  await page.locator('#query-editor_dimension-select').click();
  await page.getByText('AVG_CONCURRENTVIEWERS', { exact: true }).click(); // request triggered

  // check that aggregation method selection is not visible
  await expect(page.locator('#query-editor_aggregation-method-select')).toHaveCount(0);

  // check for right values in request Payload
  const queryRequest = await queryRequestPromise;
  expect(queryCounter).toEqual(1);
  expect(queryRequest.url().endsWith('metrics/AVG_CONCURRENTVIEWERS')).toBeTruthy();
  expect(queryRequest.headers()['x-api-client']).toBe('analytics-grafana-datasource');
  expect(queryRequest.postDataJSON().licenseKey).toBe('first-test-license-key');
  expect(queryRequest.postDataJSON().dimension).toBeUndefined();
  expect(queryRequest.postDataJSON().metric).toBe('AVG_CONCURRENTVIEWERS');
  expect(queryRequest.postDataJSON().orderBy.length).toBe(0);
  expect(queryRequest.postDataJSON().filters.length).toBe(0);
  expect(queryRequest.postDataJSON().groupBy.length).toBe(0);
  expect(queryRequest.postDataJSON().limit).toBeUndefined();
  expect(queryRequest.postDataJSON().interval).toBe('MINUTE');
  expect(queryRequest.postDataJSON().start).not.toBeUndefined();
  expect(queryRequest.postDataJSON().end).not.toBeUndefined();
  expect(queryRequest.postDataJSON().percentile).toBeUndefined();
});

test('should send correct query for time series and table data', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  let queryCounter = 0;
  await page.route('*/**/analytics/queries/count', (route) => {
    queryCounter++;
    route.abort();
  });
  // read and select datasource
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);

  // select query interval
  await panelEditPage.getByGrafanaSelector(selectors.components.TimePicker.openButton).click();
  await page.getByText('Last 3 hours').click();

  // select license
  await page.locator('#query-editor_license-select').click();
  await page.getByText('First Test License', { exact: true }).click();

  // select aggregation method
  await page.locator('#query-editor_aggregation-method-select').click();
  await page.getByText('count', { exact: true }).click();

  // select dimension
  await page.locator('#query-editor_dimension-select').click();
  const queryTimeSeriesPromise = page.waitForRequest('*/**/analytics/queries/count');
  await page.getByText('IMPRESSION_ID', { exact: true }).click(); // request triggered
  const queryTimeSeriesRequest = await queryTimeSeriesPromise;

  // check that interval is set correctly by default
  expect(queryTimeSeriesRequest.postDataJSON().interval).toBe('MINUTE');

  // uncheck format as time series option to query for table data
  const queryTablePromise = page.waitForRequest('*/**/analytics/queries/count');
  // The actual input switch element is not in the viewport (because of grafana ui library magic), that's why the
  // parent element ('..') is fetched here
  await page.locator('#query-editor_format-as-time-series-switch').locator('..').click(); // request triggered
  // check that interval selection is not visible anymore
  await expect(page.locator('#query-editor_interval-select')).toHaveCount(0);
  const queryTableRequest = await queryTablePromise;
  // check that interval is not set in request
  expect(queryTableRequest.postDataJSON().interval).toBeUndefined();

  // check format as time series option and select DAY interval
  await page.locator('#query-editor_format-as-time-series-switch').locator('..').click(); // request triggered
  const queryTimeSeriesDayPromise = page.waitForRequest('*/**/analytics/queries/count');
  await page.locator('#query-editor_interval-select').click();
  await page.getByText('Day', { exact: true }).click(); // request triggered
  const queryTimeSeriesDayRequest = await queryTimeSeriesDayPromise;
  // check that correct interval is set in request
  expect(queryTimeSeriesDayRequest.postDataJSON().interval).toBe('DAY');

  expect(queryCounter).toEqual(4);
});

test('should send correct query for percentile selection', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  let queryCounter = 0;
  await page.route('*/**/analytics/queries/percentile', (route) => {
    queryCounter++;
    route.abort();
  });
  // read and select datasource
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);

  // select query interval
  await panelEditPage.getByGrafanaSelector(selectors.components.TimePicker.openButton).click();
  await page.getByText('Last 3 hours').click();

  // select license
  await page.locator('#query-editor_license-select').click();
  await page.getByText('First Test License', { exact: true }).click();

  // select dimension
  await page.locator('#query-editor_dimension-select').click();
  await page.getByText('IMPRESSION_ID', { exact: true }).click();

  // select percentile aggregation && add percentile value
  const queryPromise = page.waitForRequest('*/**/analytics/queries/percentile');
  await page.locator('#query-editor_aggregation-method-select').click(); // request triggere
  await page.getByText('percentile', { exact: true }).click();
  await page.locator('#query-editor_percentile-value-input').fill('95'); // request triggered
  await page.locator('#query-editor_percentile-value-input').blur();
  const queryRequest = await queryPromise;

  // check for right values in request Payload
  expect(queryCounter).toEqual(2);
  expect(queryRequest.headers()['x-api-client']).toBe('analytics-grafana-datasource');
  expect(queryRequest.postDataJSON().licenseKey).toBe('first-test-license-key');
  expect(queryRequest.postDataJSON().dimension).toBe('IMPRESSION_ID');
  expect(queryRequest.postDataJSON().metric).toBeUndefined();
  expect(queryRequest.postDataJSON().orderBy.length).toBe(0);
  expect(queryRequest.postDataJSON().filters.length).toBe(0);
  expect(queryRequest.postDataJSON().groupBy.length).toBe(0);
  expect(queryRequest.postDataJSON().limit).toBeUndefined();
  expect(queryRequest.postDataJSON().interval).toBe('MINUTE');
  expect(queryRequest.postDataJSON().start).not.toBeUndefined();
  expect(queryRequest.postDataJSON().end).not.toBeUndefined();
  expect(queryRequest.postDataJSON().percentile).toBe(95);
});

test('should add, edit and delete filters correctly', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  //TODOMY implement
});

test('should add, edit and delete groupBys correctly', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  //TODOMY implement
});

test('should add, edit and delete orderBys correctly', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  //TODOMY implement
});

test('should display data with gauge correctly', async ({
  panelEditPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  //TODOMY implement
});

test('should display data alias correctly', async ({ panelEditPage, readProvisionedDataSource, selectors, page }) => {
  //TODOMY implement
});
