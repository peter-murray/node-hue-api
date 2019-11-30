'use strict';

const Group = require('./Group')
  , types = require('../../types')
;

// TODO Do not have an example of this the API documentation is not correct as it refers to a standard LightGroup definition

const ATTRIBUTES = [
  types.string({name: 'type', defaultValue: 'Lightsource'}),
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

  // TODO need to get one of these to test if we can set on it
  // set lights(value) {
  //   return this.setAttributeValue('lights', value);
  // }
};