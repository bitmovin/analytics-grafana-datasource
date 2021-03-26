export const QUERY_INTERVAL = {
  SECOND: 'SECOND',
  MINUTE: 'MINUTE',
  HOUR: 'HOUR',
  DAY: 'DAY',
  MONTH: 'MONTH',
  AUTO: 'AUTO'
};
export const QUERY_INTERVAL_LIST = Object.keys(QUERY_INTERVAL).map(key => QUERY_INTERVAL[key]);

export const getMomentTimeUnitForQueryInterval = (interval) => {
  switch (interval) {
    case QUERY_INTERVAL.SECOND:
      return 'second';
    case QUERY_INTERVAL.MINUTE:
      return 'minute';
    case QUERY_INTERVAL.HOUR:
      return 'hour';
    case QUERY_INTERVAL.DAY:
      return 'day';
    case QUERY_INTERVAL.MONTH:
      return 'month';
    default:
      return null;
  }
};

export const calculateAutoInterval = (intervalMs) => {
  if (intervalMs <= 1000) {
    return QUERY_INTERVAL.SECOND;
  } else if (intervalMs < 60000) {
    return QUERY_INTERVAL.MINUTE;
  } else if (intervalMs >= 60000 && intervalMs < 604800) {
    return QUERY_INTERVAL.HOUR;
  } else if (intervalMs >= 604800 && intervalMs < 2592000) {
    return QUERY_INTERVAL.DAY;
  } else {
    return QUERY_INTERVAL.MONTH;
  }
}

export const calculateAutoIntervalFromRange = (from, to) => {
  let dataPointIntervalMs = (to - from) / 200;
  if (dataPointIntervalMs <= 1000) {
    return QUERY_INTERVAL.SECOND;
  } else if (dataPointIntervalMs > 1000 && dataPointIntervalMs <= 60000) {
    return QUERY_INTERVAL.MINUTE;
  } else if (dataPointIntervalMs > 60000 && dataPointIntervalMs <= 3600000) {
    return QUERY_INTERVAL.HOUR;
  } else if (dataPointIntervalMs > 3600000 && dataPointIntervalMs <= 86400000) {
    return QUERY_INTERVAL.DAY;
  } else {
    return QUERY_INTERVAL.MONTH;
  }
}
