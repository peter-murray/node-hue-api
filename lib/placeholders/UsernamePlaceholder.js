'use strict';

const Placeholder = require('./Placeholder')
  , StringType = require('@peter-murray/hue-bridge-model').types.StringType
;

module.exports = class UsernamePlaceholder extends Placeholder {

  constructor(name) {
    super('username', name);
    this.typeDefinition = new StringType({name: 'username', minLength: 1, optional: false});
  }
};
