import { ApiDefinition } from './http/ApiDefinition';
import { rulesApi } from './http/endpoints/rules';
import { model } from '@peter-murray/hue-bridge-model';
import { KeyValueType } from '../commonTypes';
import { Api } from './Api';

type Rule = model.Rule;
type RuleId = number | Rule;

export class Rules extends ApiDefinition {

  constructor(hueApi: Api) {
    super(hueApi);
  }

  getAll(): Promise<Rule[]> {
    return this.execute(rulesApi.getAll);
  }

  getRule(id: RuleId): Promise<Rule> {
    return this.execute(rulesApi.getRule, {id: id});
  }

  // /**
  //  * @deprecated since 4.x, use getRule(id) instead
  //  */
  // get(id) {
  //   util.deprecatedFunction('5.x', 'rules.get(id)', 'Use rules.getRule(id) instead.');
  //   return this.getRule(id);
  // }

  // getOrphanedRules() {
  //   return this._filterRules(rule => {return rule.status === 'resourcedeleted'});
  // }
  //
  // getDisabledRules() {
  //   return this._filterRules(rule => {return rule.status === 'disabled'});
  // }


  getRuleByName(name: string): Promise<Rule[]> {
    return this.getAll()
      .then(rules => {
        return rules.filter(rule => rule.name === name);
      });
  }

  createRule(rule: Rule): Promise<Rule> {
    const self = this;
    return self.execute(rulesApi.createRule, {rule: rule})
      .then(data => {
        return self.getRule(data.id);
      });
  }


  deleteRule(id: RuleId): Promise<boolean> {
    return this.execute(rulesApi.deleteRule, {id: id});
  }

  updateRule(rule: Rule): Promise<KeyValueType> {
    return this.execute(rulesApi.updateRule, {id: rule.id, rule: rule});
  }

  // _filterRules(fn: Function) {
  //   return this.getAll()
  //     .then(rules => {
  //       return rules.filter(fn);
  //     });
  // }
}