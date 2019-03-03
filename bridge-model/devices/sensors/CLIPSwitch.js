'use strict';

const CLIPSensor = require('./CLIPSensor');

module.exports = class CLIPSwitch extends CLIPSensor {

  constructor(data, id) {
    //TODO perform validation on data values?
    super('CLIPSwitch', data, id);
  }

  get buttonevent() {
    return this.state['buttonevent'];
  }

  set buttonevent(value) {
    this._updateStateAttribute('buttonevent', value);
    return this;
  }
};