import { QUERY_AD_ATTRIBUTES, QueryAdAttribute } from '../types/queryAdAttributes';
import { QUERY_FILTER_OPERATORS, QueryFilterOperator, QueryFilterValue } from '../types/queryFilter';
import { QUERY_ATTRIBUTES, QueryAttribute } from '../types/queryAttributes';

export const isNullFilter = (filterAttribute: QueryAttribute | QueryAdAttribute): boolean => {
  switch (filterAttribute) {
    case QUERY_ATTRIBUTES.CDN_PROVIDER:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_1:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_2:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_3:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_4:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_5:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_6:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_7:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_8:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_9:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_10:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_11:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_12:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_13:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_14:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_15:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_16:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_17:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_18:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_19:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_20:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_21:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_22:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_23:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_24:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_25:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_26:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_27:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_28:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_29:
    case QUERY_ATTRIBUTES.CUSTOM_DATA_30:
    case QUERY_ATTRIBUTES.CUSTOM_USER_ID:
    case QUERY_ATTRIBUTES.EXPERIMENT_NAME:
    case QUERY_ATTRIBUTES.ISP:
    case QUERY_ATTRIBUTES.PLAYER_TECH:
    case QUERY_ATTRIBUTES.PLAYER_VERSION:
    case QUERY_ATTRIBUTES.VIDEO_ID:
      return true;
    default:
      return false;
  }
};

const parseValueForInFilter = (rawValue: string) => {
  const value: Array<string> = JSON.parse(rawValue);
  if (!Array.isArray(value)) {
    throw Error('Couldn\'t parse IN filter, please provide data in JSON array form (e.g.: ["Firefox", "Chrome"]).');
  }
  return value;
};

const convertFilterForAds = (rawValue: string, filterAttribute: QueryAdAttribute) => {
  switch (filterAttribute) {
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
    case QUERY_AD_ATTRIBUTES.VIDEO_WINDOW_WIDTH: {
      const parsedValue = parseInt(rawValue, 10);
      if (isNaN(parsedValue)) {
        throw Error(`Couldn't parse filter for ${filterAttribute}, please provide data as a number`);
      }
      return parsedValue;
    }

    case QUERY_AD_ATTRIBUTES.CLICK_PERCENTAGE:
    case QUERY_AD_ATTRIBUTES.CLOSE_PERCENTAGE:
    case QUERY_AD_ATTRIBUTES.PERCENTAGE_IN_VIEWPORT:
    case QUERY_AD_ATTRIBUTES.SKIP_PERCENTAGE: {
      const parsedValue = parseFloat(rawValue);
      if (isNaN(parsedValue)) {
        throw Error(`Couldn't parse filter for ${filterAttribute}, please provide data as a number`);
      }
      return parsedValue;
    }

    default:
      return rawValue;
  }
};

const convertFilter = (rawValue: string, filterAttribute: QueryAttribute) => {
  switch (filterAttribute) {
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
    case QUERY_ATTRIBUTES.VIEWTIME: {
      const parsedValue = parseInt(rawValue, 10);
      if (isNaN(parsedValue)) {
        throw Error(`Couldn't parse filter for ${filterAttribute}, please provide data as a number`);
      }
      return parsedValue;
    }

    case QUERY_ATTRIBUTES.ERROR_PERCENTAGE:
    case QUERY_ATTRIBUTES.REBUFFER_PERCENTAGE: {
      const parsedValue = parseFloat(rawValue);
      if (isNaN(parsedValue)) {
        //TODOMY formatting of filterAttribute is not working, it is taking the value and not the label
        throw Error(`Couldn't parse filter for ${filterAttribute}, please provide data as a number`);
      }
      return parsedValue;
    }

    default:
      return rawValue;
  }
};

export const convertFilterValueToProperType = (
  rawValue: string,
  filterAttribute: QueryAttribute | QueryAdAttribute,
  filterOperator: QueryFilterOperator,
  isAdAnalytics: boolean
): QueryFilterValue => {
  //TODOMY check if the filters are actually being parsed correctly or if it is retruning NaN
  //TODOMY check if empty the attributes
  //TODOMY tests?
  //TODOMY difference between throw new and throw
  if (rawValue === '' && isNullFilter(filterAttribute)) {
    return null;
  }

  if (filterOperator === QUERY_FILTER_OPERATORS.IN) {
    return parseValueForInFilter(rawValue);
  }

  if (isAdAnalytics) {
    return convertFilterForAds(rawValue, filterAttribute as QueryAdAttribute);
  }
  return convertFilter(rawValue, filterAttribute as QueryAttribute);
};
