"use strict";

var utils = require("./utils")
  , Scene = function () {
  }
  ;

module.exports.create = function () {
  var scene
    , arg
    ;

  if (arguments.length == 0) {
    scene = new Scene();
  } else {
    arg = arguments[0];

    if (arg instanceof Scene) {
      scene = arg;
    } else {
      scene = new Scene();

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


Scene.prototype.withName = function(name) {
  utils.combine(this, {name: utils.getStringValue(name, 32)});
  return this;
};

Scene.prototype.withLights = function(lightIds) {
  var ids;

  if (Array.isArray(lightIds)) {
    ids = lightIds;
  } else {
    ids = Array.prototype.slice.call(arguments);
  }

  utils.combine(this, {lights: utils.createStringValueArray(ids)});
  return this;
};

Scene.prototype.withTransitionTime = function(milliseconds) {
  utils.combine(this, {transitiontime: milliseconds});
  return this;
};

Scene.prototype.withAppData = function(data) {
  utils.combine(this, {appdata: {data: data, version: 1}});
  return this;
};

Scene.prototype.withPicture = function(picture) {
  utils.combine(this, {picture: picture});
  return this;
};

Scene.prototype.withRecycle = function(recycle) {
  utils.combine(this, {"recycle": recycle});
  return this;
};