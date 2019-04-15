"use strict";

var _prunk = _interopRequireDefault(require("prunk"));

var _jsdom = require("jsdom");

var _chai = _interopRequireDefault(require("chai"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Mock Grafana modules that are not available outside of the core project
// Required for loading module.js
_prunk["default"].mock('./css/query-editor.css!', 'no css, dude.');

_prunk["default"].mock('app/plugins/sdk', {
  QueryCtrl: null
}); // Setup jsdom
// Required for loading angularjs


global.document = (0, _jsdom.jsdom)('<html><head><script></script></head><body></body></html>');
global.window = global.document.parentWindow; // Setup Chai

_chai["default"].should();

global.assert = _chai["default"].assert;
global.expect = _chai["default"].expect;
//# sourceMappingURL=test-main.js.map
