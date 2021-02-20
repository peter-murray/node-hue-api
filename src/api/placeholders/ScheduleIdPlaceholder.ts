import { Placeholder } from './Placeholder';
import { model, types } from '@peter-murray/hue-bridge-model';

export class ScheduleIdPlaceholder extends Placeholder {

  constructor(name?: string) {
    const type = new types.UInt16Type({name: 'schedule id', optional: false});
    super(type, 'id', name);
  }

  protected _getParameterValue(parameter: any) {
    if (model.instanceChecks.isScheduleInstance(parameter)) {
      return parameter.id;
    } else {
      return super._getParameterValue(parameter);
    }
  }
}