# Bitmovin Analytics Grafana Plugin

Plugin that allows you to connect Bitmovin Analytics solution into your Grafana dashboards.

## Setup

Add the plugin and acquire your bitmovin analytics API key from the [bitmovin dashboard](https://dashboard.bitmovin.com).

Configure the datasource:

| Setting      | Value                                                    |
| ------------ | -------------------------------------------------------- |
| URL          | `https://api.bitmovin.com/v1`                            |
| Api Key      | Your Api key                                             |
| Ad Analytics | If checked, the datasource is switched to query ads data |

Optionally add your `Tenant Org Id` which you can also get from [bitmovin dashboard](https://dashboard.bitmovin.com).

## Time Series Graph

Add a new panel and select the bitmovin analytics datasource.
Configure the metric with following settings:

| Setting   | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| License   | Your analytics license                                                 |
| Metric    | Aggregation method to use, e.g. `count`, `sum`                         |
| Dimension | Dimension to aggregate over                                            |
| Filter*   | Apply filters to the query                                             |
| Format as | `time_series`                                                          |
| Group By* | Group query by dimension and plot as individual time series            |
| Order By* | Order query ascending or descending by dimension                       |
| Limit*    | Limit the result to given number                                       |
| Interval  | Time granularity of queries, select `AUTO` to adapt to global interval |
| Alias By* | Name of series (ignored when `Group By` is set)                        |

Settings marked with `*` are optionally.

### Grouped Time Series

To compare e.g. impressions per browser, we provide the `Group By` attribute to group the results by a specific dimension and plot them as individual time series. Only one `Group By` is supported for time series.

## Tables

Configure the metric as described in [Time Series Graph](#time-series-graph) but replace the `Format As` option with `table` and add a `Group By` dimension. It is recommended to add a limit (e.g. 10).

## Example

See the [example_dashboard.json](example_dashboard.json) for a demo. Configure the datasource with your Api Key and select the a license key in each panel.

## Development

Start the development environment:

```bash
grunt watch
```

Build the plugin dist:

```bash
grunt
```

## Support

Please refer to our [Analytics Api Reference](https://bitmovin.com/docs/analytics) for more information or reach out to us at [bitmovin.com](https://bitmovin.com/contact-bitmovin/).
