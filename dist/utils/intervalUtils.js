"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervalToMilliseconds = exports.calculateAutoInterval = exports.getMomentTimeUnitForQueryInterval = void 0;
var intervals_1 = require("../types/intervals");
var getMomentTimeUnitForQueryInterval = function (interval) {
    switch (interval) {
        case intervals_1.QUERY_INTERVAL.SECOND:
            return 'second';
        case intervals_1.QUERY_INTERVAL.MINUTE:
            return 'minute';
        case intervals_1.QUERY_INTERVAL.HOUR:
            return 'hour';
        case intervals_1.QUERY_INTERVAL.DAY:
            return 'day';
        case intervals_1.QUERY_INTERVAL.MONTH:
            return 'month';
        default:
            return null;
    }
};
exports.getMomentTimeUnitForQueryInterval = getMomentTimeUnitForQueryInterval;
var calculateAutoInterval = function (intervalMs) {
    if (intervalMs <= 5 * 1000) {
        return intervals_1.QUERY_INTERVAL.SECOND;
    }
    else if (intervalMs <= 3 * 60 * 60 * 1000) {
        return intervals_1.QUERY_INTERVAL.MINUTE;
    }
    else if (intervalMs <= 6 * 24 * 60 * 60 * 1000) {
        return intervals_1.QUERY_INTERVAL.HOUR;
    }
    else if (intervalMs <= 30 * 24 * 60 * 60 * 1000) {
        return intervals_1.QUERY_INTERVAL.DAY;
    }
    return intervals_1.QUERY_INTERVAL.MONTH;
};
exports.calculateAutoInterval = calculateAutoInterval;
var intervalToMilliseconds = function (interval) {
    switch (interval) {
        case intervals_1.QUERY_INTERVAL.SECOND:
            return 1000;
        case intervals_1.QUERY_INTERVAL.MINUTE:
            return 1000 * 60;
        case intervals_1.QUERY_INTERVAL.HOUR:
            return 1000 * 60 * 60;
        case intervals_1.QUERY_INTERVAL.DAY:
            return 1000 * 60 * 60 * 24;
        case intervals_1.QUERY_INTERVAL.MONTH:
            return 1000 * 60 * 60 * 24 * 30;
        default:
            return -1;
    }
};
exports.intervalToMilliseconds = intervalToMilliseconds;
//# sourceMappingURL=intervalUtils.js.map