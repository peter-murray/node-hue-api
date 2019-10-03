'use strict';

const BridgeObject = require('../BridgeObject')
  , ruleActions = require('./actions/index')
  , ruleConditions = require('./conditions/index')
;

module.exports = class Rule extends BridgeObject {

  constructor(data, id) {
    let cleanedData = Object.assign({}, data);
    delete cleanedData.conditions;
    delete cleanedData.actions;

    super(cleanedData, id);
    this._conditions = buildConditions(data ? data.conditions : null);
    this._actions = buildActions(data ? data.actions : null);
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

  set recycle(val) {
    this._updateRawDataValue('recycle', !!val);
  }

  get recycle() {
    return this.getRawDataValue('recycle');
  }

  get conditions() {
    return this._conditions;
  }

  addCondition(condition) {
    this._conditions.push(buildCondition(condition));
    return this;
  }

  removeConditionAt(idx) {
    this._conditions.splice(idx, 1);
  }

  resetConditions() {
    this._conditions = buildConditions();
  }

  get actions() {
    return this._actions;
  }

  addAction(action) {
    this._actions.push(buildAction(action));
    return this;
  }

  removeActionAt(idx) {
    this._actions.splice(idx, 1);
  }

  resetActions() {
    this._actions = buildActions();
  }

  getConditionsPayload() {
    return getPayloads(this.conditions);
  }

  getActionsPayload() {
    return getPayloads(this.actions);
  }

  toStringDetailed() {
    let result = super.toStringDetailed();

    result += '\n  Conditions:';
    this.conditions.forEach(condition => {
      result += `\n    ${condition.toString()}`;
    });

    result += '\n  Actions:';
    this.actions.forEach(action => {
      result += `\n    ${action.toString()}`;
    });

    return result;
  }
};


function buildCondition(condition) {
  return ruleConditions.create(condition);
}

function buildConditions(conditions) {
  const result = [];

  if (conditions) {
    conditions.forEach(condition => {
      result.push(buildCondition(condition));
    });
  }

  return result;
}

function buildAction(action) {
  return ruleActions.create(action);
}

function buildActions(actions) {
  const result = [];

  if (actions) {
    actions.forEach(action => {
      result.push(buildAction(action));
    });
  }

  return result;
}

function getPayloads(collection) {
  const result = [];

  if (collection) {
    collection.forEach(value => {
      result.push(value.payload);
    });
  }

  return result;
}