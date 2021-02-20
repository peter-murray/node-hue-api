import { Placeholder } from './Placeholder';
import { model, types } from '@peter-murray/hue-bridge-model';

export class GroupIdPlaceholder extends Placeholder {

  constructor(name?: string) {
    const type = new types.UInt16Type({name: 'group id', optional: false});
    super(type, 'id', name);
  }

  protected _getParameterValue(parameter: any): any {
    if (model.instanceChecks.isGroupInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
}