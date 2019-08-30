'use strict';

const Sensor = require('./Sensor');

// Hue Dimmer Switch
module.exports = class ZLLSwitch extends Sensor {

  constructor(data, id) {
    super('ZLLSwitch', data, id);
  }

  get on() {
    return this.config.on;
  }

  set on(value) {
    this._updateConfigAttribute('on', value);
    return this;
  }

  get battery() {
    return this.config.battery;
  }

  set battery(value) {
    this._updateConfigAttribute('battery', value);
    return this;
  }

  get alert() {
    return this.config.alert;
  }

  set alert(value) {
    this._updateConfigAttribute('alert', value);
    return this;
  }

  get buttonevent() {
    return this.config.buttonevent;
  }

  // //TODO not sure that we can actually set these
  // set buttonevent(value) {
  //   //TODO there is validation we could perform 1000, 1001, 1002 1003 for buttons 2000, 3000 and 4000
  //   this._updateStateAttribute('buttonevent', value);
  //   return this;
  // }

  get lastupdated() {
    return this.state.lastupdated;
  }
};