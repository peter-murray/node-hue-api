'use strict';

const ApiError = require('../ApiError')
  , lightStates = require('./lightstate')

  , Light = require('./Light')

  , Group = require('./Group')

  , ResourceLink = require('./ResourceLink')

  , Scene = require('./scenes/Scene')
  , LightScene = require('./scenes/LightScene')
  , GroupScene = require('./scenes/GroupScene')

  , Schedule = require('./Schedule')

  , Rule = require('./rules/Rule')
  , SensorCondition = require('./rules/conditions/SensorCondition')
  , GroupCondition = require('./rules/conditions/GroupCondition')
  , GroupStateAction = require('./rules/actions/GroupStateAction')
  , LightStateAction = require('./rules/actions/LightStateAction')
  , SensorStateAction = require('./rules/actions/SensorStateAction')
  , SceneAction = require('./rules/actions/SceneAction')
  , conditionOperators = require('./rules/conditions/operators/index')

  , Sensor = require('./sensors/Sensor')
  , CLIPGenericFlag = require('./sensors/CLIPGenericFlag')
  , CLIPGenericStatus = require('./sensors/CLIPGenericStatus')
  , CLIPHumidity = require('./sensors/CLIPHumidity')
  , CLIPLightlevel = require('./sensors/CLIPLightlevel')
  , CLIPOpenCLose = require('./sensors/CLIPOpenClose')
  , CLIPPresence = require('./sensors/CLIPPresence')
  , CLIPSwitch = require('./sensors/CLIPSwitch')
  , CLIPTemperature = require('./sensors/CLIPTemperature')
  , Daylight = require('./sensors/Daylight')
  , ZGPSwitch = require('./sensors/ZGPSwitch')
  , ZLLLightlevel = require('./sensors/ZLLLightlevel')
  , ZLLPresence = require('./sensors/ZLLPresence')
  , ZLLSwitch = require('./sensors/ZLLSwitch')
  , ZLLTemperature = require('./sensors/ZLLTemperature')
;

const TYPES_TO_MODEL = {
  light: Light,
  group: Group,
  resourcelink: ResourceLink,
  // scene: Scene, // This is abstract and should not be instantiated
  lightscene: LightScene,
  groupscene: GroupScene,
  schedule: Schedule,
  rule: Rule,
  clipgenericflag: CLIPGenericFlag,
  clipgenericstatus: CLIPGenericStatus,
  cliphumidity: CLIPHumidity,
  cliplightlevel: CLIPLightlevel,
  clipopenclose: CLIPOpenCLose,
  clippresence: CLIPPresence,
  clipswitch: CLIPSwitch,
  cliptemperature: CLIPTemperature,
  daylight: Daylight,
  zgpswitch: ZGPSwitch,
  zlllightlevel: ZLLLightlevel,
  zllpresence: ZLLPresence,
  zllswitch: ZLLSwitch,
  zlltemperature: ZLLTemperature
};

module.exports.lightStates = lightStates;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Instance Check Functions

//TODO this may be questionable
module.exports.isSceneInstance = function(obj) {
  return obj instanceof Scene;
};

module.exports.isGroupSceneInstance = function(obj) {
  return obj instanceof GroupScene;
};

module.exports.isLightSceneInstance = function(obj) {
  return obj instanceof LightScene;
};

module.exports.isRuleInstance = function(obj) {
  return obj instanceof Rule;
};

module.exports.isResourceLinkInstance = function(obj) {
  return obj instanceof ResourceLink;
};

module.exports.isScheduleInstance = function(obj) {
  return obj instanceof Schedule;
};

module.exports.isSensorInstance = function(obj) {
  return obj instanceof Sensor;
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sensors

module.exports.createCLIPGenericFlagSensor = function() {
  return new CLIPGenericFlag();
};

module.exports.createCLIPGenericStatusSensor = function() {
  return new CLIPGenericStatus();
};

module.exports.createCLIPHumiditySensor = function() {
  return new CLIPHumidity();
};

module.exports.createCLIPLightlevelSensor = function() {
  return new CLIPLightlevel();
};

module.exports.createCLIPOpenCloseSensor = function() {
  return new CLIPOpenCLose();
};

module.exports.createCLIPPresenceSensor = function() {
  return new CLIPPresence();
};

module.exports.createCLIPTemperatureSensor = function() {
  return new CLIPTemperature();
};

module.exports.createCLIPSwitchSensor = function() {
  return new CLIPSwitch();
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scenes

module.exports.createLightScene = function() {
  return new LightScene();
};

module.exports.createGroupScene = function() {
  return new GroupScene();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Rules

module.exports.createRule = function() {
  return new Rule();
};

module.exports.ruleConditions = {
  sensor: function(sensor) {
    return new SensorCondition(sensor);
  },

  group: function(id) {
    return new GroupCondition(id);
  },
};

module.exports.ruleActions = {
  light: function(id) {
    return new LightStateAction(id);
  },

  group: function(id) {
    return new GroupStateAction(id);
  },

  sensor: function(id) {
    return new SensorStateAction(id);
  },

  scene: function(id) {
    return new SceneAction(id);
  }
};

module.exports.ruleConditionOperators = conditionOperators;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ResourceLinks

module.exports.createResourceLink = function() {
  return new ResourceLink();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creation Functions - Generic

module.exports.createFromBridge = function(type, id, payload) {
  const ModelObject = TYPES_TO_MODEL[type];

  if (!ModelObject) {
    throw new ApiError(`Unknown type '${type}' to create Bridge Model Object from.`);
  }

  //TODO would be useful to flag this as populated via hue api, not generic JSON

  const instance = new ModelObject(id);
  instance._populate(payload);
  return instance;
};


//TODO probably rename this
module.exports.create = function (payload) {
  if (!payload) {
    throw new ApiError('No payload provided to build object from');
  }

  const payloadDataType = payload.node_hue_api;
  if (!payloadDataType) {
    throw new ApiError('Missing payload Data Type definition');
  }

  const type = payloadDataType.type
    , version = payloadDataType.version || 1
  ;

  if (! type) {
    throw new ApiError('Invalid payload, missing type from the Data Type');
  }

  //TODO build the object
};
