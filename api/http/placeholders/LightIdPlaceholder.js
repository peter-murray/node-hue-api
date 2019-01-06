'use strict';

const NumberPlaceholder = require('./NumberPlaceholder');


module.exports = class LightIdPlaceholder extends NumberPlaceholder {

  constructor(id) {
    super('id', id);
  }
};