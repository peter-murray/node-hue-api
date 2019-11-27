'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../types')
  , model = require('../model')
;

module.exports = class RuleIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'rule id', optional: false});
  }

  _getParameterValue(parameter) {
    if (model.isRuleInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
};