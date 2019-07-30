'use strict';

const lightStates = require('./lightstate/index')
  , sensors = require('./devices/sensors')
  , Scene = require('./Scene')
;

module.exports = {
  lightStates: lightStates,
  sensors: sensors,
  Scene: Scene
};
