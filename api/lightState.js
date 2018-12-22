'use strict';

const deepExtend = require('deep-extend')
  , parameterTypes = require('./parameterTypes')
;


const helpers = {
  brightness: parameterTypes.int8({
    name: 'brightness',
    min: 0,
    max: 100
  }),

  saturation: parameterTypes.int8({
    name: 'saturation',
    min: 0,
    max: 100
  }),
};


const states = {

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
    defaultValue: 4, //TODO need to store this in the type
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
  })
};


const sceneState = {
  scene: {
    name: 'scene',
    type: 'string',
    optional: true
  }
};


module.exports = {

  create: function () {
    return new LightState(deepExtend({}, states)).reset();
  },

  //TODO remove
  // createWithAlert: function () {
  //   return new LightState(deepExtend({}, states, alertState)).reset();
  // },

  createWithScene: function () {
    return new LightState(deepExtend({}, states, sceneState)).reset();
  }
};


const LightState = function (allowedStates) {
  this._allowedStates = allowedStates;
};


LightState.prototype.reset = function () {
  this._state = {};
  return this;
};


LightState.prototype.getPayload = function () {
  //TODO perform the validation against the allowed states
  return this._state;
};

LightState.prototype.on = function (on) {
  if (on !== undefined) {
    this._setStateValue(states.on, on);
  } else {
    this._setStateValue(states.on, true);
  }

  return this;
};


LightState.prototype.off = function () {
  this._setStateValue(states.on, false);
  return this;
};


LightState.prototype.bri = function (value) {
  this._setStateValue(states.bri, value);
  return this;
};


LightState.prototype.hue = function (value) {
  this._setStateValue(states.hue, value);
  return this;
};


LightState.prototype.sat = function (value) {
  this._setStateValue(states.sat, value);
  return this;
};


LightState.prototype.xy = function (x, y) {
  if (Array.isArray(x)) {
    this._setStateValue(states.xy, x);
  } else {
    this._setStateValue(states.xy, [x, y]);
  }

  return this;
};


LightState.prototype.ct = function (value) {
  this._setStateValue(states.ct, value);
  return this;
};


LightState.prototype.alert = function (value) {
  this._setStateValue(states.alert, value);
  return this;
};


LightState.prototype.effect = function (value) {
  this._setStateValue(states.effect, value);
  return this;
};


LightState.prototype.transitiontime = function (value) {
  this._setStateValue(states.transitiontime, value);
  return this;
};
LightState.prototype.transitionTime = LightState.prototype.transitiontime;


LightState.prototype.bri_inc = function(inc) {
  this._setStateValue(states.bri_inc, inc);
  return this;
};
LightState.prototype.incrementBrightness = LightState.prototype.bri_inc;


LightState.prototype.sat_inc = function(inc) {
  this._setStateValue(states.sat_inc, inc);
  return this;
};
LightState.prototype.incrementSaturation = LightState.prototype.sat_inc;


LightState.prototype.hue_inc = function(inc) {
  this._setStateValue(states.hue_inc, inc);
  return this;
};
LightState.prototype.incrementHue = LightState.prototype.hue_inc;


LightState.prototype.ct_inc = function(inc) {
  this._setStateValue(states.ct_inc, inc);
  return this;
};
LightState.prototype.incrementCt = LightState.prototype.ct_inc;
LightState.prototype.incrementColorTemp = LightState.prototype.ct_inc;
LightState.prototype.incrementColourTemp = LightState.prototype.ct_inc;


LightState.prototype.xy_inc = function(x_inc, y_inc) {
  if (Array.isArray(x_inc)) {
    this._setStateValue(states.xy_inc, x_inc);
  } else {
    this._setStateValue(states.xy_inc, [x_inc, y_inc]);
  }

  return this;
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Helper States that get converted into the standard light state values
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

LightState.prototype.brightness = function (value) {
  const percentage = helpers.brightness.getValue(value)
    , briValue = convertPercentageToValue(percentage, states.bri)
  ;
  return this.bri(briValue);
};


LightState.prototype.saturation = function (value) {
  const percentage = helpers.brightness.getValue(value)
    , satValue = convertPercentageToValue(percentage, states.sat)
  ;
  return this.sat(satValue);
};


LightState.prototype.alertLong = function() {
  return this.alert('lselect');
};
LightState.prototype.longAlert = LightState.prototype.alertLong;


LightState.prototype.alertShort= function() {
  return this.alert('select');
};
LightState.prototype.shortAlert = LightState.prototype.alertShort;


LightState.prototype.alertNone = function() {
  return this.alert('none');
};
LightState.prototype.cancelAlert = LightState.prototype.alertNone;


LightState.prototype.colorLoop = function () {
  this._setStateValue(states.effect, 'colorloop');
  return this;
};


LightState.prototype.colourLoop = function () {
  this._setStateValue(states.effect, 'colorloop');
  return this;
};


LightState.prototype.effectColorLoop = function () {
  this._setStateValue(states.effect, 'colorloop');
  return this;
};


LightState.prototype.effectColourLoop = function () {
  this._setStateValue(states.effect, 'colorloop');
  return this;
};


LightState.prototype.effectNone = function () {
  this._setStateValue(states.effect, 'none');
  return this;
};



LightState.prototype.transitionSlow = function() {
  return this.transitionTime(8);
};


LightState.prototype.transitionInstant = function() {
  return this.transitionTime(0);
};


LightState.prototype.transitionDefault = function() {
  return this.transitionTime();
};


LightState.prototype.transitionFast = function() {
  return this.transitionTime(2);
};


LightState.prototype.transition = function(millis) {
  if (millis) {
    return this.transitionTime(millis / 100);
  } else {
    this._setStateValue('transitiontime', states.transitiontime.getDefaultValue());
    return this;
  }
};
LightState.prototype.transitionTimeInMillis = LightState.prototype.transition;


LightState.prototype.rgb = function(r, g, b) {
  if (Array.isArray(r)) {
    this._setStateValue(states.rgb, r);
  } else {
    this._setStateValue(states.rgb, [r, g, b]);
  }

  return this;
};



//TODO consider readding hsl, hsb, white, etc...

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function convertPercentageToValue(percentage, valueType) {
  if (percentage === 0) {
    return valueType.getMinValue();
  } else if (percentage === 100) {
    return valueType.getMaxValue();
  } else {
    return percentage * (valueType.getRange() / 100);
  }
}



LightState.prototype._setStateValue = function (definition, value) {
  this._state[definition.name] = getDefinitionValue(definition, value);
};


function getDefinitionValue(definition, value) {
  return definition.getValue(value);
}
