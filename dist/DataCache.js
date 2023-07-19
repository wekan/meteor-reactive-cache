'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bindEnvironment = require('./meteor/bindEnvironment');

var _bindEnvironment2 = _interopRequireDefault(_bindEnvironment);

var _tracker = require('./meteor/tracker');

var _tracker2 = _interopRequireDefault(_tracker);

var _ReactiveCache = require('./ReactiveCache');

var _ReactiveCache2 = _interopRequireDefault(_ReactiveCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataCache = function () {
  function DataCache(getData, options) {
    _classCallCheck(this, DataCache);

    this.options = Object.assign({
      timeout: 60 * 1000 // 60 seconds
    }, typeof options === 'function' ? { compare: options } : options);

    this.getData = getData;
    this.cache = new _ReactiveCache2.default(this.options.compare, function () {
      return false;
    });
    this.timeouts = {};
    this.computations = {};
  }

  _createClass(DataCache, [{
    key: 'ensureComputation',
    value: function ensureComputation(key) {
      var _this = this;

      if (this.timeouts[key]) {
        clearTimeout(this.timeouts[key]);
        delete this.timeouts[key];
      }
      if (this.computations[key] && !this.computations[key].stopped) return;
      this.computations[key] = _tracker2.default.nonreactive(function () {
        return _tracker2.default.autorun(function () {
          return _this.cache.set(key, _this.getData(key));
        });
      });

      // stop the computation if the key doesn't have any dependants
      this.computations[key].onInvalidate(function () {
        return _this.checkStop(key);
      });
    }
  }, {
    key: 'checkStop',
    value: function checkStop(key) {
      var _this2 = this;

      if (this.cache.ensureDependency(key).hasDependents()) return;
      if (this.timeouts[key]) {
        clearTimeout(this.timeouts[key]);
        delete this.timeouts[key];
      }
      this.timeouts[key] = setTimeout((0, _bindEnvironment2.default)(function () {
        if (!_this2.computations[key]) return;
        _this2.computations[key].stop();
        delete _this2.computations[key];
        _this2.cache.del(key);
      }), this.options.timeout);
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _this3 = this;

      if (!_tracker2.default.currentComputation) {
        var _data = this.cache.get(key);
        if (_data == null) {
          _data = this.getData(key);
          this.cache.set(key, _data);
          this.checkStop(key);
        }
        return _data;
      }
      this.ensureComputation(key);
      var data = this.cache.get(key);
      _tracker2.default.currentComputation.onStop(function () {
        return _this3.checkStop(key);
      });
      return data;
    }
  }]);

  return DataCache;
}();

exports.default = DataCache;