'use strict';

const ApiError = require('../../../ApiError');


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

    const value = parameters ? parameters[this._name] : null;
    return typeDefinition.getValue(value);
  }
};