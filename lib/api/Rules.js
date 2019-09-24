'use strict';

const rulesApi = require('./http/endpoints/rules')
  , ApiDefinition = require('./http/ApiDefinition.js')
;

module.exports = class Sensors extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return this.execute(rulesApi.getAll);
  }

  get(id) {
    return this.execute(rulesApi.getRule, {id: id});
  }

  createRule(rule) {
    return this.execute(rulesApi.createRule, {rule: rule});
  }

  deleteRule(id) {
    return this.execute(rulesApi.deleteRule, {id: id});
  }

  updateRule(rule) {
    return this.execute(rulesApi.updateRule, {id: rule.id, rule: rule});
  }
};