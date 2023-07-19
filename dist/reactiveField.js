'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DataCache = require('./DataCache');

var _DataCache2 = _interopRequireDefault(_DataCache);

var _ejson = require('./meteor/ejson');

var _ejson2 = _interopRequireDefault(_ejson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (fn, compare) {
  var cache = new _DataCache2.default(function (key) {
    return fn.apply(undefined, _toConsumableArray(_ejson2.default.parse(key)));
  }, compare);
  var resolver = function resolver() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return cache.get(_ejson2.default.stringify(args));
  };
  resolver.cache = cache;
  return resolver;
};