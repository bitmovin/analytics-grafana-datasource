import { SelectableValue } from '@grafana/data';

enum QUERY_ATTRIBUTES {
  AD = 'AD',
  ANALYTICS_VERSION = 'ANALYTICS_VERSION',
  AUDIO_BITRATE = 'AUDIO_BITRATE',
  AUDIO_CODEC = 'AUDIO_CODEC',
  AUDIO_LANGUAGE = 'AUDIO_LANGUAGE',
  AUTOPLAY = 'AUTOPLAY',
  BROWSER = 'BROWSER',
  BROWSER_IS_BOT = 'BROWSER_IS_BOT',
  BROWSER_VERSION_MAJOR = 'BROWSER_VERSION_MAJOR',
  BROWSER_VERSION_MINOR = 'BROWSER_VERSION_MINOR',
  BUFFERED = 'BUFFERED',
  CAST_TECH = 'CAST_TECH',
  CDN_PROVIDER = 'CDN_PROVIDER',
  CITY = 'CITY',
  CLIENT_TIME = 'CLIENT_TIME',
  CONTEXT = 'CONTEXT',
  COUNTRY = 'COUNTRY',
  CUSTOM_DATA_10 = 'CUSTOM_DATA_10',
  CUSTOM_DATA_11 = 'CUSTOM_DATA_11',
  CUSTOM_DATA_12 = 'CUSTOM_DATA_12',
  CUSTOM_DATA_13 = 'CUSTOM_DATA_13',
  CUSTOM_DATA_14 = 'CUSTOM_DATA_14',
  CUSTOM_DATA_15 = 'CUSTOM_DATA_15',
  CUSTOM_DATA_16 = 'CUSTOM_DATA_16',
  CUSTOM_DATA_17 = 'CUSTOM_DATA_17',
  CUSTOM_DATA_18 = 'CUSTOM_DATA_18',
  CUSTOM_DATA_19 = 'CUSTOM_DATA_19',
  CUSTOM_DATA_1 = 'CUSTOM_DATA_1',
  CUSTOM_DATA_20 = 'CUSTOM_DATA_20',
  CUSTOM_DATA_21 = 'CUSTOM_DATA_21',
  CUSTOM_DATA_22 = 'CUSTOM_DATA_22',
  CUSTOM_DATA_23 = 'CUSTOM_DATA_23',
  CUSTOM_DATA_24 = 'CUSTOM_DATA_24',
  CUSTOM_DATA_25 = 'CUSTOM_DATA_25',
  CUSTOM_DATA_26 = 'CUSTOM_DATA_26',
  CUSTOM_DATA_27 = 'CUSTOM_DATA_27',
  CUSTOM_DATA_28 = 'CUSTOM_DATA_28',
  CUSTOM_DATA_29 = 'CUSTOM_DATA_29',
  CUSTOM_DATA_2 = 'CUSTOM_DATA_2',
  CUSTOM_DATA_30 = 'CUSTOM_DATA_30',
  CUSTOM_DATA_3 = 'CUSTOM_DATA_3',
  CUSTOM_DATA_4 = 'CUSTOM_DATA_4',
  CUSTOM_DATA_5 = 'CUSTOM_DATA_5',
  CUSTOM_DATA_6 = 'CUSTOM_DATA_6',
  CUSTOM_DATA_7 = 'CUSTOM_DATA_7',
  CUSTOM_DATA_8 = 'CUSTOM_DATA_8',
  CUSTOM_DATA_9 = 'CUSTOM_DATA_9',
  CUSTOM_USER_ID = 'CUSTOM_USER_ID',
  DAY = 'DAY',
  DAYPART = 'DAYPART',
  DEVICE_CLASS = 'DEVICE_CLASS',
  DEVICE_TYPE = 'DEVICE_TYPE',
  DOMAIN = 'DOMAIN',
  DOWNLOAD_SPEED = 'DOWNLOAD_SPEED',
  DRM_LOAD_TIME = 'DRM_LOAD_TIME',
  DRM_TYPE = 'DRM_TYPE',
  DROPPED_FRAMES = 'DROPPED_FRAMES',
  DURATION = 'DURATION',
  ERROR_CODE = 'ERROR_CODE',
  ERROR_MESSAGE = 'ERROR_MESSAGE',
  ERROR_PERCENTAGE = 'ERROR_PERCENTAGE',
  EXPERIMENT_NAME = 'EXPERIMENT_NAME',
  FUNCTION = 'FUNCTION',
  HOUR = 'HOUR',
  ID = 'ID',
  IMPRESSION_ID = 'IMPRESSION_ID',
  INITIAL_TIME_TO_TARGET_LATENCY = 'INITIAL_TIME_TO_TARGET_LATENCY',
  IP_ADDRESS = 'IP_ADDRESS',
  ISP = 'ISP',
  IS_CASTING = 'IS_CASTING',
  IS_LIVE = 'IS_LIVE',
  IS_LOW_LATENCY = 'IS_LOW_LATENCY',
  IS_MUTED = 'IS_MUTED',
  LANGUAGE = 'LANGUAGE',
  LATENCY = 'LATENCY',
  LICENSE_KEY = 'LICENSE_KEY',
  M3U8_URL = 'M3U8_URL',
  MINUTE = 'MINUTE',
  MONTH = 'MONTH',
  MPD_URL = 'MPD_URL',
  OPERATINGSYSTEM = 'OPERATINGSYSTEM',
  OPERATINGSYSTEM_VERSION_MAJOR = 'OPERATINGSYSTEM_VERSION_MAJOR',
  OPERATINGSYSTEM_VERSION_MINOR = 'OPERATINGSYSTEM_VERSION_MINOR',
  ORGANIZATION = 'ORGANIZATION',
  PAGE_LOAD_TIME = 'PAGE_LOAD_TIME',
  PAGE_LOAD_TYPE = 'PAGE_LOAD_TYPE',
  PATH = 'PATH',
  PAUSED = 'PAUSED',
  PLATFORM = 'PLATFORM',
  PLAYED = 'PLAYED',
  PLAYER = 'PLAYER',
  PLAYER_STARTUPTIME = 'PLAYER_STARTUPTIME',
  PLAYER_TECH = 'PLAYER_TECH',
  PLAYER_VERSION = 'PLAYER_VERSION',
  PLAY_ATTEMPTS = 'PLAY_ATTEMPTS',
  PROG_URL = 'PROG_URL',
  REBUFFER_PERCENTAGE = 'REBUFFER_PERCENTAGE',
  REGION = 'REGION',
  SCALE_FACTOR = 'SCALE_FACTOR',
  SCREEN_HEIGHT = 'SCREEN_HEIGHT',
  SCREEN_ORIENTATION = 'SCREEN_ORIENTATION',
  SCREEN_WIDTH = 'SCREEN_WIDTH',
  SEEKED = 'SEEKED',
  SIZE = 'SIZE',
  STARTUPTIME = 'STARTUPTIME',
  STATE = 'STATE',
  STREAM_FORMAT = 'STREAM_FORMAT',
  SUBTITLE_ENABLED = 'SUBTITLE_ENABLED',
  SUBTITLE_LANGUAGE = 'SUBTITLE_LANGUAGE',
  SUPPORTED_VIDEO_CODECS = 'SUPPORTED_VIDEO_CODECS',
  TARGET_LATENCY = 'TARGET_LATENCY',
  TARGET_LATENCY_DELTA = 'TARGET_LATENCY_DELTA',
  TIME = 'TIME',
  TIME_TO_TARGET_LATENCY = 'TIME_TO_TARGET_LATENCY',
  USER_ID = 'USER_ID',
  VIDEOSTART_FAILED = 'VIDEOSTART_FAILED',
  VIDEOSTART_FAILED_REASON = 'VIDEOSTART_FAILED_REASON',
  VIDEOTIME_END = 'VIDEOTIME_END',
  VIDEOTIME_START = 'VIDEOTIME_START',
  VIDEO_BITRATE = 'VIDEO_BITRATE',
  VIDEO_CODEC = 'VIDEO_CODEC',
  VIDEO_CODEC_TYPE = 'VIDEO_CODEC_TYPE',
  VIDEO_DURATION = 'VIDEO_DURATION',
  VIDEO_ID = 'VIDEO_ID',
  VIDEO_PLAYBACK_HEIGHT = 'VIDEO_PLAYBACK_HEIGHT',
  VIDEO_PLAYBACK_WIDTH = 'VIDEO_PLAYBACK_WIDTH',
  VIDEO_SEGMENTS_DOWNLOADED = 'VIDEO_SEGMENTS_DOWNLOADED',
  VIDEO_SEGMENTS_DOWNLOAD_SIZE = 'VIDEO_SEGMENTS_DOWNLOAD_SIZE',
  VIDEO_STARTUPTIME = 'VIDEO_STARTUPTIME',
  VIDEO_TITLE = 'VIDEO_TITLE',
  VIDEO_WINDOW_HEIGHT = 'VIDEO_WINDOW_HEIGHT',
  VIDEO_WINDOW_WIDTH = 'VIDEO_WINDOW_WIDTH',
  VIEWTIME = 'VIEWTIME',
  YEAR = 'YEAR',
}

export type QueryAttribute = keyof typeof QUERY_ATTRIBUTES;

export const SELECTABLE_QUERY_ATTRIBUTES: SelectableValue<string>[] = [
  { value: QUERY_ATTRIBUTES.AD, label: 'Ad' },
  { value: QUERY_ATTRIBUTES.ANALYTICS_VERSION, label: 'Analytics Software Version' },
  { value: QUERY_ATTRIBUTES.AUDIO_BITRATE, label: 'Audio Bitrate' },
  { value: QUERY_ATTRIBUTES.AUDIO_CODEC, label: 'Audio Codec' },
  { value: QUERY_ATTRIBUTES.AUDIO_LANGUAGE, label: 'Audio Language' },
  { value: QUERY_ATTRIBUTES.AUTOPLAY, label: 'Autoplay' },
  { value: QUERY_ATTRIBUTES.BROWSER, label: 'Browser' },
  { value: QUERY_ATTRIBUTES.BROWSER_IS_BOT, label: 'Is Bot' },
  { value: QUERY_ATTRIBUTES.BROWSER_VERSION_MAJOR, label: 'Browser Version Major' },
  { value: QUERY_ATTRIBUTES.BROWSER_VERSION_MINOR, label: 'Browser Version Minor' },
  { value: QUERY_ATTRIBUTES.BUFFERED, label: 'Buffered' },
  { value: QUERY_ATTRIBUTES.CAST_TECH, label: 'Casting Tech' },
  { value: QUERY_ATTRIBUTES.CDN_PROVIDER, label: 'Cdn Provider' },
  { value: QUERY_ATTRIBUTES.CITY, label: 'City' },
  { value: QUERY_ATTRIBUTES.CLIENT_TIME, label: 'Client Time' },
  { value: QUERY_ATTRIBUTES.CONTEXT, label: 'Context' },
  { value: QUERY_ATTRIBUTES.COUNTRY, label: 'Country' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_10, label: 'Custom Data 10' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_11, label: 'Custom Data 11' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_12, label: 'Custom Data 12' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_13, label: 'Custom Data 13' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_14, label: 'Custom Data 14' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_15, label: 'Custom Data 15' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_16, label: 'Custom Data 16' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_17, label: 'Custom Data 17' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_18, label: 'Custom Data 18' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_19, label: 'Custom Data 19' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_1, label: 'Custom Data 1' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_20, label: 'Custom Data 20' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_21, label: 'Custom Data 21' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_22, label: 'Custom Data 22' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_23, label: 'Custom Data 23' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_24, label: 'Custom Data 24' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_25, label: 'Custom Data 25' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_26, label: 'Custom Data 26' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_27, label: 'Custom Data 27' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_28, label: 'Custom Data 28' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_29, label: 'Custom Data 29' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_2, label: 'Custom Data 2' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_30, label: 'Custom Data 30' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_3, label: 'Custom Data 3' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_4, label: 'Custom Data 4' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_5, label: 'Custom Data 5' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_6, label: 'Custom Data 6' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_7, label: 'Custom Data 7' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_8, label: 'Custom Data 8' },
  { value: QUERY_ATTRIBUTES.CUSTOM_DATA_9, label: 'Custom Data 9' },
  { value: QUERY_ATTRIBUTES.CUSTOM_USER_ID, label: 'Custom User Id' },
  { value: QUERY_ATTRIBUTES.DAY, label: 'Day' },
  { value: QUERY_ATTRIBUTES.DAYPART, label: 'Daypart' },
  { value: QUERY_ATTRIBUTES.DEVICE_CLASS, label: 'Device Class' },
  { value: QUERY_ATTRIBUTES.DEVICE_TYPE, label: 'Device Type' },
  { value: QUERY_ATTRIBUTES.DOMAIN, label: 'Domain' },
  { value: QUERY_ATTRIBUTES.DOWNLOAD_SPEED, label: 'Download Speed' },
  { value: QUERY_ATTRIBUTES.DRM_LOAD_TIME, label: 'Drm Load Time' },
  { value: QUERY_ATTRIBUTES.DRM_TYPE, label: 'Drm Type' },
  { value: QUERY_ATTRIBUTES.DROPPED_FRAMES, label: 'Dropped Frames' },
  { value: QUERY_ATTRIBUTES.DURATION, label: 'Duration' },
  { value: QUERY_ATTRIBUTES.ERROR_CODE, label: 'Error Code' },
  { value: QUERY_ATTRIBUTES.ERROR_MESSAGE, label: 'Error Message' },
  { value: QUERY_ATTRIBUTES.ERROR_PERCENTAGE, label: 'Error Percentage' },
  { value: QUERY_ATTRIBUTES.EXPERIMENT_NAME, label: 'Experiment Name' },
  { value: QUERY_ATTRIBUTES.FUNCTION, label: 'Function' },
  { value: QUERY_ATTRIBUTES.HOUR, label: 'Hour' },
  { value: QUERY_ATTRIBUTES.ID, label: 'Id' },
  { value: QUERY_ATTRIBUTES.IMPRESSION_ID, label: 'Impression Id' },
  { value: QUERY_ATTRIBUTES.INITIAL_TIME_TO_TARGET_LATENCY, label: 'Initial Time to Target Latency' },
  { value: QUERY_ATTRIBUTES.IP_ADDRESS, label: 'Ip Address' },
  { value: QUERY_ATTRIBUTES.ISP, label: 'Internet Service Provider' },
  { value: QUERY_ATTRIBUTES.IS_CASTING, label: 'Casting' },
  { value: QUERY_ATTRIBUTES.IS_LIVE, label: 'Live' },
  { value: QUERY_ATTRIBUTES.IS_LOW_LATENCY, label: 'Is Low Latency' },
  { value: QUERY_ATTRIBUTES.IS_MUTED, label: 'Muted' },
  { value: QUERY_ATTRIBUTES.LANGUAGE, label: 'Language' },
  { value: QUERY_ATTRIBUTES.LATENCY, label: 'Latency' },
  { value: QUERY_ATTRIBUTES.LICENSE_KEY, label: 'License Key' },
  { value: QUERY_ATTRIBUTES.M3U8_URL, label: 'M3U8 Url' },
  { value: QUERY_ATTRIBUTES.MINUTE, label: 'Minute' },
  { value: QUERY_ATTRIBUTES.MONTH, label: 'Month' },
  { value: QUERY_ATTRIBUTES.MPD_URL, label: 'MPD Url' },
  { value: QUERY_ATTRIBUTES.OPERATINGSYSTEM, label: 'Operating System' },
  { value: QUERY_ATTRIBUTES.OPERATINGSYSTEM_VERSION_MAJOR, label: 'Operating System Version Major' },
  { value: QUERY_ATTRIBUTES.OPERATINGSYSTEM_VERSION_MINOR, label: 'Operating System Version Minor' },
  { value: QUERY_ATTRIBUTES.ORGANIZATION, label: 'Organization' },
  { value: QUERY_ATTRIBUTES.PAGE_LOAD_TIME, label: 'Page Load Time' },
  { value: QUERY_ATTRIBUTES.PAGE_LOAD_TYPE, label: 'Page Load Type' },
  { value: QUERY_ATTRIBUTES.PATH, label: 'Path' },
  { value: QUERY_ATTRIBUTES.PAUSED, label: 'Paused' },
  { value: QUERY_ATTRIBUTES.PLATFORM, label: 'Platform' },
  { value: QUERY_ATTRIBUTES.PLAYED, label: 'Played' },
  { value: QUERY_ATTRIBUTES.PLAYER, label: 'Player Software' },
  { value: QUERY_ATTRIBUTES.PLAYER_STARTUPTIME, label: 'Player Startuptime' },
  { value: QUERY_ATTRIBUTES.PLAYER_TECH, label: 'Player Technology' },
  { value: QUERY_ATTRIBUTES.PLAYER_VERSION, label: 'Player Software Version' },
  { value: QUERY_ATTRIBUTES.PLAY_ATTEMPTS, label: 'play Attempts' },
  { value: QUERY_ATTRIBUTES.PROG_URL, label: 'Prog Url' },
  { value: QUERY_ATTRIBUTES.REBUFFER_PERCENTAGE, label: 'Rebuffer Percentage' },
  { value: QUERY_ATTRIBUTES.REGION, label: 'Region' },
  { value: QUERY_ATTRIBUTES.SCALE_FACTOR, label: 'Scale Factor' },
  { value: QUERY_ATTRIBUTES.SCREEN_HEIGHT, label: 'Screen Height' },
  { value: QUERY_ATTRIBUTES.SCREEN_ORIENTATION, label: 'Screen Orientation' },
  { value: QUERY_ATTRIBUTES.SCREEN_WIDTH, label: 'Screen Width' },
  { value: QUERY_ATTRIBUTES.SEEKED, label: 'Seeked' },
  { value: QUERY_ATTRIBUTES.SIZE, label: 'Size' },
  { value: QUERY_ATTRIBUTES.STARTUPTIME, label: 'Startuptime' },
  { value: QUERY_ATTRIBUTES.STATE, label: 'State' },
  { value: QUERY_ATTRIBUTES.STREAM_FORMAT, label: 'Stream Format' },
  { value: QUERY_ATTRIBUTES.SUBTITLE_ENABLED, label: 'Subtitle Enabled' },
  { value: QUERY_ATTRIBUTES.SUBTITLE_LANGUAGE, label: 'Subtitle Language' },
  { value: QUERY_ATTRIBUTES.SUPPORTED_VIDEO_CODECS, label: 'Supported Video Codecs' },
  { value: QUERY_ATTRIBUTES.TARGET_LATENCY, label: 'Target Latency' },
  { value: QUERY_ATTRIBUTES.TARGET_LATENCY_DELTA, label: 'Target Latency Delta' },
  { value: QUERY_ATTRIBUTES.TIME, label: 'Time' },
  { value: QUERY_ATTRIBUTES.TIME_TO_TARGET_LATENCY, label: 'Time to Target Latency' },
  { value: QUERY_ATTRIBUTES.USER_ID, label: 'User Id' },
  { value: QUERY_ATTRIBUTES.VIDEOSTART_FAILED, label: 'Video Start Failed' },
  { value: QUERY_ATTRIBUTES.VIDEOSTART_FAILED_REASON, label: 'Video Start Failed Reason' },
  { value: QUERY_ATTRIBUTES.VIDEOTIME_END, label: 'Videotime End' },
  { value: QUERY_ATTRIBUTES.VIDEOTIME_START, label: 'Videotime Start' },
  { value: QUERY_ATTRIBUTES.VIDEO_BITRATE, label: 'Video Bitrate' },
  { value: QUERY_ATTRIBUTES.VIDEO_CODEC, label: 'Video Codec' },
  { value: QUERY_ATTRIBUTES.VIDEO_CODEC_TYPE, label: 'Video Codec Type' },
  { value: QUERY_ATTRIBUTES.VIDEO_DURATION, label: 'Video Duration' },
  { value: QUERY_ATTRIBUTES.VIDEO_ID, label: 'Video Id' },
  { value: QUERY_ATTRIBUTES.VIDEO_PLAYBACK_HEIGHT, label: 'Video Playback Height' },
  { value: QUERY_ATTRIBUTES.VIDEO_PLAYBACK_WIDTH, label: 'Video Playback Width' },
  { value: QUERY_ATTRIBUTES.VIDEO_SEGMENTS_DOWNLOADED, label: 'Video Segments Downloaded' },
  { value: QUERY_ATTRIBUTES.VIDEO_SEGMENTS_DOWNLOAD_SIZE, label: 'Video Segments Download Size' },
  { value: QUERY_ATTRIBUTES.VIDEO_STARTUPTIME, label: 'Video Startuptime' },
  { value: QUERY_ATTRIBUTES.VIDEO_TITLE, label: 'Video Title' },
  { value: QUERY_ATTRIBUTES.VIDEO_WINDOW_HEIGHT, label: 'Video Window Height' },
  { value: QUERY_ATTRIBUTES.VIDEO_WINDOW_WIDTH, label: 'Video Window Width' },
  { value: QUERY_ATTRIBUTES.VIEWTIME, label: 'Viewtime' },
  { value: QUERY_ATTRIBUTES.YEAR, label: 'Year' },
];
