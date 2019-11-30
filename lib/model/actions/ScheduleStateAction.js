'use strict';

const BridgeAction = require('./BridgeAction')
  , ApiError = require('../../ApiError')
;

module.exports = class ScheduleStateAction extends BridgeAction {

  constructor(id) {
    super(id, 'PUT');
    this._state = null;
  }

  get address() {
    if (this.id === null || this.id === undefined) {
      return '/schedules';
    }
    return `/schedules/${this.id}`;
  }

  withState(data) {
    // Schedule state not completely known at this time, so just take data here, maybe consider building payloads later on...
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
