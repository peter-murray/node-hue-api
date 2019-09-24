'use strict';



module.exports = class RuleCondition {

  constructor(address, operator, value) {
    this._data = {
      address: address,
      operator: operator,
      value: value
    };
  }

  get address() {
    return this._data.address;
  }

  get operator() {
    return this._data.operator;
  }

  get value() {
    return this._data.value;
  }
};