'use strict';

const api = require('./api/index')
  , discovery = require('./api/discovery/index')
;

// Definition of the v3 API for node-hue-api
module.exports = {
  hue: api,
  discovery: discovery,
};