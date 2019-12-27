'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../types')
  , model = require('../model')
;

module.exports = class ScheduleIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'schedule id', optional: false});
  }

  _getParameterValue(parameter) {
    if (model.isScheduleInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
};