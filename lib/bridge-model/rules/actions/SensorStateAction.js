'use strict';

const RuleAction = require('./RuleAction')
  , ApiError = require('../../../ApiError')
;

module.exports = class SensorStateAction extends RuleAction {

  constructor(id) {
    super(id, 'PUT');
    this._state = null;
  }

  get address() {
    return `/sensors/${this.id}/state`;
  }

  withState(data) {
    // Sensor state varies wildly, so just take data here, maybe consider building payloads later on...
    this._state = data;
    return this;
  }

  get body() {
    if (this._state) {
      return this._state;
    }
    throw new ApiError('No state has been set on the Rule Action');
  }
};
