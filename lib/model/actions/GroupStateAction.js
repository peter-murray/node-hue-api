'use strict';

const BridgeAction = require('./BridgeAction')
  , GroupState = require('../lightstate/GroupState')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
  , GroupIdPlaceHolder = require('../../placeholders/GroupIdPlaceholder')
;

const GROUP_ID = new GroupIdPlaceHolder();

const ATTRIBUTES = [
  types.uint8({name: 'group'}),
  types.object({name: 'state'}), //TODO this is an actual GroupState object
];


module.exports = class GroupStateAction extends BridgeAction {

  constructor(group) {
    super(ATTRIBUTES, 'PUT');
    this.group = group;
  }

  get address() {
    return `/groups/${this.group}/action`;
  }

  get group() {
    return this.getAttributeValue('group');
  }

  set group(value) {
    const groupId = GROUP_ID.getValue({id: value});
    this.setAttributeValue('group', groupId);
  }

  withState(state) {
    let value = state;

    if (!(state instanceof GroupState)) {
      value = new GroupState().populate(state);
    }

    this.setAttributeValue('state', value.getPayload());
    return this;
  }

  get body() {
    const state = this.getAttributeValue('state');
    if (state) {
      return state;
    }
    throw new ApiError('No state has been set on the GroupStateAction');
  }
};
