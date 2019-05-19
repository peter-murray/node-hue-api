'use strict';

const BridgeObject = require('./BridgeObject');

module.exports = class BridgeObjectWithNumberId extends BridgeObject {

  constructor(data, id) {
    super(data, Number(id));
  }
};
