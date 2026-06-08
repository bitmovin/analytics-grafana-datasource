import { FieldConfig } from '@grafana/data';
import { AggregationMethod } from '../types/aggregationMethod';

/**
 * Maps the dimension/metric being aggregated to its display unit. The values are Grafana unit ids
 * (see https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts).
 */
const UNIT_MAP: Readonly<Record<string, string>> = {
  VIDEO_STARTUPTIME: 'ms',
  PLAYER_STARTUPTIME: 'ms',
  DRM_LOAD_TIME: 'ms',
  BUFFERED: 'ms',
  PLAYED: 'ms',
  VIEWTIME: 'ms',
  SEEKED: 'ms',
  VIDEO_DURATION: 'ms',
  DURATION: 'ms',
  AD_STARTUP_TIME: 'ms',
  VIDEO_BITRATE: 'bps',
  AUDIO_BITRATE: 'bps',
  DOWNLOAD_SPEED: 'bps',
  VIDEO_SEGMENTS_DOWNLOAD_SIZE: 'bytes',
  REBUFFER_PERCENTAGE: 'percentunit',
  ERROR_PERCENTAGE: 'percentunit',
};

/**
 * Infers a Grafana {@link FieldConfig} setting unit and decimals for the value column based on the
 * dimension or metric being aggregated. Examples:
 *   avg(VIDEO_STARTUPTIME)    -> { unit: 'ms' }
 *   avg(REBUFFER_PERCENTAGE)  -> { unit: 'percentunit', decimals: 2 }
 *   count(IMPRESSION_ID)      -> {}                       // counts have no inherent unit
 *
 * The `count` aggregation always returns an empty config because the value is an absolute count
 * (e.g. number of impressions), not the dimension's quantity — applying ms to `count(VIDEO_STARTUPTIME)`
 * would mislabel the axis.
 */
export function inferFieldConfig(dimension: string | undefined, aggregation?: AggregationMethod): FieldConfig {
  if (!dimension || aggregation === 'count') {
    return {};
  }
  const unit = UNIT_MAP[dimension];
  if (!unit) {
    return {};
  }
  return unit === 'percentunit' ? { unit, decimals: 2 } : { unit };
}
