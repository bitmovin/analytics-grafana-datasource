# Changelog

## Development

## 1.4.1

### Changed

- [Internal] dependency update

### Fixed

- wrong value conversion for `AD` filter
- `AUTO` interval calculation for grafana versions >= `11.3.0`
- typo in `example_dashboard.json`

## 1.4.0

### Added

- support for additional customData fields 31 to 50

## 1.3.1

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
