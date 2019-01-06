'use strict';

//TODO remove this or BridgeObject

const BridgeObject = require('../bridgeObject');

class Device extends BridgeObject {

  constructor(data, id) {
    super(data,  id);
  }

  // get name() {
  //   return this.getRawDataValue('name');
  // }

  // get type() {
  //   return this.getRawDataValue('type');
  // }
  //
  // get modelid() {
  //   return this.getRawDataValue('modelid');
  // }
  //
  // get manufacturername() {
  //   return this.getRawDataValue('manufacturername');
  // }
  //
  // get uniqueid() {
  //   return this.getRawDataValue('uniqueid');
  // }

  // get productid() {
  //   return this.getRawDataValue('productId');
  // }
}

module.exports = Device;

