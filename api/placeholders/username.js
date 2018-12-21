"use strict";

module.exports = function(data) {
  return new UsernamePlaceholder(data);
};

let UsernamePlaceholder = function(data) {
  this._name = "username";
  this._data = data
};

UsernamePlaceholder.prototype.getName = function() {
  return this._name;
};

UsernamePlaceholder.prototype.getValue = function() {
  return this._data;
};