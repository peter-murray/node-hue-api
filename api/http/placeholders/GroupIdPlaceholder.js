'use strict';

const NumberPlaceholder = require('./NumberPlaceholder')
;

module.exports = class GroupIdPlaceholder extends NumberPlaceholder {

  constructor(id) {
    super('id', id);
  }
};