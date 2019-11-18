'use strict';

const CommonStates = require('./CommonStates.js');


module.exports = class LightState extends CommonStates {

  constructor() {
    super('rgb');
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Helper States that get converted into the standard light state values
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  white(temp, bri) {
    this.ct(temp);
    this.brightness(bri);
    return this;
  }

  hsb(hue, saturation, brightness) {
    this.hue(this._convertDegreesToStateValue(hue, 'hue'));
    this.brightness(brightness);
    this.saturation(saturation);
    return this;
  }

  hsl(hue, saturation, luminosity) {
    const temp = saturation * (luminosity < 50 ? luminosity : 100 - luminosity) / 100
      , satValue = Math.round(200 * temp / (luminosity + temp)) | 0
      , bri = Math.round(temp + luminosity)
    ;

    this.brightness(bri);
    this.hue(this._convertDegreesToStateValue(hue, 'hue'));
    this.sat(this._convertPercentageToStateValue(satValue, 'sat'));

    return this;
  }

  rgb(red, green, blue) {
    // The conversion to rgb is now done in the xy space, but to do so requires knowledge of the limits of the light's
    // color gamut.
    // To cater for this, we store the rgb value requested, and convert it to xy when the user applies it.

    if (Array.isArray(red)) {
      return this._setStateValue('rgb', red);
    } else {
      return this._setStateValue('rgb', [red, green, blue]);
    }
  }
};
