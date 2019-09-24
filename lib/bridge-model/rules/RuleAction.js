'use strict';

const ApiError = require('../../ApiError');

const REGEX_GROUP_ACTION = /\/groups\/(.*)\/action/
  , REGEX_SENSOR_ACTION = /\/sensors\/(.*)\/state/
  , REGEX_LIGHT_ACTION = /\/lights\/(.*)\//
  , REGEX_SCHEDULE_ACTION = /\/schedules\/(.*)/
  , REGEX_SCHEDULES = /\/schedules$/
;


module.exports.create = function(data) {
  if (data) {
    if (data.address) {
      if (REGEX_GROUP_ACTION.exec(data.address)) {
        return createGroupAction(data.address, data.body);
      } else if (REGEX_LIGHT_ACTION.exec(data.address)) {
        return createLightStateAction(data.address, data.body);
      } else if (REGEX_SENSOR_ACTION.exec(data.address)) {
        return createSensorStateAction(data.address, data.body);
      } else if (REGEX_SCHEDULE_ACTION.exec(data.address)) {
        return createSchedulesAction(data.address, data.body);
      } else if (REGEX_SCHEDULES.exec(data.address)) {
        return createScheduleAction(data.address, data.body);
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
  return new LightStateAction(id, body);
}

function createGroupAction(address, body) {
  const match = REGEX_GROUP_ACTION.exec(address)
    , id = match[1]
  ;
  return new GroupStateAction(id, body);
}

function createSensorStateAction(address, body) {
  const match = REGEX_SENSOR_ACTION.exec(address)
    , id = match[1]
  ;
  return new SensorStateAction(id, body);
}


function createSchedulesAction(address, body) {
  const match = REGEX_SCHEDULE_ACTION.exec(address)
    , id = match[1]
  ;
  return new SensorStateAction(id, body);//TODO need a schedule
}

function createScheduleAction(address, body) {
  const match = REGEX_SCHEDULES.exec(address);

  if (!match) {
    throw new ApiError(`Not a valid schedule action, '${address}'`);
  }
  return new SensorStateAction(null, body);//TODO need a schedule
}


class RuleAction {

  constructor(address, method, body) {
    this._data = {
      address: address,
      method: method,
      body: body || {},
    };
  }

  get payload() {
    return Object.assign({}, this._data);
  }
}


class LightStateAction extends RuleAction {

  constructor(lightId, body) {
    // TODO need to validate the payload for the light is valid for the specified light id

    super(`/lights/${lightId}/state`, 'PUT', body);
  }
}

class GroupStateAction extends RuleAction {

  constructor(groupId, body) {
    //TODO check the group state is correct for this type of action
    super(`/groups/${groupId}/action`, 'PUT', body);
  }
}

class SensorStateAction extends RuleAction {

  constructor(sensorId, body) {
    //TODO need to cater for the state payload
    super(`/sensors/${sensorId}/state`, 'PUT', null);
  }
}

/*

//TODO need to support this
"actions": [
        {
          "address": "/schedules/2",
          "method": "PUT",
          "body": {
            "status": "enabled"
          }
        },


actions": [
        {
          "address": "/schedules",
          "method": "PUT",
          "body": {
            "localtime": "PT00:00:10",
            "status": "enabled"
          }
        }
      ]

 */