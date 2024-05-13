# Bitmovin Analytics Grafana Plugin

Plugin that allows you to connect Bitmovin Analytics solution into your Grafana dashboards.

## Setup

Add the plugin and acquire your Bitmovin Analytics API key from the [bitmovin dashboard](https://dashboard.bitmovin.com/account).

Configure the datasource:

| Setting      | Value                                                    |
|--------------|----------------------------------------------------------|
| URL          | `https://api.bitmovin.com/v1`                            |
| API Key      | Your API key                                             |
| Ad Analytics | If checked, the datasource is switched to query ads data |

[//]: # (TODOMY check whether the Tenant Org Id is still relevenat...)

Optionally add your `Tenant Org Id` which you can also get from [bitmovin dashboard](https://dashboard.bitmovin.com).

## Time Series Graph

Add a new panel and select the bitmovin analytics datasource.
Configure the metric with following settings:

| Setting                | Description                                                                              |
|------------------------|------------------------------------------------------------------------------------------|
| License*               | Your analytics license                                                                   |
| Metric*                | Aggregation method to use, e.g. `count`, `sum`                                           |
| Dimension*             | Dimension to aggregate over                                                              |
| Filter                 | Apply filters to the query                                                               |
| Format as time series* | Check the switch to see time series data                                                 |
| Group By*              | Group query by dimension and plot as individual time series                              |
| Order By               | Order query ascending or descending by dimension                                         |
| Limit                  | Limit the result to given number                                                         |
| Interval*              | Time granularity of queries, select `AUTO` to automatically adapt to selected time range |
| Alias By*              | Set the name of series (only visible with multiple queries in one Graph)                 |

Settings marked with `*` are required for the time series graph.

### Grouped Time Series

To compare e.g. impressions per browser, we provide the `Group By` attribute to group the results by specific dimensions and plot them as individual time series. Multiple `Group Bys` are supported for time series.

## Tables

Configure the metric as described in [Time Series Graph](#time-series-graph) but uncheck the `Format as time series` option and add a `Group By` dimension. It is recommended to add a limit (e.g. 10).

## Example

[//]: # (TODOMY implement the example_dashboard.)
See the [example_dashboard.json](example_dashboard.json) for a demo. Configure the datasource with your Api Key and select the a license key in each panel.

## Support

Please refer to our [Documentation](https://developer.bitmovin.com/playback/docs/integrating-bitmovin-analytics-with-grafana) and [Analytics Api Reference](https://developer.bitmovin.com/playback/reference/overview) for more information or reach out to us at [bitmovin.com](https://bitmovin.com/contact-bitmovin/).

-----

## Development

This project was generated with `yarn create @grafana/plugin@4.3.0`.

### Frontend

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode and run in watch mode

   ```bash
   yarn run dev
   ```

3. Build plugin in production mode

   ```bash
   yarn run build
   ```

4. Run the tests (using Jest)

   ```bash
   # Runs the tests and watches for changes, requires git init first
   yarn run test

   # Exits after running all the tests
   yarn run test:ci
   ```

5. Spin up a Grafana instance and run the plugin inside it (using Docker)

   ```bash
   yarn run server
   ```

6. Run the E2E tests (using Cypress)

   ```bash
   # Spins up a Grafana instance first that we tests against
   yarn run server

   # Starts the tests
   yarn run e2e
   ```

7. Run the linter

   ```bash
   yarn run lint

   # or

   yarn run lint:fix
   ```
