'use strict';

const ApiError = require('../ApiError')
  , util = require('../util')
  , lightStates = require('./lightstate')
  , timePatterns = require('./timePatterns')

  , Capabilities = require('./Capabilities')

  , BridgeConfiguration = require('./BridgeConfiguration')

  , Light = require('./Light')

  , Group = require('./groups/Group')
  , Entertainment = require('./groups/Entertainment')
  , LightGroup = require('./groups/LightGroup')
  , Lightsource = require('./groups/Lightsource')
  , Luminaire = require('./groups/Luminaire')
  , Room = require('./groups/Room')
  , Zone = require('./groups/Zone')

  , ResourceLink = require('./ResourceLink')

  , Scene = require('./scenes/Scene')
  , LightScene = require('./scenes/LightScene')
  , GroupScene = require('./scenes/GroupScene')

  , Schedule = require('./Schedule')

  , Rule = require('./rules/Rule')
  , SensorCondition = require('./rules/conditions/SensorCondition')
  , GroupCondition = require('./rules/conditions/GroupCondition')
  , GroupStateAction = require('./actions/GroupStateAction')
  , LightStateAction = require('./actions/LightStateAction')
  , SensorStateAction = require('./actions/SensorStateAction')
  , SceneAction = require('./actions/SceneAction')
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

  capabilities: Capabilities,

  configuration: BridgeConfiguration,

  entertainment: Entertainment,
  lightgroup: LightGroup,
  lightsource: Lightsource,
  luminaire: Luminaire,
  room: Room,
  zone: Zone,

  resourcelink: ResourceLink,

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
module.exports.timePatterns = timePatterns;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Instance Check Functions

module.exports.isLightInstance = function (obj) {
  return obj instanceof Light;
};

module.exports.isSceneInstance = function (obj) {
  return obj instanceof Scene;
};

module.exports.isGroupSceneInstance = function (obj) {
  return obj instanceof GroupScene;
};

module.exports.isLightSceneInstance = function (obj) {
  return obj instanceof LightScene;
};

module.exports.isRuleInstance = function (obj) {
  return obj instanceof Rule;
};

module.exports.isResourceLinkInstance = function (obj) {
  return obj instanceof ResourceLink;
};

module.exports.isScheduleInstance = function (obj) {
  return obj instanceof Schedule;
};

module.exports.isSensorInstance = function (obj) {
  return obj instanceof Sensor;
};

module.exports.isGroupInstance = function (obj) {
  return obj instanceof Group;
};

module.exports.isBridgeConfigurationInstance = function (obj) {
  return obj instanceof BridgeConfiguration;
};


module.exports.createBridgeConfiguration = function () {
  return new BridgeConfiguration();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Groups

module.exports.createEntertainment = function () {
  return new Entertainment();
};

module.exports.createLightGroup = function () {
  return new LightGroup();
};

module.exports.createRoom = function () {
  return new Room();
};

module.exports.createZone = function () {
  return new Zone();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sensors

module.exports.createCLIPGenericFlagSensor = function () {
  return new CLIPGenericFlag();
};

module.exports.createCLIPGenericStatusSensor = function () {
  return new CLIPGenericStatus();
};

module.exports.createCLIPHumiditySensor = function () {
  return new CLIPHumidity();
};

module.exports.createCLIPLightlevelSensor = function () {
  return new CLIPLightlevel();
};

module.exports.createCLIPOpenCloseSensor = function () {
  return new CLIPOpenCLose();
};

module.exports.createCLIPPresenceSensor = function () {
  return new CLIPPresence();
};

module.exports.createCLIPTemperatureSensor = function () {
  return new CLIPTemperature();
};

module.exports.createCLIPSwitchSensor = function () {
  return new CLIPSwitch();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scenes

module.exports.createLightScene = function () {
  return new LightScene();
};

module.exports.createGroupScene = function () {
  return new GroupScene();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Schedules

module.exports.createSchedule = function () {
  return new Schedule();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Actions

module.exports.actions = {
  light: function (light) {
    return new LightStateAction(light);
  },

  group: function (group) {
    return new GroupStateAction(group);
  },

  sensor: function (sensor) {
    return new SensorStateAction(sensor);
  },

  scene: function (scene) {
    return new SceneAction(scene);
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Rules

module.exports.createRule = function () {
  return new Rule();
};

module.exports.ruleConditions = {
  sensor: function (sensor) {
    return new SensorCondition(sensor);
  },

  group: function (id) {
    return new GroupCondition(id);
  },
};

module.exports.ruleConditionOperators = conditionOperators;

module.exports.ruleActions = {
  light: function (light) {
    util.deprecatedFunction('5.x', 'model.ruleActions.light(light)', 'Use model.actions.light(light) instead');
    return new LightStateAction(light);
  },

  group: function (group) {
    util.deprecatedFunction('5.x', 'model.ruleActions.group(group)', 'Use model.actions.group(group) instead');
    return new GroupStateAction(group);
  },

  sensor: function (sensor) {
    util.deprecatedFunction('5.x', 'model.ruleActions.sensor(sensor)', 'Use model.actions.sensor(sensor) instead');
    return new SensorStateAction(sensor);
  },

  scene: function (scene) {
    util.deprecatedFunction('5.x', 'model.ruleActions.scene(scene)', 'Use model.actions.scene(scene) instead');
    return new SceneAction(scene);
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ResourceLinks

module.exports.createResourceLink = function () {
  return new ResourceLink();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creation Functions - Generic

module.exports.createFromBridge = function (type, id, payload) {
  const ModelObject = TYPES_TO_MODEL[type];

  if (!ModelObject) {
    throw new ApiError(`Unknown type '${type}' to create Bridge Model Object from.`);
  }

  const instance = new ModelObject(id);
  instance._populate(payload);
  return instance;
};


module.exports.createFromJson = function (payload) {
  if (!payload) {
    throw new ApiError('No payload provided to build object from');
  }

  const payloadDataType = payload.node_hue_api;
  if (!payloadDataType) {
    throw new ApiError('Missing payload Data Type definition');
  }

  const type = payloadDataType.type
    , version = payloadDataType.version || 0
  ;

  if (!type) {
    throw new ApiError('Invalid payload, missing type from the Data Type');
  }

  if (version === 0) {
    throw new ApiError(`Unsupported version number ${version}, for JSON payload`);
  }

  // Default to using bridge data construction until we diverge
  return module.exports.createFromBridge(type, payload.id, payload);
};
