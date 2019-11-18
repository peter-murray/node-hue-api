'use strict';

const api = require('./api/index')
  , discovery = require('./api/discovery/index')
  , bridgeModel = require('./model')
  , ApiError = require('./ApiError')
;

// Definition of the v3 API for node-hue-api
module.exports = {
  api: api,
  discovery: discovery,

  //TODO think about removing this and deferring to the model
  lightStates: bridgeModel.lightStates,

  model: bridgeModel,

  sensors: sensorsObject(
    'Sensors are now contained in the v3.model interface\n' +
    'You can use the v3.model.createCLIP[xxx]Sensor() where [xxx] is the type of Sensor to instantiate a sensor.'
  ),

  Scene: classRemoved(
    'Scenes are no longer exposed as a class.\n' +
    'Create a Scene using v3.model.createLightScene() or v3.model.createGroupScene()'
  ),

  rules: rulesObject(
    'Rules are now exposed under the v3.model interface.\n' +
    'Create a rule using v3.model.createRule()\n' +
    'Create a RuleCondition using v3.model.ruleConditions.[sensor|group]()\n' +
    'Create a RuleAction using v3.mode.ruleActions.[light|group|sensor|scene]\n'
  ),
};

function sensorsObject(msg) {
  return {
    clip: {
      GenericFlag: classRemoved(msg),
      OpenClose: classRemoved(msg),
      GenericStatus: classRemoved(msg),
      Humidity: classRemoved(msg),
      Lightlevel: classRemoved(msg),
      Presence: classRemoved(msg),
      Switch: classRemoved(msg),
      Temperature: classRemoved(msg),
    }
  }
}

function rulesObject(msg) {
  return {
    Rule: classRemoved(msg),
    conditions: {
      group: functionRemoved(msg),
      sensor: functionRemoved(msg),
    },
    actions: {
      light: functionRemoved(msg),
      group: functionRemoved(msg),
      scene: functionRemoved(msg),
    },
  };
}

function functionRemoved(msg) {
  return function () {
    throw new ApiError(msg);
  };
}

function classRemoved(msg) {
  return class RemovedClass {
    constructor() {
      throw new ApiError(msg);
    }
  };
}