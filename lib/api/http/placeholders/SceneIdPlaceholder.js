'use strict';

const StringPlaceholder = require('./StringPlaceholder')
;

module.exports = class SceneIdPlaceholder extends StringPlaceholder {

  constructor(name) {
    super('id', name);
  }
};