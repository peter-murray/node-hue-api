'use strict';

module.exports = class RuleConditionOperator {

  constructor(name, matchValues) {
    this._type = name;

    this._matchValues = [name];
    if (matchValues) {
      this._matchValues = this._matchValues.concat(matchValues);
    }
  }

  get type() {
    return this._type;
  }

  matches(value) {
    let matched = false;

    if (value instanceof RuleConditionOperator) {
      return this.type === value.type;
    } else {
      this._matchValues.some(match => {
        if (match === value) {
          matched = true;
          return true;
        }
      });
    }

    return matched;
  }

  get payload() {
    return this.type;
  }
};