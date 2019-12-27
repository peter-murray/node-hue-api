'use strict';

const RuleCondition = require('./RuleCondition')
  , Group = require('../../groups/Group')
  , ApiError = require('../../../ApiError')
  , conditionOperators = require('./operators/index')
;

module.exports = class GroupCondition {

  constructor(id) {
    if (id instanceof Group) {
      this._id = id.id;
    } else {
      this._id = id;
    }

    this._groupStateAttribute = null;
    this._operator = null;
    this._value = null;
  }

  when() {
    return new SelectAttribute(this);
  }

  getRuleCondition() {
    validateState(this);

    const data = {
      address: `/groups/${this._id}/state/${this._groupStateAttribute}`,
      operator: this._operator,
      value: this._value
    };
    return new RuleCondition().populate(data);
  }

  _setOperator(value) {
    this._operator = conditionOperators.getOperator(value);
    return this;
  }

  _setRequiredValue(value) {
    if (value === null || value === undefined) {
      throw new ApiError('A value is required when using this operator');
    }

    this._value = value;
    return this;
  }
};


function validateState(condition) {
  let message = null;

  if (condition._id === null || condition._id === undefined) {
    message = 'a group id is required';
  } else if (!condition._groupStateAttribute) {
    message = 'a state of the group is required';
  } else if (!condition._operator) {
    message = 'an operator for the group state value is required';
  }
  //TODO some operators require a value, others do not, might need to validate that here too, should have a function on the operator to check is a value is required

  if (message) {
    throw new ApiError(`Invalid Condition, ${message}`);
  }
}


class SelectAttribute {

  constructor(condition) {
    this._condition = condition;
    this._selectOperator = new SelectOperator(condition);
  }

  allOn() {
    this._condition._groupStateAttribute = 'all_on';
    return this._selectOperator;
  }

  anyOn() {
    this._condition._groupStateAttribute = 'any_on';
    return this._selectOperator;
  }
}


class SelectOperator {

  constructor(condition) {
    this._condition = condition;
  }

  equals(val) {
    this._condition._setOperator('eq');
    this._condition._setRequiredValue(val);
    return this._condition;
  }

  changed() {
    this._condition._setOperator('dx');
    // Clear any value that might have been set in the past
    this._condition.value = null;
    return this._condition;
  }

  changedDelayed(val) {
    this._condition._setOperator('ddx');
    this._condition._setRequiredValue(val); //TODO not sure this is required for ddx
    return this._condition;
  }
}