'use strict';

const ApiError = require('../../ApiError')
  , RuleAction = require('./BridgeAction')
  , LightStateAction = require('./LightStateAction')
  , GroupStateAction = require('./GroupStateAction')
  , SensorStateAction = require('./SensorStateAction')
  , SceneAction = require('./SceneAction')
  , ScheduleStateAction = require('./ScheduleStateAction')
;

const REGEX_GROUP_ACTION = /\/groups\/(.*)\/action/
  , REGEX_SENSOR_ACTION = /\/sensors\/(.*)\/state/
  , REGEX_LIGHT_ACTION = /\/lights\/(.*)\//
  , REGEX_SCHEDULE_ACTION = /\/schedules\/(.*)/
  , REGEX_SCHEDULES = /\/schedules$/
  , REGEX_SCENE_ACTION = /\/scenes\/(.*)/
;


module.exports.create = function(data) {
  if (data) {
    if (data instanceof RuleAction) {
      return data;
    } else if (data.address) {
      if (REGEX_GROUP_ACTION.exec(data.address)) {
        return createGroupAction(data.address, data.body);
      } else if (REGEX_LIGHT_ACTION.exec(data.address)) {
        return createLightStateAction(data.address, data.body);
      } else if (REGEX_SENSOR_ACTION.exec(data.address)) {
        return createSensorStateAction(data.address, data.body);
      } else if (REGEX_SCENE_ACTION.exec(data.address)) {
        return createSceneAction(data.address, data.body);
      } else if (REGEX_SCHEDULE_ACTION.exec(data.address)) {
        return createScheduleAction(data.address, data.body);
      } else if (REGEX_SCHEDULES.exec(data.address)) {
        return createSchedulesAction(data.address, data.body);
      } else {
        throw new ApiError(`Failed to match an action to the address ${data.address}`);
      }
    } else {
      throw new ApiError('No address property for action');
    }
  } else {
    throw new ApiError('No data provided to build a RuleAction instance from.');
  }
};


function createLightStateAction(address, body) {
  const match = REGEX_LIGHT_ACTION.exec(address)
    , id = match[1]
  ;
  return new LightStateAction(id).withState(body);
}

function createGroupAction(address, body) {
  const match = REGEX_GROUP_ACTION.exec(address)
    , group = match[1]
  ;
  return new GroupStateAction(group).withState(body);
}

function createSensorStateAction(address, body) {
  const match = REGEX_SENSOR_ACTION.exec(address)
    , id = match[1]
  ;
  return new SensorStateAction(id).withState(body);
}

function createScheduleAction(address, body) {
  const match = REGEX_SCHEDULE_ACTION.exec(address)
    , id = match[1]
  ;
  return new ScheduleStateAction(id).withState(body);
}

function createSchedulesAction(address, body) {
  const match = REGEX_SCHEDULES.exec(address);

  if (!match) {
    throw new ApiError(`Not a valid schedules action, '${address}'`);
  }
  return new ScheduleStateAction(null).withState(body);
}

function createSceneAction(address, body) {
  const match = REGEX_SCENE_ACTION.exec(address)
    , id = match[1]
  ;

  if (!match) {
    throw new ApiError(`Not a valid scenes action, '${address}'`);
  }

  return new SceneAction(id).withState(body);
}