'use strict';

const BridgeObject = require('../BridgeObject')
  , types = require('../../types')
  , util = require('../../util')
  , ApiError = require('../../ApiError')
;

const ATTRIBUTES = [
  types.choice({name: 'method', validValues: ['PUT', 'POST', 'DELETE']}),
  types.choice({name: 'target', validValues: ['rule', 'schedule']}),
];

module.exports = class BridgeAction extends BridgeObject {

  constructor(attributes, method) {
    super(util.flatten(ATTRIBUTES, attributes));
    this.withMethod(method);
  }

  get method() {
    return this.getAttributeValue('method');
  }

  //TODO maybe unnecessary
  get isRuleAction() {
    return this.getAttributeValue('target') === 'rule';
  }

  //TODO maybe unnecessary
  get isScheduleAction() {
    return this.getAttributeValue('target') === 'schedule';
  }

  withMethod(value) {
    return this.setAttributeValue('method', value);
  }

  //TODO revisit this
  get payload() {
    return {
      address: this.address,
      method: this.method,
      body: this.body
    };
  }

  toString() {
    return JSON.stringify(this.payload);
  }
};