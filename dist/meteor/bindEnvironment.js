'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _meteorGlobals = require('@wekanteam/meteor-globals');

var Meteor = (0, _meteorGlobals.getGlobal)('meteor', 'Meteor');
exports.default = Meteor.bindEnvironment.bind(Meteor);