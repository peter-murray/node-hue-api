'use strict';

const Scene = require('../lib/bridge-model/Scene');


const Builder = function() {
  this._scene = new Scene();
};

module.exports.create = function () {
  var scene
    , arg
  ;

  if (arguments.length === 0) {
    scene = new Builder();
  } else {
    arg = arguments[0];

    if (arg instanceof Builder) {
      scene = arg;
    } else {
      scene = new Builder();

      // try to populate the new scene using any values that match scene properties
      if (arg.name) {
        scene.withName(arg.name);
      }

      if (arg.lights) {
        scene.withLights(arg.lights);
      }

      if (arg.transitionTime) {
        scene.withTransitionTime(arg.transitionTime);
      }

      if (arg.data || arg.appData) {
        scene.withAppData(arg.data || arg.appData);
      }

      if (arg.picture) {
        scene.withPicture(arg.picture);
      }
    }
  }
  return scene;
};

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