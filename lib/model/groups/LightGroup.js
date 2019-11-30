'use strict';

const Group = require('./Group')
  , types = require('../../types')
;

const ATTRIBUTES = [
  types.string({name: 'type', defaultValue: 'LightGroup'}),
  types.list({name: 'lights', minEntries: 1, listType: types.string({name: 'lightId'})}),
];

module.exports = class LightGroup extends Group {

  constructor(id) {
    super(ATTRIBUTES, id);
  }

  set lights(value) {
    return this.setAttributeValue('lights', value);
  }

  /** @return {Array.string} */
  get lights() {
    return this.getAttributeValue('lights');
  }
};