import { Placeholder } from './Placeholder';
import { model, types } from '@peter-murray/hue-bridge-model';

export class LightIdPlaceholder extends Placeholder {

  constructor(name?: string) {
    const type = new types.UInt16Type({name: 'light id', optional: false});
    super(type, 'id', name);
  }

  protected _getParameterValue(parameter: any) {
    if (model.instanceChecks.isLightInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
}