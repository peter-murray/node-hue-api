'use strict';

const Placeholder = require('./Placeholder')
  , types = require('../../../types')
;


module.exports = class ResourceLinkPlaceholder extends Placeholder {

  constructor(name) {
    super('id', name);
    this.typeDefinition = types.uint16({name: 'resourcelink id', optional: false});
  }
};