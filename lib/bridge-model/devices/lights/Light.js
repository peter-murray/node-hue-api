'use strict';

const BridgeObject = require('../Device')
  , colorGamuts = require('./color-gamuts')
;

const MODEL_TO_COLOR_GAMUT = {
  'LCT001': 'B',
  'LCT007': 'B',
  'LCT010': 'C',
  'LCT014': 'C',
  'LCT015': 'C',
  'LCT016': 'C',
  'LCT002': 'B',
  'LCT003': 'B',
  'LCT011': 'C',
  // 'LCT024': 'C', //TODO this can be read from capabilities.control.colorgamut and colorgamuttype now
  'LTW011': '2200K-6500K',
  'LST001': 'A',
  'LLC010': 'A',
  'LLC011': 'A',
  'LLC012': 'A',
  'LLC006': 'A',
  'LLC005': 'A',
  'LLC007': 'A',
  'LLC014': 'A',
  'LLC013': 'A',
  'LLM001': 'B',
  'LLM010': '2200K-6500K',
  'LLM011': '2200K-6500K',
  'LTW001': '2200K-6500K',
  'LTW004': '2200K-6500K',
  'LTW010': '2200K-6500K',
  'LTW015': '2200K-6500K',
  'LTW013': '2200K-6500K',
  'LTW014': '2200K-6500K',
  'LLC020': 'C',
  'LST002': 'C',
  'LCT012': 'C',
  'LTW012': '2200K-6500K',

  // Lamps
  'LTP001': '2200K-6500K',
  'LTP002': '2200K-6500K',
  'LTP003': '2200K-6500K',
  'LTP004': '2200K-6500K',
  'LTP005': '2200K-6500K',
  'LTF001': '2200K-6500K',
  'LTF002': '2200K-6500K',
  'LTC001': '2200K-6500K',
  'LTC002': '2200K-6500K',
  'LTC003': '2200K-6500K',
  'LTC004': '2200K-6500K',
  'LTC011': '2200K-6500K',
  'LTC012': '2200K-6500K',
  'LTD001': '2200K-6500K',
  'LTD002': '2200K-6500K',
  'LFF001': '2200K-6500K',
  'LTT001': '2200K-6500K',
  'LDT001': '2200K-6500K',
};


module.exports = class Light extends BridgeObject {

  constructor(data, id) {
    super(data, id);

    // Newer Hue devices report their own color gamuts
    let colorGamutType = this.getRawDataValue('capabilities.control.colorgamuttype');
    if (!colorGamutType) {
      colorGamutType = MODEL_TO_COLOR_GAMUT[this.modelid];
    }
    this.mappedColorGamut = colorGamutType;
  }

  get productid() {
    return this.getRawDataValue('productId');
  }

  get colorGamut() {
    if (this.mappedColorGamut && this.mappedColorGamut !== '2200K-6500K') {
      let colorGamut = this.getRawDataValue('capabilities.control.colorgamut');
      if (colorGamut) {
        // The color gamut is reported by the device, use that
        return colorGamuts.getColorGamut(colorGamut);
      } else {
        return colorGamuts[this.mappedColorGamut];
      }
    } else {
      return null;
    }
  }

  getSupportedStates() {
    const states = Object.keys(this.getRawDataValue('state'));

    // If there is a corresponding settings, then include the _inc variant
    ['bri', 'sat', 'hue', 'ct', 'xy'].forEach(key => {
      if (states.indexOf(key) > -1) {
        states.push(`${key}_inc`);
      }
    });

    return states;
  }
};