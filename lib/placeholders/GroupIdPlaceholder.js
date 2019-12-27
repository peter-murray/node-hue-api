'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../types')
  , model = require('../model')
;

module.exports = class GroupIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'group id', optional: false});
  }

  _getParameterValue(parameter) {
    if (model.isGroupInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
};