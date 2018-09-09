## Bitmovin Analytics Grafana Plugin

Plugin that allows you to connect Bitmovin Analytics solution into your Grafana dashboards.

## Installation [plugin not yet pushed to grafana.org]

To install this plugin using the `grafana-cli` tool:
```
sudo grafana-cli plugins install bitmovin-analytics-grafana-plugin
sudo service grafana-server restart
```

## Development

Start the development environment:

```
grunt watch
```

Build the plugin dist:

```
grunt
```