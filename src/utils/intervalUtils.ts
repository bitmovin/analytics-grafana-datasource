import {QUERY_INTERVAL} from "../types/intervals";

export const getMomentTimeUnitForQueryInterval = (interval: QUERY_INTERVAL): string => {
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

/**
 * Calculate the Auto interval based on given intervalMs
 * @param {number} intervalMs The intervalMS
 * @returns {QUERY_INTERVAL} calculated Interval as QUERY_INTERVAL
 */
export const calculateAutoInterval = (intervalMs: number): QUERY_INTERVAL=> {
    if (intervalMs <= 5 * 1000) { // SECOND granularity for timeframes below 5min
        return QUERY_INTERVAL.SECOND;
    } else if (intervalMs <= 3 * 60 * 60 * 1000) { // MINUTE granularity for timeframes below 3h
        return QUERY_INTERVAL.MINUTE;
    } else if (intervalMs <= 6 * 24 * 60 * 60 * 1000) { // HOUR granularity for timeframes below 6d
        return QUERY_INTERVAL.HOUR;
    } else if (intervalMs <= 30 * 24 * 60 * 60 * 1000) { // DAY granularity for timeframes below 30d
        return QUERY_INTERVAL.DAY;
    }
    return QUERY_INTERVAL.MONTH;
}

/**
 * Get corresponding interval in milliseconds.
 * @param {String} interval The interval
 * @returns {number} Interval in milliseconds or -1 if unknown.
 */
export const intervalToMilliseconds = (interval: string) : number => {
    switch(interval) {
        case QUERY_INTERVAL.SECOND:
            return 1000;
        case QUERY_INTERVAL.MINUTE:
            return 1000*60;
        case QUERY_INTERVAL.HOUR:
            return 1000*60*60;
        case QUERY_INTERVAL.DAY:
            return 1000*60*60*24;
        case QUERY_INTERVAL.MONTH:
            return 1000*60*60*24*30;
        default:
            return -1;
    }
};
