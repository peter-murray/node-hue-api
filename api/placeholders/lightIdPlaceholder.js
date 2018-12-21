"use strict";

module.exports = function(data) {
  return new LightIdPlaceholder(data);
};

let LightIdPlaceholder = function(data) {
  this._name = "id";
  this._data = data
};

LightIdPlaceholder.prototype.getName = function() {
  return this._name;
};

LightIdPlaceholder.prototype.getValue = function() {
  return this._data;
  //TODO need to perform validation on the allowed ranges of the value provided
};