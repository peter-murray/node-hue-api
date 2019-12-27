'use strict';

const conditionOperator = require('./operators/index');

module.exports = class RuleCondition {

  constructor(address, operator, value) {
    this.populate({
      address: address,
      operator: operator,
      value: value
    });
  }

  get address() {
    return this._address;
  }

  get operator() {
    return this._operator;
  }

  set operator(op) {
    this._operator = conditionOperator.getOperator(op);
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }

  get payload() {
    const result = {
      address: this.address,
      operator: this.operator.payload,
    };

    if (this.value !== null && this.value !== undefined) {
      // The bridge API will only accept string values currently, 28/09/2019
      result.value = `${this.value}`;
    }

    return result;
  }

  populate(data) {
    let address = null
      , operator = null
      , value = null
    ;

    if (data) {
      address = data.address || null;
      operator = conditionOperator.getOperator(data.operator || null);
      value = (data.value !== undefined && data.value !== null) ? data.value : null;
    }

    this._address = address;
    this._operator = operator;
    this._value = value;

    return this;
  }

  toString() {
    return JSON.stringify(this.payload);
  }
};