'use strict';

const RuleAction = require('./RuleAction')
  , GroupState = require('../../lightstate/GroupState')
  , ApiError = require('../../../ApiError')
;

module.exports = class GroupStateAction extends RuleAction {

  constructor(id) {
    super(id, 'PUT');
    this._state = null;
  }

  get address() {
    return `/groups/${this.id}/action`;
  }

  withState(state) {
    if (state instanceof GroupState) {
      this._state = state;
    } else {
      this._state = new GroupState().populate(state);
    }
    return this;
  }

  get body() {
    if (this._state) {
      return this._state.getPayload();
    }
    throw new ApiError('No state has been set on the Rule Action');
  }
};