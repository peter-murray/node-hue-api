'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../../../types')
;

module.exports = class ScheduleIdPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'schedule id', optional: false});
  }
};