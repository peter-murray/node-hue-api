'use strict';

const Device = require('../Device');


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


const COLOR_GAMUTS = {
  'A': {
    red: {x: 0.704, y: 0.296},
    green: {x: 0.2151, y: 0.7106},
    blue: {x: 0.138, y: 0.08},
  },

  'B': {
    red: {x: 0.675, y: 0.322},
    green: {x: 0.409, y: 0.518},
    blue: {x: 0.167, y: 0.04},
  },

  'C': {
    red: {x: 0.692, y: 0.308},
    green: {x: 0.17, y: 0.7},
    blue: {x: 0.153, y: 0.048},
  },
};


class Light extends Device {

  constructor(data, id) {
    super(data, id);

    this.mappedColorGamut = MODEL_TO_COLOR_GAMUT[this.modelId];
  }

  get productid() {
    return this.getRawDataValue('productId');
  }

  get colorGamut() {
    if (this.mappedColorGamut && this.mappedColorGamut !== '2200K-6500K') {
      return COLOR_GAMUTS[this.mappedColorGamut];
    } else {
      return null;
    }
  }

  getSupportedStates() {
    if (this.bridgeData != null) {
      return Object.keys(this.bridgeData.state);
    }
    return null;
  }
}
module.exports = Light;