'use strict';

const BridgeObject = require('../BridgeObject')
  , types = require('../../types')
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


module.exports = class Scene extends BridgeObject {

  constructor(attributes, type, id) {
    super(BridgeObject.mergeAttributes(ATTRIBUTES, attributes), id);

    this.setAttributeValue('type', type);
  }

  get name() {
    return this.getAttributeValue('name');
  }

  set name(value) {
    return this.setAttributeValue('name', value)
  }

  // get lightstates() {
  //   return this.getAttributeValue('lightstates');
  // }
  //
  // set lightstates(value) {
  //   //TODO needs to be updated
  //
  //   // //TODO needs to be an {id: {}, id: {}} type object
  //   // this._updateRawDataValue('type', null);
  //   // return this._updateRawDataValue('lightstates', value);
  // }

  get type() {
    return this.getAttributeValue('type');
  }

  get owner() {
    return this.getAttributeValue('owner');
  }

  get recycle() {
    return this.getAttributeValue('recycle');
  }

  set recycle(value) {
    return this.setAttributeValue('recycle', value);
  }

  get locked() {
    return this.getAttributeValue('locked');
  }

  get appdata() {
    // Complex object of version, data
    return this.getAttributeValue('appdata');
  }

  set appdata(value) {
    return this.setAttributeValue('appdata', value);
  }

  set picture(value) {
    return this.setAttributeValue('picture', value);
  }

  get picture() {
    return this.getAttributeValue('picture');
  }

  get lastupdated() {
    return this.getAttributeValue('lastupdated');
  }

  get version() {
    return this.getAttributeValue('version');
  }
};