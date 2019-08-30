'use strict';


module.exports = class PlaceHolder {

  constructor(defaultName, name) {
    if (name) {
      this._name = name;
    } else {
      this._name = defaultName;
    }
  }

  get name() {
    return this._name;
  }

  inject(uri, parameters) {
    const placeholderText = `<${this.name}>`;

    if (uri.indexOf(placeholderText) > -1) {
      return uri.replace(placeholderText, this.getValue(parameters));
    }
    return uri;
  }

  getValue(parameters) {
    return parameters ? parameters[this._name] : null;
  }
};