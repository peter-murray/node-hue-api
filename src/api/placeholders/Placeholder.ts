import { types } from '@peter-murray/hue-bridge-model';
import { ApiError } from '../../ApiError';
import { KeyValueType } from '../../commonTypes';

type Type = types.BaseType<any>;

export class Placeholder {

  private readonly _name: string;

  private _type: Type;

  constructor(type: Type, defaultName: string, name?: string) {
    this._name = name || defaultName;
    this._type = type;
  }

  get name(): string {
    return this._name;
  }

  get typeDefinition(): Type {
    return this._type;
  }

  set typeDefinition(type: Type) {
    this._type = type;
  }

  inject(uri: string, parameters: object) {
    const placeholderText = `<${this.name}>`;

    if (uri.indexOf(placeholderText) > -1) {
      return uri.replace(placeholderText, this.getValue(parameters));
    }
    return uri;
  }

  getValue(parameters: KeyValueType) {
    const typeDefinition = this.typeDefinition;

    if (!typeDefinition) {
      throw new ApiError('No type definition has been specified for placeholder');
    }

    const parameter: any = parameters ? parameters[this.name] : undefined;
    const value = this._getParameterValue(parameter);
    return typeDefinition.getValue(value);
  }

  protected _getParameterValue(parameter: any): any {
    return parameter;
  }

  toString(): string {
    const type = this.typeDefinition;
    return `${this.name}: { type:${type.type}, optional:${type.optional}, defaultValue:${type.defaultValue} }`;
  }
}