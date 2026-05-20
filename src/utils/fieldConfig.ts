import { FieldConfig } from '@grafana/data';
import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';

const UNIT_MAP: Partial<Record<QueryAttribute | QueryAdAttribute, string>> = {
  VIDEO_STARTUPTIME: 'ms',
  PLAYER_STARTUPTIME: 'ms',
  DRM_LOAD_TIME: 'ms',
  BUFFERED: 'ms',
  PLAYED: 'ms',
  VIEWTIME: 'ms',
  SEEKED: 'ms',
  VIDEO_DURATION: 'ms',
  DURATION: 'ms',
  VIDEO_BITRATE: 'bps',
  AUDIO_BITRATE: 'bps',
  DOWNLOAD_SPEED: 'bps',
  VIDEO_SEGMENTS_DOWNLOAD_SIZE: 'bytes',
  REBUFFER_PERCENTAGE: 'percentunit',
  ERROR_PERCENTAGE: 'percentunit',
  AD_STARTUP_TIME: 'ms',
};

export function inferFieldConfig(
  dimension: QueryAttribute | QueryAdAttribute | string | undefined
): FieldConfig {
  if (!dimension) {
    return {};
  }
  const unit = UNIT_MAP[dimension as QueryAttribute | QueryAdAttribute];
  if (!unit) {
    return {};
  }
  return {
    unit,
    decimals: unit === 'percentunit' ? 2 : undefined,
  };
}
