'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../types')
;


module.exports = class UsernamePlaceholder extends Placeholder {

  constructor(name) {
    super('username', name);
    this.typeDefinition = types.string({name: 'username', minLength: 1, optional: false});
  }
};
