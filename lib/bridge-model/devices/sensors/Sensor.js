'use strict';

const BridgeObject = require('../Device')
  , ApiError = require('../../../ApiError')
;

module.exports = class Sensor extends BridgeObject {

  constructor(type, data, id) {
    super(data, id);

    this._type = type;

    //TODO need to populate these from the data above
    this._configAttributes = Object.assign({}, data.config);
    this._stateAttributes = Object.assign({}, data.state);
  }

  get type() {
    return this._type;
  }

  get state() {
    return Object.assign({}, this._stateAttributes);
  }

  get config() {
    return Object.assign({}, this._configAttributes);
  }

  get swversion() {
    return this.getRawDataValue('swversion');
  }

  get lastupdated() {
    return this.state.lastupdated;
  }

  _updateStateAttribute(name, value) {
    //TODO add validation on name and value
    this._stateAttributes[name] = value;
  }

  _updateConfigAttribute(name, value) {
    //TODO add validation on name and value
    this._configAttributes[name] = value;
  }

  get payload() {
    const self = this
      , payload = {}
      ;

    ['name', 'modelid', 'swversion', 'uniqueid', 'manufacturername'].forEach(key => {
      const value = self.getRawDataValue(key);
      if (!value) {
        throw new ApiError(`Mandatory Sensor parameter '${key}' is missing.`);
      }
      payload[key] = value;
    });

    const state = this.state;
    if (Object.keys(state).length > 0) {
      payload.state = state;
    }

    const config = this.config;
    if (Object.keys(config).length > 0) {
      payload.config = config;
    }

    return payload;
  }
};