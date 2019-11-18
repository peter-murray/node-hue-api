'use strict';

const RuleAction = require('./RuleAction')
  , ApiError = require('../../../ApiError')
;

module.exports = class SceneAction extends RuleAction {

  constructor(id) {
    super(id, 'PUT');
    this._state = null;
  }

  get address() {
    return `/scenes/${this.id}`;
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
