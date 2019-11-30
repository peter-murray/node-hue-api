'use strict';

const BridgeAction = require('./BridgeAction')
  , LightState = require('../lightstate/LightState')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
  , LightIdPlaceholder = require('../../placeholders/LightIdPlaceholder')
;

const LIGHT_ID = new LightIdPlaceholder();

const ATTRIBUTES = [
  types.uint8({name: 'light'}),
  types.object({name: 'body'}),
  types.object({name: 'state'}), //TODO this is an actual LightState object, could utilize another type
];


module.exports = class LightStateAction extends BridgeAction {

  constructor(light) {
    super(ATTRIBUTES, 'PUT');
    this.light = light;
  }

  get address() {
    return `/lights/${this.light}/state`;
  }

  get light() {
    return this.getAttributeValue('light')
  }

  set light(value) {
    const lightId = LIGHT_ID.getValue({id: value});
    this.setAttributeValue('light', lightId);
  }

  withState(state) {
    let value = state;

    if (!(state instanceof LightState)) {
      value = new LightState().populate(state);
    }

    this.setAttributeValue('state', value.getPayload());
    return this;
  }

  get body() {
    const state = this.getAttributeValue('state');
    if (state) {
      return state;
    }
    throw new ApiError('No state has been set on the LightStateAction');
  }
};
