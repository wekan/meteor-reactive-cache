'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tracker = require('./meteor/tracker');

var _tracker2 = _interopRequireDefault(_tracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReactiveCache = function () {
  function ReactiveCache(compare, shouldStop) {
    _classCallCheck(this, ReactiveCache);

    this.shouldStop = shouldStop || function () {
      return true;
    };
    this.compare = compare || function (a, b) {
      return a === b;
    };
    this.values = {};
    this.deps = {};
  }

  _createClass(ReactiveCache, [{
    key: 'ensureDependency',
    value: function ensureDependency(key) {
      if (!this.deps[key]) this.deps[key] = new _tracker2.default.Dependency();
      return this.deps[key];
    }
  }, {
    key: 'checkDeletion',
    value: function checkDeletion(key) {
      var dep = this.ensureDependency(key);
      if (dep.hasDependents()) return false;
      delete this.values[key];
      delete this.deps[key];
      return true;
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this = this;

      Object.keys(this.values).forEach(function (key) {
        return _this.del(key);
      });
    }
  }, {
    key: 'del',
    value: function del(key) {
      var dep = this.ensureDependency(key);
      delete this.values[key];
      if (this.checkDeletion(key)) return;
      dep.changed();
    }
  }, {
    key: 'set',
    value: function set(key, data, bypassCompare) {
      var dep = this.ensureDependency(key);
      var current = this.values[key];
      this.values[key] = data;
      if (!this.compare(current, data) || bypassCompare) {
        dep.changed();
      }
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _this2 = this;

      var data = this.values[key];
      if (_tracker2.default.currentComputation) {
        var dep = this.ensureDependency(key);
        dep.depend();
        _tracker2.default.currentComputation.onStop(function () {
          if (!_this2.shouldStop(key)) return;
          _this2.checkDeletion(key);
        });
      }
      return data;
    }
  }]);

  return ReactiveCache;
}();

exports.default = ReactiveCache;