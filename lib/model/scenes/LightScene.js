'use strict';

const Scene = require('./Scene')
  , types = require('../../types')
;

const ATTRIBUTES = [
  types.list({name: 'lights', minEntries: 1, listType: types.string({name: 'lightId'})}),
  types.object({name: 'lightstates'}),
];


module.exports = class LightScene extends Scene {

  constructor(id) {
    super(ATTRIBUTES, 'LightScene', id);
  }

  get lights() {
    return this.getAttributeValue('lights');
  }

  set lights(lightIds) {
    return this.setAttributeValue('lights', lightIds);
  }

  get lightstates() {
    return this.getAttributeValue('lightstates');
  }

  set lightstates(value) {
    return this.setAttributeValue('lightstates', value);
  }
};