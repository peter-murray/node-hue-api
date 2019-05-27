'use strict';

const parameterTypes = require('../../parameters');

module.exports = {

  on: parameterTypes.boolean({
    name: 'on',
    optional: true
  }),

  bri: parameterTypes.uint8({
    name: 'bri',
    min: 1,
    max: 254,
    optional: true
  }),

  hue: parameterTypes.uint16({
    name: 'hue',
    optional: true
  }),

  sat: parameterTypes.uint8({
    name: 'sat',
    min: 0,
    max: 254,
    optional: true
  }),

  xy: parameterTypes.list({
    name: 'xy',
    minEntries: 2,
    maxEntries: 2,
    type: parameterTypes.float({
      name: 'xyValue',
      min: 0,
      max: 1
    }),
    optional: true
  }),

  ct: parameterTypes.uint16({
    name: 'ct',
    min: 153,
    max: 500,
    optional: true
  }),

  alert: parameterTypes.choice({
    name: 'alert',
    type: 'string',
    defaultValue: 'none',
    validValues: ['none', 'select', 'lselect'],
    optional: true
  }),

  effect: parameterTypes.choice({
    name: 'effect',
    type: 'string',
    defaultValue: 'none',
    validValues: ['none', 'colorloop'],
    optional: true
  }),

  transitiontime: parameterTypes.uint16({
    name: 'transitiontime',
    defaultValue: 4,
    optional: true
  }),

  bri_inc: parameterTypes.int8({
    name: 'bri_inc',
    min: -254,
    max: 254,
    optional: true
  }),

  sat_inc: parameterTypes.int8({
    name: 'sat_inc',
    min: -254,
    max: 254,
    optional: true
  }),

  hue_inc: parameterTypes.int16({
    name: 'hue_inc',
    min: -65534,
    max: 65534,
    optional: true
  }),

  ct_inc: parameterTypes.int16({
    name: 'ct_inc',
    min: -65534,
    max: 65534,
    optional: true
  }),

  xy_inc: parameterTypes.list({
    name: 'xy_inc',
    minEntries: 2,
    maxEntries: 2,
    type: parameterTypes.float({
      name: 'xyValue',
      min: -0.5,
      max: 0.5
    }),
    optional: true
  }),

  scene: parameterTypes.string({
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
  rgb: parameterTypes.list({
    name: 'rgb',
    minEntries: 3,
    maxEntries: 3,
    type: parameterTypes.uint8({
      name: 'rgbValue',
      min: 0,
      max: 255
    }),
  }),

  //TODO HSB, HSL, although these are conversions to the normal attributes which are done in code currently
};