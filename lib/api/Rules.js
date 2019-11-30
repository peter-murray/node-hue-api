'use strict';

const rulesApi = require('./http/endpoints/rules')
  , Rule = require('../model/rules/Rule')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , util = require('../util')
;

module.exports = class Sensors extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  /**
   * @returns {Promise<Rule[]>}
   */
  getAll() {
    return this.execute(rulesApi.getAll);
  }

  /**
   * @param id {int | Rule}
   * @returns {Promise<Rule>}
   */
  getRule(id) {
    return this.execute(rulesApi.getRule, {id: id});
  }

  /**
   * @deprecated since 4.x, use getRule(id) instead
   */
  get(id) {
    util.deprecatedFunction('5.x', 'rules.get(id)', 'Use rules.getRule(id) instead.');
    return this.getRule(id);
  }

  // getOrphanedRules() {
  //   return this._filterRules(rule => {return rule.status === 'resourcedeleted'});
  // }
  //
  // getDisabledRules() {
  //   return this._filterRules(rule => {return rule.status === 'disabled'});
  // }

  /**
   * @param name {string}
   * @returns {Promise<Rule[]>}
   */
  getRuleByName(name) {
    return this.getAll()
      .then(rules => {
        return rules.filter(rule => rule.name === name);
      });
  }

  /**
   * @param rule {Rule}
   * @returns {Promise<Rule>}
   */
  createRule(rule) {
    const self = this;
    return self.execute(rulesApi.createRule, {rule: rule})
      .then(data => {
        return self.getRule(data.id);
      });
  }

  /**
   * @param id {int | Rule}
   * @returns {Promise<boolean>}
   */
  deleteRule(id) {
    if (id instanceof Rule) {
      return this.execute(rulesApi.deleteRule, {id: id.id});
    } else {
      return this.execute(rulesApi.deleteRule, {id: id});
    }
  }

  /**
   *
   * @param rule {Rule}
   * @returns {Promise<*>}
   */
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