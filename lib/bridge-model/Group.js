'use strict';

const BridgeObject = require('./BridgeObjectWithNumberId');

module.exports = class Group extends BridgeObject {

  get lights() {
    const raw = this.getRawDataValue('lights');

    if (raw) {
      const result = [];
      raw.forEach(value => {
        result.push(Number(value));
      });
      return result;
    } else {
      return raw;
    }
  }

  get type() {
    return this.getRawDataValue('type');
  }

  get action() {
    //TODO this is a lightstate
    return this.getRawDataValue('action');
  }

  get recycle() {
    return this.getRawDataValue('recycle');
  }

  get sensors() {
    //TODO check what this actually returns when there is one
    return this.getRawDataValue('sensors');
  }

  get state() {
    return this.getRawDataValue('state');
  }

  get class() {
    return this.getRawDataValue('class') || 'Other';
  }

  get locations() {
    // TODO locations are specific to a room
    return this.getRawDataValue('locations');
  }

  get stream() {
    return this.getRawDataValue('stream');
  }

  get modelid() {
    return this.getRawDataValue('modelid');
  }

  get uniqueid() {
    return this.getRawDataValue('uniqueid');
  }
};
