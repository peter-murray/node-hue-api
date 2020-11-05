'use strict';

const Placeholder = require('./Placeholder')
  , instanceChecks = require('@peter-murray/hue-bridge-model').model.instanceChecks
  , UInt16Type = require('@peter-murray/hue-bridge-model').types.UInt16Type
;

module.exports = class SensorIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = new UInt16Type({name: 'sensor id', optional: false});
  }

  _getParameterValue(parameter) {
    if (instanceChecks.isSensorInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
};