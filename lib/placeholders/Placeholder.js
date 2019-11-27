'use strict';

const ApiError = require('../ApiError');


module.exports = class Placeholder {

  constructor(defaultName, name) {
    this._name = name || defaultName;
  }

  get name() {
    return this._name;
  }

  get typeDefinition() {
    return this._type;
  }

  set typeDefinition(type) {
    this._type = type;
  }

  inject(uri, parameters) {
    const placeholderText = `<${this.name}>`;

    if (uri.indexOf(placeholderText) > -1) {
      return uri.replace(placeholderText, this.getValue(parameters));
    }
    return uri;
  }

  getValue(parameters) {
    const typeDefinition = this.typeDefinition;

    if (!typeDefinition) {
      throw new ApiError('No type definition has been specified for placeholder');
    }

    const parameter = parameters ? parameters[this.name] : null;
    const value = this._getParameterValue(parameter);
    return typeDefinition.getValue(value);
  }

  _getParameterValue(parameter) {
    return parameter;
  }

  toString() {
    const type = this.typeDefinition;
    return `${this.name}: { type:${type.type}, optional:${type.optional}, defaultValue:${type.defaultValue} }`;
  }
};