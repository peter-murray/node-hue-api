"use strict";

var utils = require("./utils"),
    errors = require("./errors"),
    Schedule = function () {
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
                scedule.withEnabledState(arg.status);
            }
        }
    }

    return schedule;
};

Schedule.prototype.at = function (time) {
    utils.combine(this, _getTime(time));
    return this;
};

Schedule.prototype.on = function (time) {
    utils.combine(this, _getTime(time));
    return this;
};

Schedule.prototype.when = function (time) {
    utils.combine(this, _getTime(time));
    return this;
};

//Schedule.prototype.atRandomizedTime = function(time, random) {
//    //Randomized time	[YYYY]:[MM]:[DD]T[hh]:[mm]:[ss]A[hh]:[mm]:[ss]
//    //([date]T[time]A[time])
//};
//
//Schedule.prototype.atRecurringTime = function() {
//    //Recurring times	W[bbb]/T[hh]:[mm]:[ss]
//    //Every day of the week  given by bbb at given time
//};
//
//Schedule.prototype.atRecurringRandomizedTime = function() {
//    //Recurring randomized times	W[bbb]/T[hh]:[mm]:[ss]A[hh]:[mm]:[ss]
//    //Every weekday given by bbb at given left side time, randomized by right side time. Right side time has to be smaller than 12 hours
//};

Schedule.prototype.withName = function(name) {
    // The 1.0 API only accepts up to 32 characters for the name
    var nameCharMax = 32;

    utils.combine(this, {"name": utils.getStringValue(name, nameCharMax)});
    return this;
};

Schedule.prototype.withDescription = function(description) {
    // The 1.0 API only accepts up to 64 characters for the description
    utils.combine(this, {"description": utils.getStringValue(description, 64)});
    return this;
};

Schedule.prototype.withCommand = function(command) {
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

Schedule.prototype.withEnabledState = function(enabled) {
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

//TODO this time is now performed in localtime inside the bridge as of 1.1
/**
 * Obtains the time as a string in UTC format that can be used to trigger a scheduled event.
 * @param time The time value as a String that can be parsed by Date.parse or a number as the milli seconds since 1970
 * or a Date object.
 * @return {String} representing the Date/Time that the Hue can interpret.
 * @private
 */
function _getTime(time) {
    var result = {},
        type = typeof(time),
        timeValue = null;

    if (type === 'string') {
        timeValue = Date.parse(time);
    } else if (type === 'number') {
        timeValue = time;
    } else if (type === 'object') {
        if (time instanceof Date) {
            timeValue = time;
        }
    }

    if (timeValue !== null && !isNaN(timeValue)) {
        timeValue = new Date(timeValue).toJSON();//TODO verify this is in local time...
    } else {
        throw new errors.ApiError("Invalid time value, '" + time + "'");
    }

    result.localtime = timeValue.substring(0, timeValue.lastIndexOf("."));
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