'use strict';

const Sensor = require('./Sensor')
  , ApiError = require('../../../ApiError')
;

// Hue Tap Switch
module.exports = class ZGPSwitch extends Sensor {

  constructor(data, id) {
    super('ZGPSwitch', data, id);
  }

  get on() {
    return this.config.on;
  }

  set on(value) {
    this._updateConfigAttribute('on', value);
  }

  get buttonevent() {
    return this.state.buttonevent;
  }

  // //TODO not sure that we can actually set these
  // set buttonevent(value) {
  //   // Bridge does nto enforce these values, but the following correspond to each of the 4 buttons on the Hue Tap
  //   if (value === 34 || value === 16 || value === 17 || value === 18) {
  //     this._updateStateAttribute('buttoneevent', value);
  //     return this;
  //   } else {
  //     //TODO
  //     throw new ApiError('Unsupported value as per Hue documentation, https://developers.meethue.com/develop/hue-api/supported-devices');
  //   }
  // }
};