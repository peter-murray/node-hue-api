'use strict';

const api = require('./api/index')
  , discovery = require('./api/discovery/index')
  , v3Model = require('@peter-murray/hue-bridge-model').v3Model
  , ApiError = require('./ApiError')
  , util = require('./util')
;

// Definition of the v3 API for node-hue-api
module.exports = {
  api: api,

  discovery: {
    upnpSearch: (timeout) => {
      util.deprecatedFunction(
        '6.x',
        `require('node-hue-api').v3.discovery.upnpSearch()`,
        `Use require('node-hue-api').discovery.upnpSearch()`);
      return discovery.upnpSearch(timeout);
    },

    nupnpSearch: () => {
      util.deprecatedFunction(
        '6.x',
        `require('node-hue-api').v3.discovery.nupnpSearch()`,
        `Use require('node-hue-api').discovery.nupnpSearch()`);
      return discovery.nupnpSearch();
    },

    description: (ipAddress) => {
      util.deprecatedFunction(
        '6.x',
        `require('node-hue-api').v3.discovery.description(ipAddress)`,
        `Use require('node-hue-api').discovery.description(ipAddress)`);
      return discovery.description(ipAddress);
    },
  },


  //TODO think about removing this and deferring to the model
  lightStates: v3Model.lightStates,

  model: v3Model,

  //TODO remove
  sensors: sensorsObject(
    'Sensors are now contained in the v3.model interface\n' +
    'You can use the v3.model.createCLIP[xxx]Sensor() where [xxx] is the type of Sensor to instantiate a sensor.'
  ),

  //TODO remove
  Scene: classRemoved(
    'Scenes are no longer exposed as a class.\n' +
    'Create a Scene using v3.model.createLightScene() or v3.model.createGroupScene()'
  ),

  //TODO remove
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