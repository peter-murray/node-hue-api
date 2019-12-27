'use strict';

const expect = require('chai').expect
  , rgb = require('./rgb')
  , colorGamut = require('./model/colorGamuts')
;

describe('RGB Conversion', () => {

  it('should apply RGB values for Hue Bulb', () => {
    const RGB = [10, 10, 10];

    const xy = rgb.rgbToXY(RGB, colorGamut.B);
    expect(xy).to.have.members([0.33618074375880236, 0.3603696362840742]);
  });

  it('should fail when no color gamut provided', () => {
    try {
      rgb.rgbToXY([0, 0, 0], null);
      expect.fail('should have thrown an error');
    } catch (err) {
      expect(err.message).to.contain('No color gamut provided');
    }
  });
});