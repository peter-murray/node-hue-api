'use strict';

const ApiError = require('../api/ApiError')
  , Schedule = require('../bridge-model/Schedule')
  , dateTime = require('../bridge-model/datetime/index')
  ;


const Builder = function () {
  this._schedule = new Schedule({});
};

//TODO remove this
module.exports.create = function () {
  let builder,
    arg;

  if (arguments.length === 0) {
    builder = new Builder();
  } else {
    arg = arguments[0];
    if (arg instanceof Builder) {
      builder = arg;
    } else {
      builder = new Builder();

      // try to populate the new schedule using any values that match schedule properties
      if (arg.name) {
        builder.withName(arg.name);
      }

      if (arg.description) {
        builder.withDescription(arg.description);
      }

      if (arg.time || arg.localtime) {
        builder.at(arg.time || arg.localtime);
      }

      if (arg.command) {
        builder.withCommand(arg.command);
      }

      if (arg.status) {
        builder.withEnabledState(arg.status);
      }
    }
  }

  return builder;
};

Builder.prototype.getSchedule = function() {
  return this._schedule;
};

Builder.prototype.at = function (time) {
  this._schedule.localtime = _getTimeValue(time);
  return this;
};
Builder.prototype.on = module.exports.at;
Builder.prototype.when = module.exports.when;

Builder.prototype.atRandomizedTime = function(time) {
  if (regularExpressions.randomized.test(time)) {
    return this.at(time);
  } else {
    throw new ApiError(`Time '${time}' is not correct for randomized time`);
  }
};

Builder.prototype.atRecurringTime = function (time) {
  if (regularExpressions.recurring.test(time)) {
    return this.at(time);
  } else {
    throw new ApiError(`Time '${time}' is not correct for recurring time`);
  }
};

Builder.prototype.atRecurringRandomizedTime = function(time) {
  if (regularExpressions.recurringRandomized.test(time)) {
    return this.at(time);
  } else {
    throw new ApiError(`Time '${time}' is not correct for recurring randomized time`);
  }
};

Builder.prototype.withName = function (name) {
  this._schedule.name = name;
  return this;
};

Builder.prototype.withDescription = function (description) {
  this._schedule.description = description;
  return this;
};

Builder.prototype.withCommand = function (command) {
  var type = typeof(command),
    commandObject = null;

  // The command is limited to 90 characters, so if a string is passed, convert it to an object and back into JSON.

  if (type === 'string') {
    commandObject = JSON.parse(command);
  } else {
    commandObject = command;
  }

  this._schedule.command = _validateCommand(commandObject);
  return this;
};

Builder.prototype.withEnabledState = function (enabled) {
  this._schedule.status = enabled;
  return this;
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TODO move these elsewhere or remove entirely as they belong to other objects

function _getTimeValue(time) {
  return dateTime.create(time);
}


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