"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var ATTRIBUTE, ORDERBY_ATTRIBUTES, ATTRIBUTE_LIST, ORDERBY_ATTRIBUTES_LIST, getAsOptionsList, isNullFilter, convertFilterValueToProperType;

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  return {
    setters: [],
    execute: function () {
      _export("ATTRIBUTE", ATTRIBUTE = {
        ID: 'ID',
        LICENSE_KEY: 'LICENSE_KEY',
        AD: 'AD',
        ANALYTICS_VERSION: 'ANALYTICS_VERSION',
        AUDIO_BITRATE: 'AUDIO_BITRATE',
        AUTOPLAY: 'AUTOPLAY',
        BROWSER: 'BROWSER',
        BROWSER_VERSION_MAJOR: 'BROWSER_VERSION_MAJOR',
        BROWSER_VERSION_MINOR: 'BROWSER_VERSION_MINOR',
        BUFFERED: 'BUFFERED',
        CDN_PROVIDER: 'CDN_PROVIDER',
        CITY: 'CITY',
        CLIENT_TIME: 'CLIENT_TIME',
        COUNTRY: 'COUNTRY',
        CUSTOM_DATA_1: 'CUSTOM_DATA_1',
        CUSTOM_DATA_2: 'CUSTOM_DATA_2',
        CUSTOM_DATA_3: 'CUSTOM_DATA_3',
        CUSTOM_DATA_4: 'CUSTOM_DATA_4',
        CUSTOM_DATA_5: 'CUSTOM_DATA_5',
        CUSTOM_USER_ID: 'CUSTOM_USER_ID',
        DAY: 'DAY',
        DAYPART: 'DAYPART',
        DEVICE_TYPE: 'DEVICE_TYPE',
        DOMAIN: 'DOMAIN',
        DROPPED_FRAMES: 'DROPPED_FRAMES',
        DURATION: 'DURATION',
        ERROR_CODE: 'ERROR_CODE',
        ERROR_MESSAGE: 'ERROR_MESSAGE',
        EXPERIMENT_NAME: 'EXPERIMENT_NAME',
        HOUR: 'HOUR',
        IMPRESSION_ID: 'IMPRESSION_ID',
        IP_ADDRESS: 'IP_ADDRESS',
        IS_CASTING: 'IS_CASTING',
        IS_LIVE: 'IS_LIVE',
        IS_MUTED: 'IS_MUTED',
        LANGUAGE: 'LANGUAGE',
        M3U8_URL: 'M3U8_URL',
        MINUTE: 'MINUTE',
        MONTH: 'MONTH',
        MPD_URL: 'MPD_URL',
        OPERATINGSYSTEM: 'OPERATINGSYSTEM',
        OPERATINGSYSTEM_VERSION_MAJOR: 'OPERATINGSYSTEM_VERSION_MAJOR',
        OPERATINGSYSTEM_VERSION_MINOR: 'OPERATINGSYSTEM_VERSION_MINOR',
        ORGANIZATION: 'ORGANIZATION',
        PAGE_LOAD_TIME: 'PAGE_LOAD_TIME',
        PAGE_LOAD_TYPE: 'PAGE_LOAD_TYPE',
        PATH: 'PATH',
        PAUSED: 'PAUSED',
        PLAYED: 'PLAYED',
        PLAYER: 'PLAYER',
        PLAYER_STARTUPTIME: 'PLAYER_STARTUPTIME',
        PLAYER_TECH: 'PLAYER_TECH',
        PLAYER_VERSION: 'PLAYER_VERSION',
        PROG_URL: 'PROG_URL',
        REGION: 'REGION',
        REBUFFER_PERCENTAGE: 'REBUFFER_PERCENTAGE',
        SCALE_FACTOR: 'SCALE_FACTOR',
        SCREEN_HEIGHT: 'SCREEN_HEIGHT',
        SCREEN_WIDTH: 'SCREEN_WIDTH',
        SEEKED: 'SEEKED',
        SIZE: 'SIZE',
        STARTUPTIME: 'STARTUPTIME',
        STATE: 'STATE',
        STREAM_FORMAT: 'STREAM_FORMAT',
        TIME: 'TIME',
        USER_ID: 'USER_ID',
        VIDEO_BITRATE: 'VIDEO_BITRATE',
        VIDEO_DURATION: 'VIDEO_DURATION',
        VIDEO_ID: 'VIDEO_ID',
        VIDEO_TITLE: 'VIDEO_TITLE',
        VIDEO_PLAYBACK_HEIGHT: 'VIDEO_PLAYBACK_HEIGHT',
        VIDEO_PLAYBACK_WIDTH: 'VIDEO_PLAYBACK_WIDTH',
        VIDEO_STARTUPTIME: 'VIDEO_STARTUPTIME',
        VIDEO_WINDOW_HEIGHT: 'VIDEO_WINDOW_HEIGHT',
        VIDEO_WINDOW_WIDTH: 'VIDEO_WINDOW_WIDTH',
        VIDEOTIME_END: 'VIDEOTIME_END',
        VIDEOTIME_START: 'VIDEOTIME_START',
        VIEWTIME: 'VIEWTIME',
        YEAR: 'YEAR',
        DRM_TYPE: 'DRM_TYPE',
        DRM_LOAD_TIME: 'DRM_LOAD_TIME',
        ISP: 'ISP',
        ASN: 'ASN'
      });

      _export("ORDERBY_ATTRIBUTES", ORDERBY_ATTRIBUTES = _objectSpread({}, ATTRIBUTE, {
        FUNCTION: 'FUNCTION'
      }));

      _export("ATTRIBUTE_LIST", ATTRIBUTE_LIST = Object.keys(ATTRIBUTE).map(function (key) {
        return ATTRIBUTE[key];
      }));

      _export("ORDERBY_ATTRIBUTES_LIST", ORDERBY_ATTRIBUTES_LIST = Object.keys(ORDERBY_ATTRIBUTES).map(function (key) {
        return ORDERBY_ATTRIBUTES[key];
      }));

      _export("getAsOptionsList", getAsOptionsList = function getAsOptionsList(list) {
        return _.map(list, function (e) {
          return {
            value: e,
            text: e
          };
        });
      });

      _export("isNullFilter", isNullFilter = function isNullFilter(filter) {
        switch (filter.name) {
          case ATTRIBUTE.CDN_PROVIDER:
          case ATTRIBUTE.CUSTOM_DATA_1:
          case ATTRIBUTE.CUSTOM_DATA_2:
          case ATTRIBUTE.CUSTOM_DATA_3:
          case ATTRIBUTE.CUSTOM_DATA_4:
          case ATTRIBUTE.CUSTOM_DATA_5:
          case ATTRIBUTE.CUSTOM_USER_ID:
          case ATTRIBUTE.EXPERIMENT_NAME:
          case ATTRIBUTE.ISP:
          case ATTRIBUTE.PLAYER_TECH:
          case ATTRIBUTE.PLAYER_VERSION:
          case ATTRIBUTE.VIDEO_ID:
            return true;

          default:
            return false;
        }
      });

      _export("convertFilterValueToProperType", convertFilterValueToProperType = function convertFilterValueToProperType(filter) {
        if ((!filter.value || filter.value === '') && isNullFilter(filter)) {
          return null;
        }

        switch (filter.name) {
          case ATTRIBUTE.IS_CASTING:
          case ATTRIBUTE.IS_LIVE:
          case ATTRIBUTE.IS_MUTED:
            return filter.value === 'true';

          case ATTRIBUTE.AUDIO_BITRATE:
          case ATTRIBUTE.BUFFERED:
          case ATTRIBUTE.CLIENT_TIME:
          case ATTRIBUTE.DRM_LOAD_TIME:
          case ATTRIBUTE.DROPPED_FRAMES:
          case ATTRIBUTE.DURATION:
          case ATTRIBUTE.ERROR_CODE:
          case ATTRIBUTE.PAGE_LOAD_TIME:
          case ATTRIBUTE.PAGE_LOAD_TYPE:
          case ATTRIBUTE.PAUSED:
          case ATTRIBUTE.PLAYED:
          case ATTRIBUTE.PLAYER_STARTUPTIME:
          case ATTRIBUTE.REBUFFER_PERCENTAGE:
          case ATTRIBUTE.SCREEN_HEIGHT:
          case ATTRIBUTE.SCREEN_WIDTH:
          case ATTRIBUTE.SEEKED:
          case ATTRIBUTE.STARTUPTIME:
          case ATTRIBUTE.VIDEO_BITRATE:
          case ATTRIBUTE.VIDEO_DURATION:
          case ATTRIBUTE.VIDEO_STARTUPTIME:
          case ATTRIBUTE.VIDEOTIME:
          case ATTRIBUTE.VIDEOTIME_END:
          case ATTRIBUTE.VIDEOTIME_START:
          case ATTRIBUTE.VIEWTIME:
            return parseInt(filter.value, 10);

          default:
            return filter.value;
        }
      });
    }
  };
});
//# sourceMappingURL=queryAttributes.js.map
