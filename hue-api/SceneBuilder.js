'use strict';

const Scene = require('../lib/model/scenes/Scene');


const SceneBuilder = function() {
  this._scene = new Scene();
};
module.exports = SceneBuilder;

SceneBuilder.prototype.getScene = function() {
  return this._scene;
};

SceneBuilder.prototype.withName = function (name) {
  this._scene.name = name;
  return this;
};

SceneBuilder.prototype.withLights = function (lightIds) {
  let ids;

  if (Array.isArray(lightIds)) {
    ids = lightIds;
  } else {
    ids = Array.prototype.slice.call(arguments);
  }

  this._scene.lights = ids;
  return this;
};

SceneBuilder.prototype.withTransitionTime = function (milliseconds) {
  this._scene.transitiontime = milliseconds;
  return this;
};

SceneBuilder.prototype.withAppData = function (data) {
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

SceneBuilder.prototype.withPicture = function (picture) {
  this._scene.picture = picture;
  return this;
};

SceneBuilder.prototype.withRecycle = function (recycle) {
  this._scene.recycle = recycle;
  return this;
};