# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## Development

## 0.0.4

### Added

- Grafana ad hoc filters
- order by interval option in query editor
- missing attributes for `dimension` and `orderBy`
- query option to adjust time range to complete datapoints based on current interval
- `VIDEOSTART_FAILED`, `VIDEOSTART_FAILED_REASON` and `PLAY_ATTEMPTS` as filters/groupBys (AN-2229, AN-2230, AN-2231)

## 0.0.3

### Added

- metrics `MAX_CONCURRENTVIEWERS` and `AVG_CONCURRENTVIEWERS`
- groupby attributes list
- interval `SECOND`

## 0.0.2

### Added

- Added possiblity to use `IN` filter (e.g. `BROWSER IN ["Firefox", "Chrome"]`)

## 0.0.1

- Initial Release
