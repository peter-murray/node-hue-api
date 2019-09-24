'use strict';

const ApiError = require('../../ApiError')
  , BridgeObject = require('../BridgeObject')
  , RuleCondition = require('./RuleCondition')
  , ruleAction = require('./RuleAction')
  , utils = require('../../../hue-api/utils')
;

module.exports = class Rule extends BridgeObject {

  constructor(data, id) {
    //TODO remove actions and conditions from base data
    let cleanedData = Object.assign({}, data);

    delete cleanedData.conditions;
    delete cleanedData.actions;

    super(cleanedData, id);
    this._conditions = buildConditions(data.conditions);
    this._actions = buildActions(data.actions);
  }

  get owner() {
    return this.getRawDataValue('owner');
  }

  get lasttriggered() {
    return this.getRawDataValue('lasttriggered');
  }

  get timestriggered() {
    return this.getRawDataValue('timestriggered');
  }

  get status() {
    return this.getRawDataValue('status');
  }

  get recycle() {
    return this.getRawDataValue('recycle');
  }

  get conditions() {
    return this._conditions;
  }

  addCondition(condition) {
    //TODO
    return this;
  }

  get actions() {
    return this._actions;
  }

  addAction(action) {
    //TODO validate type and build an action?
    this._actions.push(action);
    //TODO
    return this;
  }

  get payload() {
    const result = {
      id: this.id,
      name: this.name,
      recycle: this.recycle,
    };

    result.conditions = getConditionsPayload(this.conditions);
    result.actions = getActionsPayload(this.actions);

    return result;
  }
};


function buildConditions(conditions) {
  const result = [];

  if (conditions) {
    conditions.forEach(condition => {
      result.push(new RuleCondition(condition));
    });
  }

  return result;
}

function buildActions(actions) {
  const result = [];

  if (actions) {
    actions.forEach(action => {
      result.push(ruleAction.create(action));
    });
  }

  return result;
}

function getConditionsPayload(conditions) {
  const result = [];

  if (conditions) {
    conditions.forEach(condition => {
      result.push(condition.payload);
    });
  }

  return result;
}

function getActionsPayload(actions) {
  const result = [];

  if (actions) {
    actions.forEach(action => {
      result.push(action.payload);
    });
  }

  return result;
}