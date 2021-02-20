import { expect } from 'chai';
import { rgbToXY } from './rgb';

const COLOR_GAMUT_B = {
  red: {x: 0.675, y: 0.322},
  green: {x: 0.409, y: 0.518},
  blue: {x: 0.167, y: 0.04},
};

describe('RGB Conversion', () => {

  it('should apply RGB values for Hue Bulb', () => {
    const RGB = [10, 10, 10];

    const xy = rgbToXY(RGB, COLOR_GAMUT_B);
    expect(xy).to.have.members([0.33618074375880236, 0.3603696362840742]);
  });

  // it('should fail when no color gamut provided', () => {
  //   try {
  //     rgbToXY([0, 0, 0], undefined);
  //     expect.fail('should have thrown an error');
  //   } catch (err) {
  //     expect(err.message).to.contain('No color gamut provided');
  //   }
  // });
});