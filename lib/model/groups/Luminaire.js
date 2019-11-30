'use strict';

const Group = require('./Group')
  , types = require('../../types')
;


const ATTRIBUTES = [
  types.string({name: 'type', defaultValue: 'Luminaire'}),
  types.list({name: 'lights', minEntries: 1, listType: types.string({name: 'lightId'})}),
];


module.exports = class Luminaire extends Group {

  constructor(id) {
    super(ATTRIBUTES, id);
  }

  /** @return {Array.string} */
  get lights() {
    return this.getAttributeValue('lights');
  }
};