'use strict';

const lightStates = require('./lightstate/index')
  , sensors = require('./devices/sensors')
;

module.exports = {
  lightStates: lightStates,
  sensors: sensors,
};
