# Changelog

## Development

### Fix

- wrong padding of timeseries data for `HOUR` interval for timezones with minute offsets

## 1.3.0

### Added

- SSAI attributes

## 1.2.0

### Fix

- different query start times with multiple queries due to mutating of grafana start time

### Added

- Default Percentile Value when percentile metric is selected
- e2e testing with Playwright

## 1.1.1

### Added

- `X-Api-Client` header

## 1.1.0

### Added

- `MONTH` option to interval selection

### Changed

- improved fetching and handling of possibly incomplete first Datapoint

## 1.0.0

- Migrate angular-based plugin to Grafana's React-based plugin platform.
