import { Placeholder } from './Placeholder';
import { model, types } from '@peter-murray/hue-bridge-model';

export class UsernamePlaceholder extends Placeholder {

  constructor(name?: string) {
    const type = new types.StringType({name: 'username', minLength: 1, optional: false});
    super(type, 'username', name);
  }
}
