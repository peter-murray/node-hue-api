'use strict';

const BridgeObject = require('../BridgeObjectWithNumberId');

module.exports = class Device extends BridgeObject {

  constructor(data, id) {
    super(data,  id);
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
};
