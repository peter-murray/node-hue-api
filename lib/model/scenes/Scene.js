'use strict';

const BridgeObjectWithId = require('../BridgeObjectWithId')
  , types = require('../../types')
  , util = require('../../util')
;

const ATTRIBUTES = [
  types.string({name: 'id', min: 1, max: 16}),
  types.string({name: 'name', min: 1, max: 32}),
  types.choice({name: 'type', validValues: ['LightScene', 'GroupScene'], defaultValue: 'LightScene'}),
  types.string({name: 'owner'}),
  types.boolean({name: 'recycle', defaultValue: false}),
  types.boolean({name: 'locked'}),
  types.object({name: 'appdata', types: [types.int8({name: 'version'}), types.string({name: 'data', min: 1, max: 16, optional: true})]}),
  types.string({name: 'picture', min: 0, max: 16}),
  types.string({name: 'lastupdated'}), //TODO this is a time stamp but it can be treated as a string here
  types.int8({name: 'version'}),
];


module.exports = class Scene extends BridgeObjectWithId {

  constructor(attributes, type, id) {
    super(util.flatten(ATTRIBUTES, attributes), id);

    this.setAttributeValue('type', type);
  }

  /**
   * @returns {String}
   */
  get name() {
    return this.getAttributeValue('name');
  }

  /**
   * @param {string} value
   * @returns {Scene}
   */
  set name(value) {
    return this.setAttributeValue('name', value)
  }

  /**
   * @returns {String}
   */
  get type() {
    return this.getAttributeValue('type');
  }

  /**
   *
   * @returns {String}
   */
  get owner() {
    return this.getAttributeValue('owner');
  }

  /**
   * @returns {boolean}
   */
  get recycle() {
    return this.getAttributeValue('recycle');
  }

  /**
   *
   * @param {boolean} value
   * @returns {Scene}
   */
  set recycle(value) {
    return this.setAttributeValue('recycle', value);
  }

  /**
   * @returns {boolean}
   */
  get locked() {
    return this.getAttributeValue('locked');
  }

  /**
   * @typedef AppData
   * @property {number} version
   * @property {string} data
   *
   * @returns {AppData}
   */
  get appdata() {
    // Complex object of version, data
    return this.getAttributeValue('appdata');
  }

  /**
   * @param {AppData} value
   * @returns {Scene}
   */
  set appdata(value) {
    return this.setAttributeValue('appdata', value);
  }

  /**
   * @param {string} value
   * @returns {Scene}
   */
  set picture(value) {
    return this.setAttributeValue('picture', value);
  }

  /**
   * @returns {String}
   */
  get picture() {
    return this.getAttributeValue('picture');
  }

  /**
   * @returns {String}
   */
  get lastupdated() {
    return this.getAttributeValue('lastupdated');
  }

  /**
   * @returns {number}
   */
  get version() {
    return this.getAttributeValue('version');
  }
};