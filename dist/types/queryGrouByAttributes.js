"use strict";

System.register(["./queryAttributes"], function (_export, _context) {
  "use strict";

  var getAttributeValues, GROUP_BY_ATTRIBUTE, GROUP_BY_AD_ATTRIBUTE, GROUP_BY_ATTRIBUTE_LIST, GROUP_BY_AD_ATTRIBUTE_LIST;

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  return {
    setters: [function (_queryAttributes) {
      getAttributeValues = _queryAttributes.getAttributeValues;
    }],
    execute: function () {
      _export("GROUP_BY_ATTRIBUTE", GROUP_BY_ATTRIBUTE = {
        AD: 'AD',
        ANALYTICS_VERSION: 'ANALYTICS_VERSION',
        AUDIO_BITRATE: 'AUDIO_BITRATE',
        AUDIO_LANGUAGE: 'AUDIO_LANGUAGE',
        AUTOPLAY: 'AUTOPLAY',
        BROWSER: 'BROWSER',
        BROWSER_IS_BOT: 'BROWSER_IS_BOT',
        BROWSER_VERSION_MAJOR: 'BROWSER_VERSION_MAJOR',
        BROWSER_VERSION_MINOR: 'BROWSER_VERSION_MINOR',
        CDN_PROVIDER: 'CDN_PROVIDER',
        CITY: 'CITY',
        COUNTRY: 'COUNTRY',
        CUSTOM_DATA_1: 'CUSTOM_DATA_1',
        CUSTOM_DATA_2: 'CUSTOM_DATA_2',
        CUSTOM_DATA_3: 'CUSTOM_DATA_3',
        CUSTOM_DATA_4: 'CUSTOM_DATA_4',
        CUSTOM_DATA_5: 'CUSTOM_DATA_5',
        CUSTOM_DATA_6: 'CUSTOM_DATA_6',
        CUSTOM_DATA_7: 'CUSTOM_DATA_7',
        CUSTOM_USER_ID: 'CUSTOM_USER_ID',
        DAY: 'DAY',
        DEVICE_TYPE: 'DEVICE_TYPE',
        DEVICE_CLASS: 'DEVICE_CLASS',
        DOMAIN: 'DOMAIN',
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
        PAGE_LOAD_TYPE: 'PAGE_LOAD_TYPE',
        PATH: 'PATH',
        PLATFORM: 'PLATFORM',
        PLAYER_TECH: 'PLAYER_TECH',
        PLAYER_VERSION: 'PLAYER_VERSION',
        PROG_URL: 'PROG_URL',
        REGION: 'REGION',
        SCREEN_ORIENTATION: 'SCREEN_ORIENTATION',
        SCREEN_HEIGHT: 'SCREEN_HEIGHT',
        SCREEN_WIDTH: 'SCREEN_WIDTH',
        STREAM_FORMAT: 'STREAM_FORMAT',
        SUBTITLE_LANGUAGE: 'SUBTITLE_LANGUAGE',
        SUBTITLE_ENABLED: 'SUBTITLE_ENABLED',
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
        YEAR: 'YEAR',
        DRM_TYPE: 'DRM_TYPE',
        DRM_LOAD_TIME: 'DRM_LOAD_TIME',
        ISP: 'ISP',
        ASN: 'ASN'
      });

      _export("GROUP_BY_AD_ATTRIBUTE", GROUP_BY_AD_ATTRIBUTE = _objectSpread({}, GROUP_BY_ATTRIBUTE));

      _export("GROUP_BY_ATTRIBUTE_LIST", GROUP_BY_ATTRIBUTE_LIST = getAttributeValues(GROUP_BY_ATTRIBUTE));

      _export("GROUP_BY_AD_ATTRIBUTE_LIST", GROUP_BY_AD_ATTRIBUTE_LIST = getAttributeValues(GROUP_BY_AD_ATTRIBUTE));
    }
  };
});
//# sourceMappingURL=queryGrouByAttributes.js.map
