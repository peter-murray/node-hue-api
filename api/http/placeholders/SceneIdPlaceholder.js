'use strict';

const StringPlaceholder = require('./StringPlaceholder')
;

module.exports = class SceneIdPlaceholder extends StringPlaceholder {

  constructor(id) {
    super('id', id);
  }
};