'use strict';

const BridgeObjectWithId = require('../BridgeObjectWithId')
  , types = require('../../types')
  , util = require('../../util')
;


const COMMON_ATTRIBUTES = [
  types.int8({name: 'id'}),
  types.string({name: 'name'}),
  types.string({name: 'type'}),
  types.string({name: 'modelid'}),
  types.string({name: 'manufacturername'}),
  types.string({name: 'uniqueid'}),
  types.string({name: 'swversion'}),
  types.string({name: 'swconfigid'}), //TODO this is not present on many devices
  types.object({name: 'capabilities'}),


  // TODO this is for zllswitch, need to check other z** sensors and refacotr accordingly
  types.string({name: 'productname'}),
  types.object({name: 'swupdate'}),
  types.string({name: 'diversityid'}),

  //TODO this is for CLIP, need to inject this in the constructor
  types.boolean({name: 'recycle'}),
];

const COMMON_STATE_ATTRIBUTES = [
  types.string({name: 'lastupdated', defaultValue: 'none'}),
];

const COMMON_CONFIG_ATTRIBUTES = [
  types.boolean({name: 'on', defaultValue: true}),
];

module.exports = class Sensor extends BridgeObjectWithId {

  //TODO consider removing data from here as we have _populate to do this
  constructor(configAttributes, stateAttributes, id, data) {
    const stateAttribute = types.object({
        name: 'state',
        types: util.flatten(COMMON_STATE_ATTRIBUTES, stateAttributes)
      })
      , configAttribute = types.object({
        name: 'config',
        types: util.flatten(COMMON_CONFIG_ATTRIBUTES, configAttributes)
      })
      , allAttributes = util.flatten(COMMON_ATTRIBUTES, stateAttribute, configAttribute)
    ;

    super(allAttributes, id);
    this._populate(data);

    // inject the name of the class as the type for the sensor
    this.setAttributeValue('type', this.constructor.name);

    this._configAttributes = {};
    configAttribute.types.forEach(attr => {
      this._configAttributes[attr.name] = attr;
    });

    this._stateAttributes = {};
    stateAttribute.types.forEach(attr => {
      this._stateAttributes[attr.name] = attr;
    });
  }

  set name(value) {
    return this.setAttributeValue('name', value);
  }

  get name() {
    return this.getAttributeValue('name');
  }

  get modelid() {
    return this.getAttributeValue('modelid');
  }

  get manufacturername() {
    return this.getAttributeValue('manufacturername');
  }

  get swversion() {
    return this.getAttributeValue('swversion');
  }

  get swconfigid() {
    return this.getAttributeValue('swconfigid');
  }

  get type() {
    return this.getAttributeValue('type');
  }

  get uniqueid() {
    return this.getAttributeValue('uniqueid');
  }

  get capabilities() {
    return this.getAttributeValue('capabilities');
  }

  get lastupdated() {
    return this.getStateAttributeValue('lastupdated');
  }

  get on() {
    return this.getConfigAttributeValue('on');
  }

  set on(value) {
    this._updateConfigAttributeValue('on', value);
    return this;
  }

  getConfig() {
    return this.getAttributeValue('config');
  }

  getConfigAttribute(name) {
    return this._configAttributes[name];
  }

  getStateAttribute(name) {
    return this._stateAttributes[name];
  }

  getStateAttributeNames() {
    return Object.keys(this._stateAttributes);
  }

  getConfigAttributeValue(name) {
    const config = this.getAttributeValue('config')
      , definition = this.getConfigAttribute(name)
    ;

    if (definition) {
      return definition.getValue(config[name]);
    } else {
      const value = config[name];
      if (value !== undefined) {
        return value;
      }
    }

    return null;
  }

  getStateAttributeValue(name) {
    const state = this.getAttributeValue('state')
      , definition = this.getStateAttribute(name)
    ;

    if (definition) {
      return definition.getValue(state[name]);
    } else {
      const value = state[name];
      if (value !== undefined) {
        return value;
      }
    }

    return null;
  }

  _updateStateAttributeValue(name, value) {
    let state = this.getAttributeValue('state') || {};
    state[name] = value;

    // The object we are working on is a copy, so we need to set it back on the sensor, which will use the types to validate
    return this.setAttributeValue('state', state);
  }

  _updateConfigAttributeValue(name, value) {
    const config = this.getAttributeValue('config') || {};
    config[name] = value;

    // The object we are working on is a copy, so we need to set it back on the sensor, which will use the types to validate
    return this.setAttributeValue('config', config);
  }

  getHuePayload() {
    const data = super.getHuePayload();

    Sensor.removeNullValues(data.config);
    Sensor.removeNullValues(data.state);

    return data;
  }



  //TODO util function
  static removeNullValues(data) {
    if (data) {
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value === null) {
          delete data[key];
        }
      });
    }
  }
};


