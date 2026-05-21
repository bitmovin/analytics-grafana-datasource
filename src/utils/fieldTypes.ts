import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';

export type FieldValueType = 'boolean' | 'number' | 'string';

const BOOLEAN_FIELDS: Array<QueryAttribute | QueryAdAttribute> = [
  'IS_LIVE', 'IS_CASTING', 'IS_MUTED', 'IS_LINEAR', 'AUTOPLAY', 'BROWSER_IS_BOT',
];

const NUMBER_FIELDS: Array<QueryAttribute | QueryAdAttribute> = [
  'AD', 'AD_INDEX', 'AUDIO_BITRATE', 'BUFFERED', 'CLIENT_TIME',
  'DRM_LOAD_TIME', 'DROPPED_FRAMES', 'DURATION', 'ERROR_CODE',
  'PAGE_LOAD_TIME', 'PAGE_LOAD_TYPE', 'PAUSED', 'PLAYED',
  'SCREEN_HEIGHT', 'SCREEN_WIDTH', 'SEEKED', 'VIDEO_BITRATE',
  'VIDEO_DURATION', 'VIDEO_STARTUPTIME', 'VIEWTIME',
];

export function inferFieldValueType(
  attribute: QueryAttribute | QueryAdAttribute
): FieldValueType {
  if (BOOLEAN_FIELDS.includes(attribute)) {
    return 'boolean';
  }
  if (NUMBER_FIELDS.includes(attribute)) {
    return 'number';
  }
  return 'string';
}
