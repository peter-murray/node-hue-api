'use strict';

const NumberPlaceholder = require('./NumberPlaceholder')
;

module.exports = class ScheduleIdPlaceholder extends NumberPlaceholder {

  constructor(name) {
    super('id', name);
  }
};