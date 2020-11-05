'use strict';

const Placeholder = require('./Placeholder')
  , instanceChecks = require('@peter-murray/hue-bridge-model').model.instanceChecks
  , StringType = require('@peter-murray/hue-bridge-model').types.StringType
;

module.exports = class SceneIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = new StringType({name: 'scene id', optional: false});
  }

  _getParameterValue(parameter) {
    if (instanceChecks.isSceneInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
};