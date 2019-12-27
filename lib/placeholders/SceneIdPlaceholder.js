'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../types')
  , model = require('../model')
;

module.exports = class SceneIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.string({name: 'scene id', optional: false});
  }

  _getParameterValue(parameter) {
    if (model.isSceneInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
};