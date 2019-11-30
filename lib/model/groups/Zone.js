'use strict';

const Group = require('./Group')
  , types = require('../../types')
;


const ATTRIBUTES = [
  types.string({name: 'type', defaultValue: 'Zone'}),
  types.choice({name: 'class', defaultValue: 'Other', validValues: Group.getAllGroupClasses()}),
  types.list({name: 'lights', minEntries: 0, listType: types.string({name: 'lightId'})}),
];


module.exports = class Zone extends Group {

  constructor(id) {
    super(ATTRIBUTES, id);
  }

  /** @return {Array.string} */
  get lights() {
    return this.getAttributeValue('lights');
  }

  set lights(value) {
    return this.setAttributeValue('lights', value);
  }

  /**
   * @param value {string}
   * @returns {Zone}
   */
  set class(value) {
    return this.setAttributeValue('class', value);
  }

  /** @returns {string} */
  get class() {
    return this.getAttributeValue('class');
  }
};