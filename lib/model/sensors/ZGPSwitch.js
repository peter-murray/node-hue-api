'use strict';

const Sensor = require('./Sensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [];

const STATE_ATTRIBUTES = [
  types.uint16({name: 'buttonevent'})
];


// Hue Tap Switch - Zigbee Green Power Switch
module.exports = class ZGPSwitch extends Sensor {

  constructor(id) {
    super(CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get buttonevent() {
    return this.getStateAttributeValue('buttonevent');
  }

  // //TODO not sure that we can actually set these, create a test to see
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