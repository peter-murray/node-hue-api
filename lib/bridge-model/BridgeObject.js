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
    return `${this.constructor.name}\n  id: ${this.id}`;
  }

  toStringDetailed() {
    let result = this.toString();

    Object.keys(this._rawData).forEach(key => {
      result += `\n  ${key}: ${JSON.stringify(this._rawData[key])}`;
    });

    return result;
  }

  getRawDataValue(key) {
    //TODO use dot notation to get nested values
    const path = key.split('.');

    let target = this._rawData
      , value = null
    ;

    path.forEach(part => {
      if (target != null) {
        value = target[part];
        target = value;
      } else {
        target = null;
      }
    });

    return value;
    // return this._rawData[key];
  }

  _updateRawDataValue(name, value) {
    this._rawData[name] = value;
    return this;
  }
};
