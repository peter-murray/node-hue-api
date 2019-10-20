'use strict';

const ApiError = require('../../../ApiError')
  , ColorLight = require('./ColorLight')
  , ExtendedColorLight = require('./ExtendedColorLight')
  , ColorTemperatureLight = require('./ColorTemperatureLight')
  , DimmableLight = require('./DimmableLight')
  , OnOffLight = require('./OnOffLight')
;


module.exports.create = function(data, id) {
  if (!data) {
    throw new ApiError('No data provided to build a device from');
  }

  if (data.type) {
    const type = data.type.toLowerCase();

    switch(type) {
      case 'color light':
        return new ColorLight(data, id);

      case 'extended color light':
        return new ExtendedColorLight(data, id);

      case 'color temperature light':
        return new ColorTemperatureLight(data, id);

      case 'dimmable light':
        return new DimmableLight(data, id);

      default:
        // Fall back to using regex matching before reporting an unknown light type
        if (/^on\/off/.test(type)) {
          return new OnOffLight(data, id);
        } else if (/^dimmable/.test(type)) {
          return new DimmableLight(data, id);
        }

        throw new ApiError(`Unknown type, ${data.type}`);
    }
  }
};