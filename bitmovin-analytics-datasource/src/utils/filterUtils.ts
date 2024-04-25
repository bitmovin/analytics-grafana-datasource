import { SelectableQueryFilter } from '../types/queryFilter';
import { QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QUERY_ATTRIBUTES } from '../types/queryAttributes';

const parseValueForInFilter = (rawValue: string) => {
  const value: Array<string> = JSON.parse(rawValue);
  if (!Array.isArray(value)) {
    throw Error();
  }
  return value;
};

const convertFilterForAds = (rawValue: string, filter: SelectableQueryFilter) => {
  switch (filter.name) {
    case QUERY_AD_ATTRIBUTES.IS_LINEAR:
      return rawValue === 'true';

    case QUERY_AD_ATTRIBUTES.AD_STARTUP_TIME:
    case QUERY_AD_ATTRIBUTES.AD_WRAPPER_ADS_COUNT:
    case QUERY_AD_ATTRIBUTES.AUDIO_BITRATE:
    case QUERY_AD_ATTRIBUTES.CLICK_POSITION:
    case QUERY_AD_ATTRIBUTES.CLOSE_POSITION:
    case QUERY_AD_ATTRIBUTES.ERROR_CODE:
    case QUERY_AD_ATTRIBUTES.MANIFEST_DOWNLOAD_TIME:
    case QUERY_AD_ATTRIBUTES.MIN_SUGGESTED_DURATION:
    case QUERY_AD_ATTRIBUTES.PAGE_LOAD_TIME:
    case QUERY_AD_ATTRIBUTES.PLAYER_STARTUPTIME:
    case QUERY_AD_ATTRIBUTES.SCREEN_HEIGHT:
    case QUERY_AD_ATTRIBUTES.SCREEN_WIDTH:
    case QUERY_AD_ATTRIBUTES.SKIP_POSITION:
    case QUERY_AD_ATTRIBUTES.TIME_HOVERED:
    case QUERY_AD_ATTRIBUTES.TIME_IN_VIEWPORT:
    case QUERY_AD_ATTRIBUTES.TIME_PLAYED:
    case QUERY_AD_ATTRIBUTES.TIME_UNTIL_HOVER:
    case QUERY_AD_ATTRIBUTES.VIDEO_BITRATE:
    case QUERY_AD_ATTRIBUTES.VIDEO_WINDOW_HEIGHT:
    case QUERY_AD_ATTRIBUTES.VIDEO_WINDOW_WIDTH:
      return parseInt(rawValue, 10);

    case QUERY_AD_ATTRIBUTES.CLICK_PERCENTAGE:
    case QUERY_AD_ATTRIBUTES.CLOSE_PERCENTAGE:
    case QUERY_AD_ATTRIBUTES.PERCENTAGE_IN_VIEWPORT:
    case QUERY_AD_ATTRIBUTES.SKIP_PERCENTAGE:
      return parseFloat(rawValue);

    default:
      return rawValue;
  }
};

const convertFilter = (rawValue: string, filter: SelectableQueryFilter) => {
  switch (filter.name) {
    case QUERY_ATTRIBUTES.IS_CASTING:
    case QUERY_ATTRIBUTES.IS_LIVE:
    case QUERY_ATTRIBUTES.IS_MUTED:
      return rawValue === 'true';

    case QUERY_ATTRIBUTES.AUDIO_BITRATE:
    case QUERY_ATTRIBUTES.BUFFERED:
    case QUERY_ATTRIBUTES.CLIENT_TIME:
    case QUERY_ATTRIBUTES.DOWNLOAD_SPEED:
    case QUERY_ATTRIBUTES.DRM_LOAD_TIME:
    case QUERY_ATTRIBUTES.DROPPED_FRAMES:
    case QUERY_ATTRIBUTES.DURATION:
    case QUERY_ATTRIBUTES.ERROR_CODE:
    case QUERY_ATTRIBUTES.PAGE_LOAD_TIME:
    case QUERY_ATTRIBUTES.PAGE_LOAD_TYPE:
    case QUERY_ATTRIBUTES.PAUSED:
    case QUERY_ATTRIBUTES.PLAYED:
    case QUERY_ATTRIBUTES.PLAYER_STARTUPTIME:
    case QUERY_ATTRIBUTES.SCREEN_HEIGHT:
    case QUERY_ATTRIBUTES.SCREEN_WIDTH:
    case QUERY_ATTRIBUTES.SEEKED:
    case QUERY_ATTRIBUTES.STARTUPTIME:
    case QUERY_ATTRIBUTES.VIDEO_BITRATE:
    case QUERY_ATTRIBUTES.VIDEO_DURATION:
    case QUERY_ATTRIBUTES.VIDEO_PLAYBACK_HEIGHT:
    case QUERY_ATTRIBUTES.VIDEO_PLAYBACK_WIDTH:
    case QUERY_ATTRIBUTES.VIDEO_STARTUPTIME:
    case QUERY_ATTRIBUTES.VIDEO_WINDOW_HEIGHT:
    case QUERY_ATTRIBUTES.VIDEO_WINDOW_WIDTH:
    case QUERY_ATTRIBUTES.VIDEOTIME_END:
    case QUERY_ATTRIBUTES.VIDEOTIME_START:
    case QUERY_ATTRIBUTES.VIEWTIME:
      return parseInt(rawValue, 10);

    case QUERY_ATTRIBUTES.ERROR_PERCENTAGE:
    case QUERY_ATTRIBUTES.REBUFFER_PERCENTAGE:
      return parseFloat(rawValue);

    default:
      return rawValue;
  }
};
export const convertFilterValueToProperType = (
  rawValue: string,
  filter: SelectableQueryFilter,
  isAdAnalytics: boolean
): boolean | number | string | Array<string> => {
  //TODOMY check null filter parsing
  //TODOMY check if empty
  //TODOMY tests?
  if (filter.operator === 'IN') {
    try {
      return parseValueForInFilter(rawValue);
    } catch (e) {
      throw Error('Couldn\'t parse IN filter, please provide data in JSON array form (e.g.: ["Firefox", "Chrome"]).');
    }
  }

  if (isAdAnalytics) {
    return convertFilterForAds(rawValue, filter);
  }
  return convertFilter(rawValue, filter);
};
