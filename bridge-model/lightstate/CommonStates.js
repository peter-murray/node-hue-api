'use strict';

const States = require('./States');

module.exports = class CommonStates extends States {

  constructor() {
    super(
      'on',
      'bri',
      'hue',
      'sat',
      'xy',
      'ct',
      'alert',
      'effect',
      'transitiontime',
      'bri_inc',
      'sat_inc',
      'hue_inc',
      'ct_inc',
      'xy_inc',
      Array.from(arguments)
    );
  }

  on(on) {
    if (on !== undefined) {
      return this._setStateValue('on', on);
    } else {
      return this._setStateValue('on', true);
    }
  }

  off() {
    return this._setStateValue('on', false);
  }

  bri(value) {
    return this._setStateValue('bri', value);
  }

  hue (value) {
    return this._setStateValue('hue', value);
  }

  sat (value) {
    return this._setStateValue('sat', value);
  }

  xy(x, y) {
    if (Array.isArray(x)) {
      return this._setStateValue('xy', x);
    } else {
      return this._setStateValue('xy', [x, y]);
    }
  }

  ct(value) {
    return this._setStateValue('ct', value);
  }

  alert(value) {
    return this._setStateValue('alert', value);
  }

  effect(value) {
    return this._setStateValue('effect', value);
  }

  transitiontime(value) {
    return this._setStateValue('transitiontime', value);
  }

  bri_inc(inc) {
    return this._setStateValue('bri_inc', inc);
  }

  sat_inc(inc) {
    return this._setStateValue('sat_inc', inc);
  }

  hue_inc(inc) {
    return this._setStateValue('hue_inc', inc);
  }

  ct_inc(inc) {
    return this._setStateValue('ct_inc', inc);
  }

  xy_inc(x_inc, y_inc) {
    if (Array.isArray(x_inc)) {
      return this._setStateValue('xy_inc', x_inc);
    } else {
      return this._setStateValue('xy_inc', [x_inc, y_inc]);
    }
  }
};

//TODO decide on this these might be nice helpers but do they really belong here
States.prototype.transitionTime = States.prototype.transitiontime;
States.prototype.incrementBrightness = States.prototype.bri_inc;
States.prototype.incrementSaturation = States.prototype.sat_inc;
States.prototype.incrementHue = States.prototype.hue_inc;
States.prototype.incrementCt = States.prototype.ct_inc;
States.prototype.incrementColorTemp = States.prototype.ct_inc;
States.prototype.incrementColourTemp = States.prototype.ct_inc;
