# Bitmovin Analytics Grafana Plugin

Plugin that allows you to connect Bitmovin Analytics solution into your Grafana dashboards.

## Setup

### Add the datasource

Add the plugin and acquire your Bitmovin Analytics API key from the [bitmovin dashboard](https://dashboard.bitmovin.com/account).

Configure the datasource:

| Setting      | Value                                                    |
| ------------ | -------------------------------------------------------- |
| URL          | `https://api.bitmovin.com/v1`                            |
| API Key      | Your API key                                             |
| Ad Analytics | If checked, the datasource is switched to query ads data |

Optionally add your `Tenant Org Id` which you can also get from the [bitmovin dashboard](https://dashboard.bitmovin.com).

### Add example dashboard

See the [example_dashboard.json](example_dashboard.json) for a demo. Configure the datasource with your Api Key and select a license key in each panel.

## Time Series Graph

Add a new panel and select the bitmovin analytics datasource.
Configure the metric with following settings:

| Setting                 | Description                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| License\*               | Your analytics license                                                                   |
| Metric\*                | Aggregation method to use, e.g. `count`, `sum`                                           |
| Dimension\*             | Dimension to aggregate over                                                              |
| Filter                  | Apply filters to the query                                                               |
| Format as time series\* | Check the switch to see time series data                                                 |
| Group By                | Group query by dimension and plot as individual time series                              |
| Order By                | Order query ascending or descending by dimension                                         |
| Limit                   | Limit the result to given number                                                         |
| Interval\*              | Time granularity of queries, select `AUTO` to automatically adapt to selected time range |
| Alias By                | Set the name of series (only visible with multiple queries in one Graph)                 |

Settings marked with `*` are required for the time series graph.

### Grouped Time Series

To compare e.g. impressions per browser, we provide the `Group By` attribute to group the results by specific dimensions and plot them as individual time series. Multiple `Group Bys` are supported for time series.

## Tables

Configure the metric as described in [Time Series Graph](#time-series-graph) but uncheck the `Format as time series` option and add a `Group By` dimension. It is recommended to add a limit (e.g. 10).

## Gauges

Configure the Gauge's `Value Options`, depending on your query.

- For table data (`Format as time series` option **unchecked**) for the `Show` option select `All Values`.
- For time series data (`Format as time series` option **checked**) for the `Show` option select `Calculate` and choose a reducer function.

## Dashboard variables

The plugin supports Grafana's [template variables](https://grafana.com/docs/grafana/latest/dashboards/variables/), letting you build interactive dashboards.

### Query variables

Add a variable of type **Query**, choose the Bitmovin Analytics datasource, and write one of:

| Query                                          | What it returns                                                              |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `licenses`                                     | All licenses on your account (label = name, value = license key)             |
| `dimension:<DIMENSION>`                        | Distinct values of the dimension over the last 24h, for the first license    |
| `dimension:<DIMENSION> license:<LICENSE_KEY>`  | Distinct values of the dimension over the last 24h, for a specific license   |

The license can itself be a variable, e.g. `dimension:COUNTRY license:${license}`.

### Variables in filters and alias

In the panel query editor, reference any dashboard variable as `$name` or `${name}` in:

- **Filter values** — e.g. set a filter `COUNTRY EQ $country` to filter by the user-selected country.
- **Alias by** — e.g. `$browser plays` to drive the series legend from a variable.

For multi-value variables, an `IN` filter receives all selected values; an `EQ` filter receives the first selected value.

### Variable in license selection

In the panel query editor, the license field has a toggle that switches between picking a license from the dropdown and entering one as text (e.g. `${license}`). Combine this with a `licenses` query variable to control the licenses of the whole dashboard from a single dropdown. The variable must resolve to a single license key — multi-value variables aren't supported here.

### Ad hoc filters

Grafana's **Ad hoc filters** variable type is supported. Add a variable of that type, pointing at the Bitmovin Analytics datasource, and dashboard viewers get a filter bar that applies to every panel on the dashboard. Keys are Bitmovin dimensions; suggested values are fetched from the last 24h for the first license on your account.

## Support

Please refer to our [Documentation](https://developer.bitmovin.com/playback/docs/integrating-bitmovin-analytics-with-grafana) and [Analytics Api Reference](https://developer.bitmovin.com/playback/reference/overview) for more information or reach out to us at [bitmovin.com](https://bitmovin.com/contact-bitmovin/).
