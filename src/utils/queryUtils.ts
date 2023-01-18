import {AD_ATTRIBUTE, ATTRIBUTE} from "../types/queryAttributes";
import {OPERATOR} from "../types/operators";

export type QueryFilter = {
    name: AD_ATTRIBUTE | ATTRIBUTE,
    operator: OPERATOR,
    value: string
}

export const isNullFilter = (filter: QueryFilter): boolean => {
    switch (filter.name) {
        case ATTRIBUTE.CDN_PROVIDER:
        case ATTRIBUTE.CUSTOM_DATA_1:
        case ATTRIBUTE.CUSTOM_DATA_2:
        case ATTRIBUTE.CUSTOM_DATA_3:
        case ATTRIBUTE.CUSTOM_DATA_4:
        case ATTRIBUTE.CUSTOM_DATA_5:
        case ATTRIBUTE.CUSTOM_DATA_6:
        case ATTRIBUTE.CUSTOM_DATA_7:
        case ATTRIBUTE.CUSTOM_DATA_8:
        case ATTRIBUTE.CUSTOM_DATA_9:
        case ATTRIBUTE.CUSTOM_DATA_10:
        case ATTRIBUTE.CUSTOM_DATA_11:
        case ATTRIBUTE.CUSTOM_DATA_12:
        case ATTRIBUTE.CUSTOM_DATA_13:
        case ATTRIBUTE.CUSTOM_DATA_14:
        case ATTRIBUTE.CUSTOM_DATA_15:
        case ATTRIBUTE.CUSTOM_DATA_16:
        case ATTRIBUTE.CUSTOM_DATA_17:
        case ATTRIBUTE.CUSTOM_DATA_18:
        case ATTRIBUTE.CUSTOM_DATA_19:
        case ATTRIBUTE.CUSTOM_DATA_20:
        case ATTRIBUTE.CUSTOM_DATA_21:
        case ATTRIBUTE.CUSTOM_DATA_22:
        case ATTRIBUTE.CUSTOM_DATA_23:
        case ATTRIBUTE.CUSTOM_DATA_24:
        case ATTRIBUTE.CUSTOM_DATA_25:
        case ATTRIBUTE.CUSTOM_DATA_26:
        case ATTRIBUTE.CUSTOM_DATA_27:
        case ATTRIBUTE.CUSTOM_DATA_28:
        case ATTRIBUTE.CUSTOM_DATA_29:
        case ATTRIBUTE.CUSTOM_DATA_30:
        case ATTRIBUTE.CUSTOM_USER_ID:
        case ATTRIBUTE.EXPERIMENT_NAME:
        case ATTRIBUTE.ISP:
        case ATTRIBUTE.PLAYER_TECH:
        case ATTRIBUTE.PLAYER_VERSION:
        case ATTRIBUTE.VIDEO_ID: return true
        default: return false
    }
};

const tryParseValueForInFilter = (filter: QueryFilter): Array<string> => {
    try {
        const value: Array<string> = JSON.parse(filter.value);
        if (!Array.isArray(value)) {
            throw Error();
        }
        return value;
    } catch (e) {throw Error('Couldn\'t parse IN filter, please provide data in JSON array form (e.g.: ["Firefox", "Chrome"]).');}
}

export const convertFilterValueToProperType = (filter: QueryFilter): (boolean | number | string | Array<string>) => {
    const rawValue = filter.value;
    if ((!rawValue || rawValue === '') && isNullFilter(filter)) {
        return null;
    }

    if (filter.operator != null && filter.operator.toLowerCase() === 'in') {
        return tryParseValueForInFilter(filter);
    }

    switch (filter.name) {
        case ATTRIBUTE.IS_CASTING:
        case ATTRIBUTE.IS_LIVE:
        case ATTRIBUTE.IS_MUTED: return rawValue === 'true';

        case AD_ATTRIBUTE.IS_LINEAR: return rawValue === 'true';

        case ATTRIBUTE.AUDIO_BITRATE:
        case ATTRIBUTE.BUFFERED:
        case ATTRIBUTE.CLIENT_TIME:
        case ATTRIBUTE.DOWNLOAD_SPEED:
        case ATTRIBUTE.DRM_LOAD_TIME:
        case ATTRIBUTE.DROPPED_FRAMES:
        case ATTRIBUTE.DURATION:
        case ATTRIBUTE.ERROR_CODE:
        case ATTRIBUTE.PAGE_LOAD_TIME:
        case ATTRIBUTE.PAGE_LOAD_TYPE:
        case ATTRIBUTE.PAUSED:
        case ATTRIBUTE.PLAYED:
        case ATTRIBUTE.PLAYER_STARTUPTIME:
        case ATTRIBUTE.SCREEN_HEIGHT:
        case ATTRIBUTE.SCREEN_WIDTH:
        case ATTRIBUTE.SEEKED:
        case ATTRIBUTE.SEQUENCE_NUMBER:
        case ATTRIBUTE.STARTUPTIME:
        case ATTRIBUTE.VIDEO_BITRATE:
        case ATTRIBUTE.VIDEO_DURATION:
        case ATTRIBUTE.VIDEO_PLAYBACK_HEIGHT:
        case ATTRIBUTE.VIDEO_PLAYBACK_WIDTH:
        case ATTRIBUTE.VIDEO_STARTUPTIME:
        case ATTRIBUTE.VIDEO_WINDOW_HEIGHT:
        case ATTRIBUTE.VIDEO_WINDOW_WIDTH:
        case ATTRIBUTE.VIDEOTIME_END:
        case ATTRIBUTE.VIDEOTIME_START:
        case ATTRIBUTE.VIEWTIME: return parseInt(rawValue, 10);

        case AD_ATTRIBUTE.AD_STARTUP_TIME:
        case AD_ATTRIBUTE.AD_WRAPPER_ADS_COUNT:
        case AD_ATTRIBUTE.AUDIO_BITRATE:
        case AD_ATTRIBUTE.CLICK_POSITION:
        case AD_ATTRIBUTE.CLOSE_POSITION:
        case AD_ATTRIBUTE.ERROR_CODE:
        case AD_ATTRIBUTE.ERROR_POSITION:
        case AD_ATTRIBUTE.EXIT_POSITION:
        case AD_ATTRIBUTE.MANIFEST_DOWNLOAD_TIME:
        case AD_ATTRIBUTE.MIN_SUGGESTED_DURATION:
        case AD_ATTRIBUTE.PAGE_LOAD_TIME:
        case AD_ATTRIBUTE.PLAYER_STARTUPTIME:
        case AD_ATTRIBUTE.SCREEN_HEIGHT:
        case AD_ATTRIBUTE.SCREEN_WIDTH:
        case AD_ATTRIBUTE.SKIP_POSITION:
        case AD_ATTRIBUTE.TIME_FROM_CONTENT:
        case AD_ATTRIBUTE.TIME_HOVERED:
        case AD_ATTRIBUTE.TIME_IN_VIEWPORT:
        case AD_ATTRIBUTE.TIME_PLAYED:
        case AD_ATTRIBUTE.TIME_TO_CONTENT:
        case AD_ATTRIBUTE.TIME_UNTIL_HOVER:
        case AD_ATTRIBUTE.VIDEO_BITRATE:
        case AD_ATTRIBUTE.VIDEO_WINDOW_HEIGHT:
        case AD_ATTRIBUTE.VIDEO_WINDOW_WIDTH: return parseInt(rawValue, 10);

        case ATTRIBUTE.ERROR_RATE:
        case ATTRIBUTE.ERROR_PERCENTAGE:
        case ATTRIBUTE.REBUFFER_PERCENTAGE: return parseFloat(rawValue);

        case AD_ATTRIBUTE.CLICK_PERCENTAGE:
        case AD_ATTRIBUTE.CLOSE_PERCENTAGE:
        case AD_ATTRIBUTE.ERROR_PERCENTAGE:
        case AD_ATTRIBUTE.PERCENTAGE_IN_VIEWPORT:
        case AD_ATTRIBUTE.SKIP_PERCENTAGE: return parseFloat(rawValue);

        default: return rawValue
    }
}
