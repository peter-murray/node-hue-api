'use strict';

const BridgeObjectWithId = require('./BridgeObjectWithId')
  , colorGamuts = require('./colorGamuts')
  , types = require('../types')
  , util = require('../util')
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


const ATTRIBUTES = [
  types.uint8({name: 'id'}),
  types.string({name: 'name', min: 0, max: 32}),
  types.string({name: 'type'}),
  types.string({name: 'modelid'}),
  types.string({name: 'manufacturername'}),
  types.string({name: 'uniqueid'}),
  types.string({name: 'productname'}),
  types.string({name: 'productid'}),
  types.object({name: 'state'}),
  types.object({name: 'capabilities'}),
  types.object({name: 'config'}),
  types.object({
    name: 'swupdate',
    types: [
      types.string({name: 'state'}),
      types.string({name: 'lastinstall'}),
    ]
  }),
  types.string({name: 'swversion'}),
  types.string({name: 'swconfigid'}),
];

//TODO add support for making it easier to set power failure modes config.startup.mode = 'powerfail'

/**
 * @type {Light}
 */
module.exports = class Light extends BridgeObjectWithId {

  constructor(id) {
    super(ATTRIBUTES, id);
  }

  /** @returns {number} */
  get id() {
    return this.getAttributeValue('id');
  }

  /**
    * @returns {string}
   */
  get name() {
    return this.getAttributeValue('name');
  }

  /**
   * @param {string} value
   * @returns {Light}
   */
  set name(value) {
    return this.setAttributeValue('name', value);
  }

  /**
   * @returns {String}
   */
  get type() {
    return this.getAttributeValue('type');
  }

  /**
   * @returns {String}
   */
  get modelid() {
    return this.getAttributeValue('modelid');
  }

  /**
   * @returns {string}
   */
  get manufacturername() {
    return this.getAttributeValue('manufacturername');
  }

  /**
   * @returns {string}
   */
  get uniqueid() {
    return this.getAttributeValue('uniqueid');
  }

  /**
   * @returns {string}
   */
  get productid() {
    return this.getAttributeValue('productid');
  }

  /**
   * @returns {string}
   */
  get productname() {
    return this.getAttributeValue('productname');
  }

  /**
   * @returns {string}
   */
  get swversion() {
    return this.getAttributeValue('swversion');
  }

  /**
   * @returns {string}
   */
  get swupdate() {
    return this.getAttributeValue('swupdate');
  }

  /**
   * @returns {Object}
   */
  get state() {
    return this.getAttributeValue('state');
  }

  /**
   * @returns {Object}
   */
  get capabilities() {
    return this.getAttributeValue('capabilities');
  }

  /**
   * @typedef {Object} colorGamut
   * @property {number[]} red
   * @property {number[]} green
   * @property {number[]} blue
   *
   * @returns {colorGamut}
   */
  get colorGamut() {
    if (this.mappedColorGamut && this.mappedColorGamut !== '2200K-6500K') {
      return colorGamuts.getColorGamut(this.mappedColorGamut);
    } else {
      return null;
    }
  }

  /**
   * Gets the supported states that the light will accept
   * @returns {string[]}
   */
  getSupportedStates() {
    const states = Object.keys(this.state);

    // transitiontime is no longer provided in the light state raw data values from the Hue API
    states.push('transitiontime');

    // If there is a corresponding settings, then include the xxx_inc variant
    ['bri', 'sat', 'hue', 'ct', 'xy'].forEach(key => {
      if (states.indexOf(key) > -1) {
        states.push(`${key}_inc`);
      }
    });

    return states;
  }

  /** @private */
  _populate(data) {
    if (data) {
      this.mappedColorGamut = getColorGamut(data);
    } else {
      this.mappedColorGamut = null;
    }

    return super._populate(data);
  }
};

function getColorGamut(data) {
  // Newer Hue devices report their own color gamuts under 'capabilities.control.colorgamuttype'
  let colorGamutType = util.getValueForKey('capabilities.control.colorgamuttype', data);

  if (!colorGamutType) {
    colorGamutType = MODEL_TO_COLOR_GAMUT[data.modelid];
  }

  return colorGamutType;
}