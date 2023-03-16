"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestHandler = (function () {
    function RequestHandler(backendService, headers, withCredentials) {
        this.backendService = backendService;
        this.headers = headers;
        this.withCredentials = withCredentials;
    }
    RequestHandler.prototype.doRequest = function (options) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        return this.backendService.datasourceRequest(options);
    };
    return RequestHandler;
}());
exports.default = RequestHandler;
//# sourceMappingURL=requestHandler.js.map