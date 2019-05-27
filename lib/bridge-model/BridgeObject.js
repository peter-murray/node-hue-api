'use strict';

module.exports = class BridgeObject {

  //TODO not all objects have type, modelid, etc..., like groups and schedules

  constructor(data, id) {
    this._rawData = Object.assign({}, data);
    this._id = id;
  }

  get name() {
    return this.getRawDataValue('name');
  }

  //TODO this is here for schedule, see that it really belongs here
  set name(value) {
    return this._updateRawDataValue('name', value);
  }

  get id() {
    return this._id;
  }

  get bridgeData() {
    // Return a copy so that it cannot be modified from outside
    return Object.assign({}, this._rawData);
  }

  toString() {
    return `id: ${this.id}`;
  }

  getRawDataValue(key) {
    return this._rawData[key];
  }

  _updateRawDataValue(name, value) {
    this._rawData[name] = value;
    return this;
  }
};
