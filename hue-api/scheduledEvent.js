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

            if (arg.time) {
                schedule.at(arg.time);
            }

            if (arg.command) {
                schedule.withCommand(arg.command);
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

Schedule.prototype.withName = function(name) {
    // The 1.0 API only accepts up to 32 characters for the name
    var nameCharMax = 32;

    utils.combine(this, {"name": _getStringValue(name, nameCharMax)});
    return this;
};

Schedule.prototype.withDescription = function(description) {
    // The 1.0 API only accepts up to 64 characters for the description
    utils.combine(this, {"description": _getStringValue(description, 64)});
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

function _getStringValue(value, maxLength) {
    var result = value || "";

    if (maxLength && result.length > maxLength) {
        result = result.substr(0, maxLength);
    }
    return result;
}

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
//    console.log(time);

    if (timeValue !== null && !isNaN(timeValue)) {
        timeValue = new Date(timeValue).toJSON();
    } else {
        throw new errors.ApiError("Invalid time value, '" + time + "'");
    }

    result.time = timeValue.substring(0, timeValue.lastIndexOf("."));
//    console.log(JSON.stringify(result));
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