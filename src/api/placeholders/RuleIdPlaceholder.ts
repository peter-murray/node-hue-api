import { Placeholder } from './Placeholder';
import { model, types } from '@peter-murray/hue-bridge-model';

export class RuleIdPlaceholder extends Placeholder {

  constructor(name?: string) {
    const type = new types.UInt16Type({name: 'rule id', optional: false});
    super(type, 'id', name);
  }

  protected _getParameterValue(parameter: any) {
    if (model.instanceChecks.isRuleInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
}