"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFilterValueToProperType = exports.isNullFilter = void 0;
var queryAttributes_1 = require("../types/queryAttributes");
var isNullFilter = function (filter) {
    switch (filter.name) {
        case queryAttributes_1.ATTRIBUTE.CDN_PROVIDER:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_1:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_2:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_3:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_4:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_5:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_6:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_7:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_8:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_9:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_10:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_11:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_12:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_13:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_14:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_15:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_16:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_17:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_18:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_19:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_20:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_21:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_22:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_23:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_24:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_25:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_26:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_27:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_28:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_29:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_DATA_30:
        case queryAttributes_1.ATTRIBUTE.CUSTOM_USER_ID:
        case queryAttributes_1.ATTRIBUTE.EXPERIMENT_NAME:
        case queryAttributes_1.ATTRIBUTE.ISP:
        case queryAttributes_1.ATTRIBUTE.PLAYER_TECH:
        case queryAttributes_1.ATTRIBUTE.PLAYER_VERSION:
        case queryAttributes_1.ATTRIBUTE.VIDEO_ID: return true;
        default: return false;
    }
};
exports.isNullFilter = isNullFilter;
var tryParseValueForInFilter = function (filter) {
    try {
        var value = JSON.parse(filter.value);
        if (!Array.isArray(value)) {
            throw Error();
        }
        return value;
    }
    catch (e) {
        throw Error('Couldn\'t parse IN filter, please provide data in JSON array form (e.g.: ["Firefox", "Chrome"]).');
    }
};
var convertFilterValueToProperType = function (filter) {
    var rawValue = filter.value;
    if ((!rawValue || rawValue === '') && (0, exports.isNullFilter)(filter)) {
        return null;
    }
    if (filter.operator != null && filter.operator.toLowerCase() === 'in') {
        return tryParseValueForInFilter(filter);
    }
    switch (filter.name) {
        case queryAttributes_1.ATTRIBUTE.IS_CASTING:
        case queryAttributes_1.ATTRIBUTE.IS_LIVE:
        case queryAttributes_1.ATTRIBUTE.IS_MUTED: return rawValue === 'true';
        case queryAttributes_1.AD_ATTRIBUTE.IS_LINEAR: return rawValue === 'true';
        case queryAttributes_1.ATTRIBUTE.AUDIO_BITRATE:
        case queryAttributes_1.ATTRIBUTE.BUFFERED:
        case queryAttributes_1.ATTRIBUTE.CLIENT_TIME:
        case queryAttributes_1.ATTRIBUTE.DOWNLOAD_SPEED:
        case queryAttributes_1.ATTRIBUTE.DRM_LOAD_TIME:
        case queryAttributes_1.ATTRIBUTE.DROPPED_FRAMES:
        case queryAttributes_1.ATTRIBUTE.DURATION:
        case queryAttributes_1.ATTRIBUTE.ERROR_CODE:
        case queryAttributes_1.ATTRIBUTE.PAGE_LOAD_TIME:
        case queryAttributes_1.ATTRIBUTE.PAGE_LOAD_TYPE:
        case queryAttributes_1.ATTRIBUTE.PAUSED:
        case queryAttributes_1.ATTRIBUTE.PLAYED:
        case queryAttributes_1.ATTRIBUTE.PLAYER_STARTUPTIME:
        case queryAttributes_1.ATTRIBUTE.SCREEN_HEIGHT:
        case queryAttributes_1.ATTRIBUTE.SCREEN_WIDTH:
        case queryAttributes_1.ATTRIBUTE.SEEKED:
        case queryAttributes_1.ATTRIBUTE.SEQUENCE_NUMBER:
        case queryAttributes_1.ATTRIBUTE.STARTUPTIME:
        case queryAttributes_1.ATTRIBUTE.VIDEO_BITRATE:
        case queryAttributes_1.ATTRIBUTE.VIDEO_DURATION:
        case queryAttributes_1.ATTRIBUTE.VIDEO_PLAYBACK_HEIGHT:
        case queryAttributes_1.ATTRIBUTE.VIDEO_PLAYBACK_WIDTH:
        case queryAttributes_1.ATTRIBUTE.VIDEO_STARTUPTIME:
        case queryAttributes_1.ATTRIBUTE.VIDEO_WINDOW_HEIGHT:
        case queryAttributes_1.ATTRIBUTE.VIDEO_WINDOW_WIDTH:
        case queryAttributes_1.ATTRIBUTE.VIDEOTIME_END:
        case queryAttributes_1.ATTRIBUTE.VIDEOTIME_START:
        case queryAttributes_1.ATTRIBUTE.VIEWTIME: return parseInt(rawValue, 10);
        case queryAttributes_1.AD_ATTRIBUTE.AD_STARTUP_TIME:
        case queryAttributes_1.AD_ATTRIBUTE.AD_WRAPPER_ADS_COUNT:
        case queryAttributes_1.AD_ATTRIBUTE.AUDIO_BITRATE:
        case queryAttributes_1.AD_ATTRIBUTE.CLICK_POSITION:
        case queryAttributes_1.AD_ATTRIBUTE.CLOSE_POSITION:
        case queryAttributes_1.AD_ATTRIBUTE.ERROR_CODE:
        case queryAttributes_1.AD_ATTRIBUTE.ERROR_POSITION:
        case queryAttributes_1.AD_ATTRIBUTE.EXIT_POSITION:
        case queryAttributes_1.AD_ATTRIBUTE.MANIFEST_DOWNLOAD_TIME:
        case queryAttributes_1.AD_ATTRIBUTE.MIN_SUGGESTED_DURATION:
        case queryAttributes_1.AD_ATTRIBUTE.PAGE_LOAD_TIME:
        case queryAttributes_1.AD_ATTRIBUTE.PLAYER_STARTUPTIME:
        case queryAttributes_1.AD_ATTRIBUTE.SCREEN_HEIGHT:
        case queryAttributes_1.AD_ATTRIBUTE.SCREEN_WIDTH:
        case queryAttributes_1.AD_ATTRIBUTE.SKIP_POSITION:
        case queryAttributes_1.AD_ATTRIBUTE.TIME_FROM_CONTENT:
        case queryAttributes_1.AD_ATTRIBUTE.TIME_HOVERED:
        case queryAttributes_1.AD_ATTRIBUTE.TIME_IN_VIEWPORT:
        case queryAttributes_1.AD_ATTRIBUTE.TIME_PLAYED:
        case queryAttributes_1.AD_ATTRIBUTE.TIME_TO_CONTENT:
        case queryAttributes_1.AD_ATTRIBUTE.TIME_UNTIL_HOVER:
        case queryAttributes_1.AD_ATTRIBUTE.VIDEO_BITRATE:
        case queryAttributes_1.AD_ATTRIBUTE.VIDEO_WINDOW_HEIGHT:
        case queryAttributes_1.AD_ATTRIBUTE.VIDEO_WINDOW_WIDTH: return parseInt(rawValue, 10);
        case queryAttributes_1.ATTRIBUTE.ERROR_RATE:
        case queryAttributes_1.ATTRIBUTE.ERROR_PERCENTAGE:
        case queryAttributes_1.ATTRIBUTE.REBUFFER_PERCENTAGE: return parseFloat(rawValue);
        case queryAttributes_1.AD_ATTRIBUTE.CLICK_PERCENTAGE:
        case queryAttributes_1.AD_ATTRIBUTE.CLOSE_PERCENTAGE:
        case queryAttributes_1.AD_ATTRIBUTE.ERROR_PERCENTAGE:
        case queryAttributes_1.AD_ATTRIBUTE.PERCENTAGE_IN_VIEWPORT:
        case queryAttributes_1.AD_ATTRIBUTE.SKIP_PERCENTAGE: return parseFloat(rawValue);
        default: return rawValue;
    }
};
exports.convertFilterValueToProperType = convertFilterValueToProperType;
//# sourceMappingURL=queryUtils.js.map