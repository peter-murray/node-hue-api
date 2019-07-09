'use strict';

const LightState = require('../lib/bridge-model/lightstate/LightState')
;

module.exports = class LightStateShim {

  constructor (values) {
    this.lightState = new LightState();
    if (values) {
      this.lightState.populate(values);
    }
  }

  payload() {
    return this.lightState.getPayload();
  }

  isLightState(obj) {
    return obj && (obj instanceof LightStateShim || obj instanceof LightState);
  }

  reset() {
    this.lightState.reset();
    return this;
  }

  clear() {
    return this.reset();
  }

  copy() {
    const copy = new LightStateShim();
    copy.lightState.populate(this.lightState.getPayload());
    return copy;
  }

  strict() {
    // THis has no meaning any more we are always strict with the contents of the payload
    return this;
  }

  isStrict() {
    return true;
  }

  on(on) {
    this.lightState.on(on);
    return this;
  }

  bri(bri) {
    this.lightState.bri(bri);
    return this;
  }

  hue(hue) {
    this.lightState.hue(hue);
    return this;
  }

  sat(value) {
    this.lightState.sat(value);
    return this;
  }

  xy(x, y) {
    this.lightState.xy(x, y);
    return this;
  }

  ct(value) {
    this.lightState.ct(value);
    return this;
  }

  alert(value) {
    this.lightState.alert(value);
    return this;
  }

  effect(value) {
    this.lightState.effect(value);
    return this;
  }

  transistiontime(value) {
    this.lightState.transitiontime(value);
    return this;
  }

  bri_inc(value) {
    this.lightState.bri_inc(value);
    return this;
  }

  sat_inc(value) {
    this.lightState.sat_inc(value);
    return this;
  }

  hue_inc(value) {
    this.lightState.hue_inc(value);
    return this;
  }

  ct_inc(value) {
    this.lightState.ct_inc(value);
    return this;
  }

  xy_inc(value) {
    this.lightState.xy_inc(value);
    return this;
  }


  turnOn() {
    return this.on(true);
  }

  off() {
    return this.on(false);
  }

  turnOff() {
    return this.off();
  }

  incrementBrightness(value) {
    return this.bri_inc(value);
  }

  colorTemperature(value) {
    return this.ct(value);
  }

  colourTemperature(value) {
    return this.ct(value);
  }

  colorTemp(value) {
    return this.ct(value);
  }

  colourTemp(value) {
    return this.ct(value);
  }

  incrementColorTemp(value) {
    return this.ct_inc(value);
  }

  incrementColorTemperature(value) {
    return this.ct_inc(value);
  }

  incrementColourTemp(value) {
    return this.ct_inc(value);
  }

  incrementColourTemperature(value) {
    return this.ct_inc(value);
  }

  incrementHue(value) {
    return this.hue_inc(value);
  }

  incrementXY(value) {
    return this.xy_inc(value);
  }

  incrementSaturation(value) {
    return this.sat_inc(value);
  }

  brightness(value) {
    this.lightState.brightness(value);
    return this;
  }

  saturation(value) {
    this.lightState.saturation(value);
    return this;
  }

  white(colorTemp, brightPercent) {
    this.lightState.white(colorTemp, brightPercent);
    return this;
  }

  hsl(h, s, l) {
    this.lightState.hsl(h, s, l);
    return this;
  }

  hsb(h, s, b) {
    this.lightState.hsb(h, s, b);
    return this;
  }

  rgb(r, g, b) {
    this.lightState.rgb(r, g, b);
    return this;
  }

  colorLoop() {
    return this.effect('colorloop');
  }

  colourLoop() {
    return this.colorLoop();
  }

  effectColorLoop() {
    return this.colorLoop();
  }

  effectColourLoop() {
    return this.colorLoop();
  }

  shortAlert() {
    this.lightState.alertShort();
    return this;
  }

  alertShort() {
    this.lightState.alertShort();
    return this;
  }

  longAlert() {
    this.lightState.alertLong();
    return this;
  }

  alertLong() {
    this.lightState.alertLong();
    return this;
  }

  transitionTime(value) {
    return this.transistiontime(value);
  }

  transition(value) {
    this.lightState.transition(value);
    return this;
  }

  transitiontime_milliseconds(value) {
    this.lightState.transition(value);
    return this;
  }

  transitionTime_milliseconds(value) {
    this.lightState.transition(value);
    return this;
  }

  transitionSlow() {
    this.lightState.transitionSlow();
    return this;
  }

  transitionFast() {
    this.lightState.transitionFast();
    return this;
  }

  transitionInstant() {
    this.lightState.transitionInstant();
    return this;
  }

  transitionDefault() {
    this.lightState.transitionDefault();
    return this;
  }
}