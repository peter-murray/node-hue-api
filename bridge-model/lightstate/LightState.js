'use strict';

const CommonStates = require('./CommonStates.js');


module.exports = class LightState extends CommonStates {

  constructor() {
    super();
  }
};

//TODO this is a throw back to the old API
module.exports.create = () => {
  return new module.exports();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Helper States that get converted into the standard light state values
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// LightState.prototype.brightness = function (value) {
//   const percentage = helpers.brightness.getValue(value)
//     , briValue = convertPercentageToValue(percentage, states.bri)
//   ;
//   return this.bri(briValue);
// };
//
//
// LightState.prototype.saturation = function (value) {
//   const percentage = helpers.brightness.getValue(value)
//     , satValue = convertPercentageToValue(percentage, states.sat)
//   ;
//   return this.sat(satValue);
// };
//
//
// LightState.prototype.alertLong = function () {
//   return this.alert('lselect');
// };
// LightState.prototype.longAlert = LightState.prototype.alertLong;
//
//
// LightState.prototype.alertShort = function () {
//   return this.alert('select');
// };
// LightState.prototype.shortAlert = LightState.prototype.alertShort;
//
//
// LightState.prototype.alertNone = function () {
//   return this.alert('none');
// };
// LightState.prototype.cancelAlert = LightState.prototype.alertNone;
//
//
// LightState.prototype.colorLoop = function () {
//   this.setStateValue(states.effect, 'colorloop');
//   return this;
// };
//
//
// LightState.prototype.colourLoop = function () {
//   this.setStateValue(states.effect, 'colorloop');
//   return this;
// };
//
//
// LightState.prototype.effectColorLoop = function () {
//   this.setStateValue(states.effect, 'colorloop');
//   return this;
// };
//
//
// LightState.prototype.effectColourLoop = function () {
//   this.setStateValue(states.effect, 'colorloop');
//   return this;
// };
//
//
// LightState.prototype.effectNone = function () {
//   this.setStateValue(states.effect, 'none');
//   return this;
// };
//
//
// LightState.prototype.transitionSlow = function () {
//   return this.transitionTime(8);
// };
//
//
// LightState.prototype.transitionInstant = function () {
//   return this.transitionTime(0);
// };
//
//
// LightState.prototype.transitionDefault = function () {
//   return this.transitionTime();
// };
//
//
// LightState.prototype.transitionFast = function () {
//   return this.transitionTime(2);
// };
//
//
// LightState.prototype.transition = function (millis) {
//   if (millis) {
//     return this.transitionTime(millis / 100);
//   } else {
//     this.setStateValue('transitiontime', states.transitiontime.getDefaultValue());
//     return this;
//   }
// };
// LightState.prototype.transitionTimeInMillis = LightState.prototype.transition;
//
//
// LightState.prototype.rgb = function (r, g, b) {
//   if (Array.isArray(r)) {
//     this.setStateValue(states.rgb, r);
//   } else {
//     this.setStateValue(states.rgb, [r, g, b]);
//   }
//
//   return this;
// };


//TODO consider readding hsl, hsb, white, etc...

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function convertPercentageToValue(percentage, valueType) {
//   if (percentage === 0) {
//     return valueType.getMinValue();
//   } else if (percentage === 100) {
//     return valueType.getMaxValue();
//   } else {
//     return percentage * (valueType.getRange() / 100);
//   }
// }

// LightState.prototype.setStateValue = function (definition, value) {
//   this._state[definition.name] = getDefinitionValue(definition, value);
// };
//
//
// function getDefinitionValue(definition, value) {
//   return definition.getValue(value);
// }
