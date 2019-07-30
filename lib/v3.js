'use strict';

const api = require('./api/index')
  , discovery = require('./api/discovery/index')
  , model = require('./bridge-model/index')
;

// Definition of the v3 API for node-hue-api
module.exports = {
  api: api,
  discovery: discovery,

  lightStates: model.lightStates,
  sensors: model.sensors,
  Scene: model.Scene,
};