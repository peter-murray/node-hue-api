'use strict';

const rulesApi = require('./http/endpoints/rules')
  , Rule = require('../bridge-model/rules/Rule')
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

  // getOrphanedRules() {
  //   return this._filterRules(rule => {return rule.status === 'resourcedeleted'});
  // }
  //
  // getDisabledRules() {
  //   return this._filterRules(rule => {return rule.status === 'disabled'});
  // }

  createRule(rule) {
    return this.execute(rulesApi.createRule, {rule: rule});
  }

  deleteRule(id) {
    if (id instanceof Rule) {
      return this.execute(rulesApi.deleteRule, {id: id.id});
    } else {
      return this.execute(rulesApi.deleteRule, {id: id});
    }
  }

  updateRule(rule) {
    return this.execute(rulesApi.updateRule, {id: rule.id, rule: rule});
  }

  _filterRules(fn) {
    return this.getAll()
      .then(rules => {
        return rules.filter(fn);
      });
  }
};