'use strict';

const ApiError = require('../../../ApiError');

module.exports.build = (data, id) => {

  if (! data) {
    throw new ApiError('Sensor data must be provided');
  }

  if (! data.type) {
    throw new ApiError('All sensors require a "type" parameter.');
  }

  // This will fail if the code is ever minimized, at which point could be replaced by a switch statement
  try {
    const SensorClass = require(`./${data.type}`);
    return new SensorClass(data, id);
  } catch (err) {
    throw new ApiError(`Failed to resolve a sensor class for type: ${data.type}`);
  }

};