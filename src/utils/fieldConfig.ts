import { FieldConfig } from '@grafana/data';
import { AggregationMethod } from '../types/aggregationMethod';

/**
 * Maps the dimension/metric being aggregated to its display unit. The values are Grafana unit ids
 * (see https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts).
 */
const UNIT_MAP: Readonly<Record<string, string>> = {
  AD_ABANDONMENT_RATE: 'percentunit',
  AD_DURATION: 'ms',
  AD_PRELOAD_OFFSET: 'ms',
  AD_REPLACE_CONTENT_DURATION: 'ms',
  AD_SCHEDULE_TIME: 'ms',
  AD_SKIP_AFTER: 'ms',
  AD_STARTUP_TIME: 'ms',
  AUDIO_BITRATE: 'bps',
  BUFFERED: 'ms',
  CLICK_PERCENTAGE: 'percentunit',
  CLOSE_PERCENTAGE: 'percentunit',
  DOWNLOAD_SPEED: 'bps',
  DRM_LOAD_TIME: 'ms',
  DURATION: 'ms',
  ERROR_PERCENTAGE: 'percentunit',
  MANIFEST_DOWNLOAD_TIME: 'ms',
  MIN_SUGGESTED_DURATION: 'ms',
  PAUSED: 'ms',
  PERCENTAGE_IN_VIEWPORT: 'percentunit',
  PLAYED: 'ms',
  PLAYER_STARTUPTIME: 'ms',
  PLAY_PERCENTAGE: 'percentunit',
  REBUFFER_PERCENTAGE: 'percentunit',
  SEEKED: 'ms',
  SKIP_PERCENTAGE: 'percentunit',
  TIME_PLAYED: 'ms',
  TIME_UNTIL_HOVER: 'ms',
  VIDEO_BITRATE: 'bps',
  VIDEO_DURATION: 'ms',
  VIDEO_SEGMENTS_DOWNLOAD_SIZE: 'bytes',
  VIDEO_STARTUPTIME: 'ms',
  VIEWTIME: 'ms',
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
