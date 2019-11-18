'use strict';

const BaseStates = require('./BaseStates');

class CommonStates extends BaseStates {

  constructor() {
    super(
      'alert',
      'bri_inc',
      'sat_inc',
      'hue_inc',
      'ct_inc',
      'xy_inc',
      Array.from(arguments)
    );
  }

  alert(value) {
    return this._setStateValue('alert', value);
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

  alertLong() {
    return this.alert('lselect');
  }

  alertShort() {
    return this.alert('select');
  }

  alertNone() {
    return this.alert('none');
  }
}
module.exports = CommonStates;

//TODO decide on this these might be nice helpers but do they really belong here
CommonStates.prototype.incrementBrightness = CommonStates.prototype.bri_inc;
CommonStates.prototype.incrementSaturation = CommonStates.prototype.sat_inc;
CommonStates.prototype.incrementHue = CommonStates.prototype.hue_inc;
CommonStates.prototype.incrementCt = CommonStates.prototype.ct_inc;
CommonStates.prototype.incrementColorTemp = CommonStates.prototype.ct_inc;
