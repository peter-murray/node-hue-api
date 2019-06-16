'use strict';

//TODO this is a bit of a mess now and has invalid references, probably document to use new objects...

const ApiError = require('../lib/ApiError')
  , Schedule = require('../lib/bridge-model/Schedule')
  , dateTime = require('../lib/bridge-model/datetime/index')
  ;


module.exports = class ScheduledEventBuilder {

  constructor() {
    this._schedule = new Schedule();
  }

  getSchedule() {
    return this._schedule;
  }

  withName(value) {
    this._schedule.name = value;
    return this;
  }

  withDescription(value) {
    this._schedule.description = value;
    return this;
  }

  withCommand(value) {
    const type = typeof(value);
    let commandObject = null;

    // The command is limited to 90 characters, so if a string is passed, convert it to an object and back into JSON.
    if (type === 'string') {
      commandObject = JSON.parse(value);
    } else {
      commandObject = value;
    }
    this._schedule.command = _validateCommand(commandObject);
    return this;
  }

  withEnabledState(value) {
    this._schedule.status = value;
    return this;
  }

  at(value) {
    this._schedule.localtime = dateTime.create(value);
    return this;
  }

  on(value) {
    return this.at(value);
  }

  when(value) {
    return this.at(value);
  }

  atRandomizedTime(value) {
    throw new ApiError('Not implemented');
  }

  atRecurringTime(value) {
    throw new ApiError('Not implemented');
  }

  atRecurringRandomizedTime(value) {
    throw new ApiError('Not implemented');
  }
};




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TODO move these elsewhere or remove entirely as they belong to other objects

/**
 * Perform validation on a command object to verify it can be considered valid.
 * @param commandObject the object representing the command to be validated.
 * @throws {ApiError} if a problem is encountered with the command
 * @private
 */
function _validateCommand(commandObject) {
  let address
    , method
    , body
  ;

  if (commandObject) {
    address = commandObject.address;
    if (address) {
      //TODO expand the regex to match proper end points valid for schedules
      var addressPattern = /^\/api\/\.*\/\.*/;
      if (addressPattern.test(address)) {
        throw new ApiError('The \'address\' property must begin with \'/api\' to be a valid endpoint');
      }
    } else {
      throw new ApiError('The \'address\' property must be specified.');
    }

    //TODO link this with the valid endpoints in the address
    method = commandObject.method;
    if (!commandObject.method) {
      throw new ApiError('The \'method\' must be specified.');
    }

    body = commandObject.body;
    if (!commandObject.body) {
      throw new ApiError('The \'body\' property must be specified.');
    }
  } else {
    throw new ApiError('Command is not defined');
  }

  return {
    address: address,
    method: method,
    body: body
  };
}