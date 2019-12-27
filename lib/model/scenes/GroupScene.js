'use strict';

const Scene = require('./Scene')
  , types = require('../../types')
;

const ATTRIBUTES = [
  types.string({name: 'group'}),
  types.list({name: 'lights', optional: true, minEntries: 1, listType: types.string({name: 'lightId'})}),
  types.object({name: 'lightstates'}),
];


module.exports = class GroupScene extends Scene {

  constructor(id) {
    super(ATTRIBUTES, 'GroupScene', id);
  }

  get group() {
    return this.getAttributeValue('group');
  }

  set group(id) {
    return this.setAttributeValue('group', id);
  }

  get lights() {
    return this.getAttributeValue('lights');
  }

  get lightstates() {
    return this.getAttributeValue('lightstates');
  }
};