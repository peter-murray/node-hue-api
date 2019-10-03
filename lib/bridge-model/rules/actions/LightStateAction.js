'use strict';

const RuleAction = require('./RuleAction')
  , LightState = require('../../lightstate/LightState')
  , ApiError = require('../../../ApiError')
;

module.exports = class LightStateAction extends RuleAction {

  constructor(id) {
    super(id, 'PUT');
    this._state = null;
  }

  get address() {
    return `/lights/${this.id}/state`;
  }

  get body() {
    if (this._state) {
      return this._state.getPayload();
    }
    throw new ApiError('No state has been set on the Rule Action');
  }

  withState(state) {
    if (state instanceof LightState) {
      this._state = state;
    } else {
      this._state = new LightState().populate(state);
    }
    return this;
  }
};
