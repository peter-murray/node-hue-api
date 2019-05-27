'use strict';

const ApiError = require('../../ApiError')
  , ColorLight = require('./lights/ColorLight')
  , ExtendedColorLight = require('./lights/ExtendedColorLight')
  , ColorTemperatureLight = require('./lights/ColorTemperatureLight')
  , DimmableLight = require('./lights/DimmableLight')
;
//TODO OnOffLight


module.exports.create = function(data, id) {
  if (!data) {
    throw new ApiError('No data provided to build a device from');
  }

  if (data.type) {
    switch(data.type.toLowerCase()) {
      case 'color light':
        return new ColorLight(data, id);
      case 'extended color light':
        return new ExtendedColorLight(data, id);
      case 'color temperature light':
        return new ColorTemperatureLight(data, id);
      case 'dimmable light':
        return new DimmableLight(data, id);
      default:
        throw new ApiError(`Unknown type, ${data.type}`);
    }
  }
};