'use strict';

const Scene = require('../lib/bridge-model/Scene');


const Builder = function() {
  this._scene = new Scene();
};
module.exports = Builder;

Builder.prototype.getScene = function() {
  return this._scene;
};

Builder.prototype.withName = function (name) {
  this._scene.name = name;
  return this;
};

Builder.prototype.withLights = function (lightIds) {
  let ids;

  if (Array.isArray(lightIds)) {
    ids = lightIds;
  } else {
    ids = Array.prototype.slice.call(arguments);
  }

  this._scene.lights = ids;
  return this;
};

Builder.prototype.withTransitionTime = function (milliseconds) {
  this._scene.transitiontime = milliseconds;
  return this;
};

Builder.prototype.withAppData = function (data) {
  let appData;

  if (data.version) {
    appData = data;
  } else {
    appData = {
      version: 1,
      data: data
    };
  }
  this._scene.appdata = appData;
  return this;
};

Builder.prototype.withPicture = function (picture) {
  this._scene.picture = picture;
  return this;
};

Builder.prototype.withRecycle = function (recycle) {
  this._scene.recycle = recycle;
  return this;
};