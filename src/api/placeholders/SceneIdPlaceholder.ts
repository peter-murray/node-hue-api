import { Placeholder } from './Placeholder';
import { model, types } from '@peter-murray/hue-bridge-model';

export class SceneIdPlaceholder extends Placeholder {

  constructor(name?: string) {
    const type = new types.StringType({name: 'scene id', optional: false});
    super(type,'id', name);
  }

  protected _getParameterValue(parameter: any) {
    if (model.instanceChecks.isSceneInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
}