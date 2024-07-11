# Bitmovin Analytics Grafana Plugin

Plugin that allows you to connect Bitmovin Analytics solution into your Grafana dashboards.

## Setup

### Add the datasource

Add the plugin and acquire your Bitmovin Analytics API key from the [bitmovin dashboard](https://dashboard.bitmovin.com/account).

Configure the datasource:

| Setting      | Value                                                    |
|--------------|----------------------------------------------------------|
| URL          | `https://api.bitmovin.com/v1`                            |
| API Key      | Your API key                                             |
| Ad Analytics | If checked, the datasource is switched to query ads data |

Optionally add your `Tenant Org Id` which you can also get from the [bitmovin dashboard](https://dashboard.bitmovin.com).

### Add example dashboard

See the [example_dashboard.json](example_dashboard.json) for a demo. Configure the datasource with your Api Key and select a license key in each panel.

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
| Group By               | Group query by dimension and plot as individual time series                              |
| Order By               | Order query ascending or descending by dimension                                         |
| Limit                  | Limit the result to given number                                                         |
| Interval*              | Time granularity of queries, select `AUTO` to automatically adapt to selected time range |
| Alias By               | Set the name of series (only visible with multiple queries in one Graph)                 |

Settings marked with `*` are required for the time series graph.

### Grouped Time Series

To compare e.g. impressions per browser, we provide the `Group By` attribute to group the results by specific dimensions and plot them as individual time series. Multiple `Group Bys` are supported for time series.

## Tables

Configure the metric as described in [Time Series Graph](#time-series-graph) but uncheck the `Format as time series` option and add a `Group By` dimension. It is recommended to add a limit (e.g. 10).

## Gauges

Configure the Gauge's `Value Options`, depending on your query. 

- For table data (`Format as time series` option **unchecked**) for the `Show` option select `All Values`.
- For time series data (`Format as time series` option **checked**) for the `Show` option select `Calculate` and choose a reducer function.

## Support

Please refer to our [Documentation](https://developer.bitmovin.com/playback/docs/integrating-bitmovin-analytics-with-grafana) and [Analytics Api Reference](https://developer.bitmovin.com/playback/reference/overview) for more information or reach out to us at [bitmovin.com](https://bitmovin.com/contact-bitmovin/).
