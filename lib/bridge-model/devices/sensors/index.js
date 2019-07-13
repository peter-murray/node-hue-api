'use strict';

const ApiError = require('../../../ApiError')
  , CLIPGenericFlag = require('./CLIPGenericFlag')
  , CLIPGenericStatus = require('./CLIPGenericStatus.js')
  , CLIPHumidity = require('./CLIPHumidity')
  , CLIPLightlevel = require('./CLIPLightlevel')
  , CLIPOpenClose = require('./CLIPOpenClose')
  , CLIPPresence = require('./CLIPPresence')
  , CLIPSwitch = require('./CLIPSwitch')
  , CLIPTemperature = require('./CLIPTemperature')
;


function buildSensor(data, id) {
  if (! data) {
    throw new ApiError('Sensor data must be provided');
  }

  if (! data.type) {
    throw new ApiError('All sensors require a "type" parameter.');
  }

  const type = data.type;

  // TODO refactor this once we expose the Zigbee sensors too, as we will have to have required them all at that point.
  // This will fail if the code is ever minimized, at which point could be replaced by a switch statement
  try {
    const SensorClass = require(`./${type}`);
    return new SensorClass(data, id);
  } catch (err) {
    throw new ApiError(`Failed to resolve a sensor class for type: ${type}`);
  }
}


module.exports = {
  build: buildSensor,

  clip: {
    GenericFlag: CLIPGenericFlag,
    GenericStatus: CLIPGenericStatus,
    Humidity: CLIPHumidity,
    Lightlevel: CLIPLightlevel,
    OpenClose: CLIPOpenClose,
    Presence: CLIPPresence,
    Switch: CLIPSwitch,
    Temperature: CLIPTemperature,
  }
};