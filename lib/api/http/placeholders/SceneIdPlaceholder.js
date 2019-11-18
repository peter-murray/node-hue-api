'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../../../types')
;

module.exports = class SceneIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.string({name: 'scene id', optional: false});
  }
};