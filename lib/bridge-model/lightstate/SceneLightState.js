'use strict';

const BaseStates = require('./BaseStates');

module.exports = class LightState extends BaseStates {

  constructor() {
    super();
  }
};

//TODO this is a throw back to the old API
module.exports.create = () => {
  return new module.exports();
};