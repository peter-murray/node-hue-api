'use strict';

const NumberPlaceholder = require('./NumberPlaceholder');


module.exports = class LightIdPlaceholder extends NumberPlaceholder {

  constructor(name) {
    super('id', name);
  }
};