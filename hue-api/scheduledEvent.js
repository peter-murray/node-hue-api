"use strict";

var util = require("util")
  , utils = require("./utils")
  , errors = require("./errors")
  ;

var patterns = {
    time: "\\d{2}:\\d{2}:\\d{2}",
    weekday: "W[0-9]{1,3}",
    date: "\\d{4}-\\d{2}-\\d{2}"
  },
  regularExpressions = {
    absolute: new RegExp(util.format("%sT%s", patterns.date, patterns.time)),
    randomized: new RegExp(util.format("%sT%sA%s", patterns.date, patterns.time, patterns.time)),
    recurring: new RegExp(util.format("%s\/T%s", patterns.weekday, patterns.time)),
    recurringRandomized: new RegExp(util.format("%s\/T%sA%s", patterns.weekday, patterns.time, patterns.time)),
    timer: new RegExp(util.format("PT%s", patterns.time)),
    timerRandom: new RegExp(util.format("PT%sA%s", patterns.time, patterns.time)),
    timerRecurringCount: new RegExp(util.format("R\\d{2}\/PT%s", patterns.time)),
    timerRecurring: new RegExp(util.format("R\/PT%s", patterns.time)),
    timerRecurringCountRandom: new RegExp(util.format("R\\d{2}\/PT%sA%s", patterns.time, patterns.time))
  };

var Schedule = function () {
};

module.exports.create = function () {
  var schedule,
    arg;

  if (arguments.length == 0) {
    schedule = new Schedule();
  } else {
    arg = arguments[0];
    if (arg instanceof Schedule) {
      schedule = arg;
    } else {
      schedule = new Schedule();

      // try to populate the new schedule using any values that match schedule properties
      if (arg.name) {
        schedule.withName(arg.name);
      }

      if (arg.description) {
        schedule.withDescription(arg.description);
      }

      if (arg.time || arg.localtime) {
        schedule.at(arg.time || arg.localtime);
      }

      if (arg.command) {
        schedule.withCommand(arg.command);
      }

      if (arg.status) {
        schedule.withEnabledState(arg.status);
      }
    }
  }

  return schedule;
};

Schedule.prototype.at = function (time) {
  utils.combine(this, _getTimeValue(time));
  return this;
};

Schedule.prototype.on = function (time) {
  utils.combine(this, _getTimeValue(time));
  return this;
};

Schedule.prototype.when = function (time) {
  utils.combine(this, _getTimeValue(time));
  return this;
};

Schedule.prototype.atRandomizedTime = function(time) {
  if (regularExpressions.randomized.test(time)) {
    utils.combine(this, {localtime: time});
  } else {
    throw new errors.ApiError(util.format("Time '%s' is not correct for randomized time", time));
  }
};

Schedule.prototype.atRecurringTime = function (time) {
  if (regularExpressions.recurring.test(time)) {
    utils.combine(this, {localtime: time});
  } else {
    throw new errors.ApiError(util.format("Time '%s' is not correct for recurring time", time));
  }
};

Schedule.prototype.atRecurringRandomizedTime = function(time) {
  if (regularExpressions.recurringRandomized.test(time)) {
    utils.combine(this, {localtime: time});
  } else {
    throw new errors.ApiError(util.format("Time '%s' is not correct for recurring randomized time", time));
  }
};

Schedule.prototype.withName = function (name) {
  // The 1.0 API only accepts up to 32 characters for the name
  var nameCharMax = 32;

  utils.combine(this, {"name": utils.getStringValue(name, nameCharMax)});
  return this;
};

Schedule.prototype.withDescription = function (description) {
  // The 1.0 API only accepts up to 64 characters for the description
  utils.combine(this, {"description": utils.getStringValue(description, 64)});
  return this;
};

Schedule.prototype.withCommand = function (command) {
  var type = typeof(command),
    commandObject = null;

  // The command is limited to 90 characters, so if a string is passed, convert it to an object and back into JSON.

  if (type === "string") {
    commandObject = JSON.parse(command);
  } else {
    commandObject = command;
  }

  _validateCommand(commandObject);

  utils.combine(this, {"command": commandObject});
  return this;
};

Schedule.prototype.withEnabledState = function (enabled) {
  var state;

  if (enabled === "enabled") {
    state = "enabled";
  } else if (enabled === "disabled") {
    state = "disabled";
  } else {
    state = enabled ? "enabled" : "disabled";
  }

  utils.combine(this, {status: state});
};

function _getTimeValue(time) {
  var result = {}
    , type = typeof time
    , timeValue = null
    ;

  if (type === 'string') {
    // Check the string against all known patterns
    Object.keys(regularExpressions).forEach(function (regex) {
      if (!timeValue && regularExpressions[regex].test(time)) {
        timeValue = time;
      }
    });

    if (!timeValue) {
      // We don't have a match, but it may still be a valid time, so attempt to parse it
      timeValue = _convertToDate(time);
    }
  } else if (type === 'number') {
    timeValue = _convertNumberToHueTime(time);
  } else if (type === 'object') {
    if (time instanceof Date) {
      timeValue = _convertNumberToHueTime(time.getTime())
    }
  }

  if (timeValue === null) {
    throw new errors.ApiError("Invalid time value, '" + time + "'");
  }

  result.localtime = timeValue;
  return result;
}

function _convertNumberToHueTime(number) {
  var result = null;

  if (!isNaN(number)) {
    result = _convertDateToHueTime(new Date(number));
  }
  return result;
}

function _convertDateToHueTime(date) {
  var result = null
    , str
    ;

  if (date) {
    str = date.toJSON();
    result = str.substring(0, str.lastIndexOf("."))
  }

  return result;
}

function _convertToDate(str) {
  var result = null
    , time = Date.parse(str)
    ;

  if (!isNaN(time)) {
    result = _convertNumberToHueTime(time);
  }

  return result;
}

/**
 * Perform validation on a command object to verify it can be considered valid.
 * @param commandObject the object representing the command to be validated.
 * @throws {ApiError} if a problem is encountered with the command
 * @private
 */
function _validateCommand(commandObject) {
  var address,
    method,
    body;

  if (commandObject) {
    address = commandObject.address;
    if (address) {
      //TODO expand the regex to match proper end points valid for schedules
      var addressPattern = /^\/api\/\.*\/\.*/;
      if (addressPattern.test(address)) {
        throw new errors.ApiError("The 'address' property must begin with '/api' to be a valid endpoint");
      }
    } else {
      throw new errors.ApiError("The 'address' property must be specified.");
    }

    //TODO link this with the valid endpoints in the address
    method = commandObject.method;
    if (!commandObject.method) {
      throw new errors.ApiError("The 'method' must be specified.");
    }

    body = commandObject.body;
    if (!commandObject.body) {
      throw new errors.ApiError("The 'body' property must be specified.");
    }
  } else {
    throw new errors.ApiError("Command is not defined");
  }
}