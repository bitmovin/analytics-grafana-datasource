# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## Development

- added Grafana Ad hoc filters
- added order by interval option in query editor
- added missing attributes
- added query option to adjust time range to complete datapoints based on current interval
- added optional new auto interval calculation to take the 200 datapoint API limit into account

## 0.0.3

### Added

- metrics `MAX_CONCURRENTVIEWERS` and `AVG_CONCURRENTVIEWERS`
- groupby attributes list
- interval `SECOND`
- zero-padding to time series

## 0.0.2

### Added

- Added possiblity to use `IN` filter (e.g. `BROWSER IN ["Firefox", "Chrome"]`)

## 0.0.1

- Initial Release
