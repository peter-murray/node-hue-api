'use strict';

const types = require('../../types');

module.exports = {

  on: types.boolean({
    name: 'on',
    optional: true
  }),

  bri: types.uint8({
    name: 'bri',
    min: 1,
    max: 254,
    optional: true
  }),

  hue: types.uint16({
    name: 'hue',
    optional: true
  }),

  sat: types.uint8({
    name: 'sat',
    min: 0,
    max: 254,
    optional: true
  }),

  xy: types.list({
    name: 'xy',
    minEntries: 2,
    maxEntries: 2,
    listType: types.float({
      name: 'xyValue',
      min: 0,
      max: 1,
      optional: false
    }),
    optional: true
  }),

  ct: types.uint16({
    name: 'ct',
    min: 153,
    max: 500,
    optional: true
  }),

  alert: types.choice({
    name: 'alert',
    type: 'string',
    defaultValue: 'none',
    validValues: ['none', 'select', 'lselect'],
    optional: true
  }),

  effect: types.choice({
    name: 'effect',
    type: 'string',
    defaultValue: 'none',
    validValues: ['none', 'colorloop'],
    optional: true
  }),

  transitiontime: types.uint16({
    name: 'transitiontime',
    defaultValue: 4,
    optional: true
  }),

  bri_inc: types.int8({
    name: 'bri_inc',
    min: -254,
    max: 254,
    optional: true
  }),

  sat_inc: types.int8({
    name: 'sat_inc',
    min: -254,
    max: 254,
    optional: true
  }),

  hue_inc: types.int16({
    name: 'hue_inc',
    min: -65534,
    max: 65534,
    optional: true
  }),

  ct_inc: types.int16({
    name: 'ct_inc',
    min: -65534,
    max: 65534,
    optional: true
  }),

  xy_inc: types.list({
    name: 'xy_inc',
    minEntries: 2,
    maxEntries: 2,
    listType: types.float({
      name: 'xyValue',
      min: -0.5,
      max: 0.5,
      optional: false,
    }),
    optional: true
  }),

  scene: types.string({
    name: 'scene',
    type: 'string',
    optional: true
  }),


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Types that are not part of the Hue Bridge, but provide useful helpers
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // // Brightness Percentage
  // brightness: parameterTypes.int8({
  //   name: 'brightness',
  //   min: 0,
  //   max: 100
  // }),
  //
  // // Saturation Percentage
  // saturation: parameterTypes.int8({
  //   name: 'saturation',
  //   min: 0,
  //   max: 100
  // }),


  // RGB
  // This is a custom state, and can only be applied we we know the light details, so is stored like a normal state
  rgb: types.list({
    name: 'rgb',
    minEntries: 3,
    maxEntries: 3,
    listType: types.uint8({
      name: 'rgbValue'
    }),
  }),

  //TODO HSB, HSL, although these are conversions to the normal attributes which are done in code currently
};