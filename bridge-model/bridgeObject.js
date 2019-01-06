'use strict';

class BridgeObject {

  constructor(data, id) {
    this._id = Number(id); //TODO this is an assumption that might not hold true
    this._rawData = Object.assign({}, data);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.getRawDataValue('name');
  }

  get type() {
    return this.getRawDataValue('type');
  }

  get modelid() {
    return this.getRawDataValue('modelid');
  }

  get manufacturername() {
    return this.getRawDataValue('manufacturername');
  }

  get uniqueid() {
    return this.getRawDataValue('uniqueid');
  }

  // TODO validate that this is required
  get bridgeData() {
    // return Object.assign({}, this._rawData);
    //TODO might need to be a copy
    return this._rawData;
  }

  getRawDataValue(key) {
    return this.bridgeData[key];
  }

  toString() {
    return `id: ${this.id}`;
  }
}
module.exports = BridgeObject;
