import { isEmpty } from 'lodash';

import { QueryAdAttribute } from '../types/queryAdAttributes';
import { QueryFilterOperator, OutputQueryFilterValue } from '../types/queryFilter';
import { QueryAttribute } from '../types/queryAttributes';

const isNullFilter = (filterAttribute: QueryAttribute | QueryAdAttribute): boolean => {
  switch (filterAttribute) {
    case 'CDN_PROVIDER':
    case 'CUSTOM_DATA_1':
    case 'CUSTOM_DATA_2':
    case 'CUSTOM_DATA_3':
    case 'CUSTOM_DATA_4':
    case 'CUSTOM_DATA_5':
    case 'CUSTOM_DATA_6':
    case 'CUSTOM_DATA_7':
    case 'CUSTOM_DATA_8':
    case 'CUSTOM_DATA_9':
    case 'CUSTOM_DATA_10':
    case 'CUSTOM_DATA_11':
    case 'CUSTOM_DATA_12':
    case 'CUSTOM_DATA_13':
    case 'CUSTOM_DATA_14':
    case 'CUSTOM_DATA_15':
    case 'CUSTOM_DATA_16':
    case 'CUSTOM_DATA_17':
    case 'CUSTOM_DATA_18':
    case 'CUSTOM_DATA_19':
    case 'CUSTOM_DATA_20':
    case 'CUSTOM_DATA_21':
    case 'CUSTOM_DATA_22':
    case 'CUSTOM_DATA_23':
    case 'CUSTOM_DATA_24':
    case 'CUSTOM_DATA_25':
    case 'CUSTOM_DATA_26':
    case 'CUSTOM_DATA_27':
    case 'CUSTOM_DATA_28':
    case 'CUSTOM_DATA_29':
    case 'CUSTOM_DATA_30':
    case 'CUSTOM_USER_ID':
    case 'ERROR_CODE':
    case 'EXPERIMENT_NAME':
    case 'ISP':
    case 'PLAYER_TECH':
    case 'PLAYER_VERSION':
    case 'VIDEO_ID':
      return true;
    default:
      return false;
  }
};

const parseValueForInFilter = (rawValue: string) => {
  const value: string[] = JSON.parse(rawValue);
  if (!Array.isArray(value)) {
    throw new Error();
  }
  return value;
};

const convertFilterForAds = (rawValue: string, filterAttribute: QueryAdAttribute) => {
  switch (filterAttribute) {
    case 'IS_LINEAR':
      return rawValue === 'true';

    case 'AD_STARTUP_TIME':
    case 'AD_WRAPPER_ADS_COUNT':
    case 'AUDIO_BITRATE':
    case 'CLICK_POSITION':
    case 'CLOSE_POSITION':
    case 'ERROR_CODE':
    case 'MANIFEST_DOWNLOAD_TIME':
    case 'MIN_SUGGESTED_DURATION':
    case 'PAGE_LOAD_TIME':
    case 'PLAYER_STARTUPTIME':
    case 'SCREEN_HEIGHT':
    case 'SCREEN_WIDTH':
    case 'SKIP_POSITION':
    case 'TIME_HOVERED':
    case 'TIME_IN_VIEWPORT':
    case 'TIME_PLAYED':
    case 'TIME_UNTIL_HOVER':
    case 'VIDEO_BITRATE':
    case 'VIDEO_WINDOW_HEIGHT':
    case 'VIDEO_WINDOW_WIDTH': {
      const parsedValue = parseInt(rawValue, 10);
      if (isNaN(parsedValue)) {
        throw new Error(`Couldn't parse filter value, please provide data as an integer number`);
      }
      return parsedValue;
    }

    case 'CLICK_PERCENTAGE':
    case 'CLOSE_PERCENTAGE':
    case 'PERCENTAGE_IN_VIEWPORT':
    case 'SKIP_PERCENTAGE': {
      const parsedValue = parseFloat(rawValue);
      if (isNaN(parsedValue)) {
        throw new Error(`Couldn't parse filter value, please provide data as a floating point number`);
      }
      return parsedValue;
    }

    default:
      return rawValue;
  }
};

const convertFilter = (rawValue: string, filterAttribute: QueryAttribute) => {
  switch (filterAttribute) {
    case 'IS_CASTING':
    case 'IS_LIVE':
    case 'IS_MUTED':
      return rawValue === 'true';

    case 'AUDIO_BITRATE':
    case 'BUFFERED':
    case 'CLIENT_TIME':
    case 'DOWNLOAD_SPEED':
    case 'DRM_LOAD_TIME':
    case 'DROPPED_FRAMES':
    case 'DURATION':
    case 'ERROR_CODE':
    case 'PAGE_LOAD_TIME':
    case 'PAGE_LOAD_TYPE':
    case 'PAUSED':
    case 'PLAYED':
    case 'PLAYER_STARTUPTIME':
    case 'SCREEN_HEIGHT':
    case 'SCREEN_WIDTH':
    case 'SEEKED':
    case 'STARTUPTIME':
    case 'VIDEO_BITRATE':
    case 'VIDEO_DURATION':
    case 'VIDEO_PLAYBACK_HEIGHT':
    case 'VIDEO_PLAYBACK_WIDTH':
    case 'VIDEO_STARTUPTIME':
    case 'VIDEO_WINDOW_HEIGHT':
    case 'VIDEO_WINDOW_WIDTH':
    case 'VIDEOTIME_END':
    case 'VIDEOTIME_START':
    case 'VIEWTIME': {
      const parsedValue = parseInt(rawValue, 10);
      if (isNaN(parsedValue)) {
        throw new Error(`Couldn't parse filter value, please provide data as an integer number`);
      }
      return parsedValue;
    }

    case 'ERROR_PERCENTAGE':
    case 'REBUFFER_PERCENTAGE': {
      const parsedValue = parseFloat(rawValue);
      if (isNaN(parsedValue)) {
        throw new Error(`Couldn't parse filter value, please provide data as a floating point number`);
      }
      return parsedValue;
    }

    default:
      return rawValue;
  }
};

/**
 * Transforms the string filter Value from the UI to the appropriate type for our API.
 *
 * @param {string} rawValue The raw string value from the Filter Input.
 * @param {QueryAttribute | QueryAdAttribute} filterAttribute The filter attribute.
 * @param {QueryFilterOperator} filterOperator The filter operator.
 * @param {boolean} isAdAnalytics If Ad Analytics are queried.
 * @returns {OutputQueryFilterValue} The correctly converted Filter Value.
 * */
export const convertFilterValueToProperType = (
  rawValue: string,
  filterAttribute: QueryAttribute | QueryAdAttribute,
  filterOperator: QueryFilterOperator,
  isAdAnalytics: boolean
): OutputQueryFilterValue => {
  if (isEmpty(rawValue) && isNullFilter(filterAttribute)) {
    return null;
  }

  if (filterOperator === 'IN') {
    try {
      return parseValueForInFilter(rawValue);
    } catch (e) {
      throw new Error(
        'Couldn\'t parse IN filter, please provide data in JSON array form (e.g.: ["Firefox", "Chrome"]).'
      );
    }
  }

  if (isAdAnalytics) {
    return convertFilterForAds(rawValue, filterAttribute as QueryAdAttribute);
  }
  return convertFilter(rawValue, filterAttribute as QueryAttribute);
};
