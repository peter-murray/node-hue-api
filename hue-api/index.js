"use strict";

var Q = require("q"),
    http = require("./httpPromise"),
    ApiError = require("./errors").ApiError,
    utils = require("./utils"),
    lightsApi = require("./commands/lights-api"),
    groupsApi = require("./commands/groups-api"),
    schedulesApi = require("./commands/schedules-api"),
    configurationApi = require("./commands/configuration-api"),
    scheduledEvent = require("./scheduledEvent"),
    bridgeDiscovery = require("./bridge-discovery");


function HueApi(host, username, timeout) {
    this.host = host;
    this.username = username;
    this.timeout = timeout || 10000;
}
module.exports = HueApi;

/**
 * Loads the description for the Philips Hue.
 *
 * @param cb An optional callback function if you don't want to be informed via a promise.
 * @return {Q.promise} A promise that will be provided with a description object, or {null} if a callback was provided.
 */
HueApi.prototype.description = function (cb) {
    var promise = bridgeDiscovery.description(this.host);
    return utils.promiseOrCallback(promise, cb);
};

/**
 * Reads the bridge configuration and returns it as a JSON object.
 *
 * @param cb An optional callback function to use if you do not want to use the promise for results.
 * @return {Q.promise} A promise with the result, or <null> if a callback function was provided.
 */
HueApi.prototype.config = function (cb) {
    var options = _defaultOptions(this),
        promise = http.invoke(configurationApi.getConfiguration, options);

    return utils.promiseOrCallback(promise, cb);
};

/**
 * Performs a connection check on the bridge. This is the same as running HueApi.config().
 * This method is kept only as a backwards compatibility feature with 0.1.x, but will be removed in a future release.
 *
 * Refer to HueApi.config() for details.
 */
HueApi.prototype.connect = HueApi.prototype.config;

/**
 * Obtains the complete state for the Bridge. This is considered to be a very expensive operation and should not be invoked
 * frequently. The results detail all config, users, groups, schedules and lights for the system.
 *
 * @param cb An optional callback function if you don't want to be informed via a promise.
 * @returns {Q.promise} A promise with the result, or {null} if a callback function was provided
 */
HueApi.prototype.getFullState = function(cb) {
    var options = _defaultOptions(this),
        promise = http.invoke(configurationApi.getFullState, options);

    return utils.promiseOrCallback(promise, cb);
};

/**
 * Allows a new user/device to be registered with the Philips Hue Bridge. This will return the name of the user that was
 * created by the function call.
 *
 * This function does not require the HueApi to have been initialized with a host or username. It does however require
 * the end user to have pressed the link button on the bridge, before invoking this function.
 *
 * @param host The hostname or IP Address of the Hue Bridge.
 * @param username The username to register.
 * @param deviceDescription The description for the user/device that is being registered. This is a human readable
 * description of the user/device. If one is not provided then a default will be set.
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return {Q.promise} A promise with the result, or <null> if a callback was provided.
 */
HueApi.prototype.registerUser = function (host, username, deviceDescription, cb) {
    var options = {
            "host": host
        },
        promise;

    promise = _setCreateUserOptions(options, username, deviceDescription);

    // Optional argument handling
    if (!cb) {
        // Check to see if we have a callback provided as another argument
        [].slice.call(arguments, 1).forEach(function (arg) {
            if (typeof arg === "function") {
                cb = arg;
            }
        });
    }

    if (!promise) {
        promise = http.invoke(configurationApi.createUser, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Creates a new User in the Phillips Hue Bridge.
 *
 * Refer to HueApi.registerUser() for more details.
 */
HueApi.prototype.createUser = HueApi.prototype.registerUser;


/**
 * Presses the Link Button on the Bridge (without the user actually having to do it). If successful then {true} will be
 * returned as the result.
 *
 * @param cb An optional callback function to use if you do not want to use the promise returned.
 * @return {Q.promise} A promise with the result, or <null> if a callback was provided.
 */
HueApi.prototype.pressLinkButton = function (cb) {
    var options = _defaultOptions(this),
        promise;

    promise = _setConfigurationOptions(options, {"linkbutton": true});
    if (!promise) {
        promise = http.invoke(configurationApi.modifyConfiguration, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Deletes an existing user from the Phillips Hue Bridge.
 *
 * @param username The username of the user to delete.
 * @param cb An optional callback function to use if you do not want to get the result via a promise chain.
 * @returns {Q.promise} A promise with the result of the deletion, or <null> if a callback was provided.
 */
HueApi.prototype.deleteUser = function (username, cb) {
    var options = _defaultOptions(this),
        promise;

    promise = _setDeleteUserOptions(options, username);
    if (!promise) {
        promise = http.invoke(configurationApi.deleteUser, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Unregisters an existing user from the Phillips Hue Bridge.
 *
 * Refer ro HueApi.deleteUser() for more details.
 */
HueApi.prototype.unregisterUser = HueApi.prototype.deleteUser;


/**
 * Obtain a list of registered "users" or "devices" that can interact with the Philips Hue.
 *
 * @param cb An optional callback function if you do not want to use the promise to obtain the results.
 * @return A promise that will provide the results of registered users, or <null> if a callback was provided.
 */
HueApi.prototype.registeredUsers = function (cb) {
    function processUsers(result) {
        var list = result.whitelist,
            devices = [];

        if (list) {
            Object.keys(list).forEach(function (key) {
                var device;
                if (list.hasOwnProperty(key)) {
                    device = list[key];
                    devices.push(
                        {
                            "name"    : device.name,
                            "username": key,
                            "created" : device["create date"],
                            "accessed": device["last use date"]
                        }
                    );
                }
            });
        }
        return {"devices": devices};
    }

    var promise = this.config().then(processUsers);
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Obtains the details of the individual lights that are attached to the Philips Hue.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the lights object, or {null} if a callback function was provided.
 */
HueApi.prototype.lights = function (cb) {
    var options = _defaultOptions(this),
        promise;

    promise = http.invoke(lightsApi.getAllLights, options);

    return utils.promiseOrCallback(promise, cb);
};


/**
 * Obtains the status of the specified light.
 *
 * @param id The id of the light as an integer, this value will be parsed into an integer value so can be a {String} or
 * {Number} value.
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the light status, or {null} if a callback function was provided.
 */
HueApi.prototype.lightStatus = function (id, cb) {
    var options = _defaultOptions(this),
        promise;

    promise = _setLightIdOption(options, id);

    if (!promise) {
        promise = http.invoke(lightsApi.getLightAttributesAndState, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Obtains the new lights found by the bridge, dependant upon the last search.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the new lights search result, or {null} if a callback function was provided.
 */
HueApi.prototype.newLights = function (cb) {
    var options = _defaultOptions(this),
        promise = http.invoke(lightsApi.getNewLights, options);

    return utils.promiseOrCallback(promise, cb);
};


/**
 * Starts a search for new lights.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the new lights, or {null} if a callback function was provided.
 */
HueApi.prototype.searchForNewLights = function (cb) {
    var options = _defaultOptions(this),
        promise = http.invoke(lightsApi.searchForNewLights, options);

    return utils.promiseOrCallback(promise, cb);
};


/**
 * Sets the name of a light on the Bridge.
 *
 * @param id The ID of the light to set the name for.
 * @param name The name to apply to the light.
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the results of setting the name, or {null} if a callback function was provided.
 */
HueApi.prototype.setLightName = function (id, name, cb) {
    var options = _defaultOptions(this),
        promise;

    promise = _setLightIdOption(options, id);

    options.values = {
        "name": name
    };

    if (!promise) {
        promise = http.invoke(lightsApi.renameLight, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Sets the light state to the provided values.
 *
 * @param id The id of the light which is an integer or a value that can be parsed into an integer value.
 * @param stateValues {Object} containing the properties and values to set on the light.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will set the specified state on the light, or {null} if a callback was provided.
 */
HueApi.prototype.setLightState = function (id, stateValues, cb) {
    var options = _defaultOptions(this),
        promise;

    promise = _setLightIdOption(options, id);

    //TODO stateValues need to be injected properly so that they can be checked and validated
    options.values = stateValues;

    if (!promise) {
        promise = http.invoke(lightsApi.setLightState, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Sets the light state to the provided values for an entire group.
 *
 * @param id The id of the group which is an integer or a value that can be parsed into an integer value.
 * @param stateValues {Object} containing the properties and values to set on the light.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {Q.promise} A promise that will set the specified state on the group, or {null} if a callback was provided.
 */
HueApi.prototype.setGroupLightState = function (id, stateValues, cb) {
    var options = _defaultOptions(this),
        promise;

    promise = _setGroupIdOption(options, id);

    //TODO stateValues need to be injected properly so that they can be checked and validated
    options.values = stateValues;

    if (!promise) {
        promise = http.invoke(groupsApi.setGroupState, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Obtains all the groups from the Hue Bridge as an Array of {id: {*}, name: {*}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will set the specified state on the light, or {null} if a callback was provided.
 */
HueApi.prototype.groups = function (cb) {
    var options = _defaultOptions(this),
        promise = http.invoke(groupsApi.getAllGroups, options);

    return utils.promiseOrCallback(promise, cb);
};


/**
 * Obtains the details for a specified group in a format of {id: {*}, name: {*}, lights: [], lastAction: {*}}.
 *
 * @param id {Number} or {String} which is the id of the group to get the details for.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will set the specified state on the light, or {null} if a callback was provided.
 */
HueApi.prototype.getGroup = function (id, cb) {
    var options = _defaultOptions(this),
        promise;

    //TODO find a way to make this a normal post processing action in the groups-api, the id from the call needs to be injected...
    function processGroupResult(group) {
        return {
            "id"  : String(id),

            // Inject our "known name" for the all lights group if necessary
            "name": id === 0 ? groupsApi.NAME_ALL_LIGHTS : group.name,

            "lights"    : group.lights,
            "lastAction": group.action

            // Hue Api has a placeholder for scenes which are currently not used.
        };
    }

    promise = _setGroupIdOption(options, id);
    if (!promise) {
        promise = http.invoke(groupsApi.getGroupAttributes, options).then(processGroupResult);
    }

    return utils.promiseOrCallback(promise, cb);
};


/**
 * Updates a light group to the specified name and/or lights ids. The name and light ids can be specified independently or
 * together when calling this function.
 *
 * @param id The id of the group to update the name and/or light ids associated with it.
 * @param name {String} The name of the group
 * @param lightIds {Array} An array of light ids to be assigned to the group. If any of the ids are not present in the
 * bridge the creation will fail with an error being produced.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise with a result of <true> if the update was successful, or null if a callback was provided.
 */
HueApi.prototype.updateGroup = function (id, name, lightIds, cb) {
    var options = _defaultOptions(this),
        parameters = [].slice.call(arguments, 1),
        promise;

    options.values = {};
    promise = _setGroupIdOptionForModification(options, id);

    // Due to name and lightIds being "optional" we have to re-parse the arguments to get the right ones
    parameters.forEach(function (param) {
        if (param instanceof Function) {
            cb = param;
        } else if (Array.isArray(param)) {
            options.values.lights = utils.createStringValueArray(param);
        } else {
            options.values.name = param;
        }
    });

    if (!promise && !options.values.lights && !options.values.name) {
        promise = _errorPromise("A name or array of lightIds must be provided");
    }

    if (!promise) {
        promise = http.invoke(groupsApi.setGroupAttributes, options);
    }

    return utils.promiseOrCallback(promise, cb);
};


/**
 * Creates a new light Group. This API is not officially supported in version 1.0 of the API from Phillips. Invoking
 * this function successfully will result in a new group being created and a result of {id: {Number}} being returned.
 *
 * @param name The name of the group that we are creating, limited to 16 characters.
 * @param lightIds {Array} of ids for the lights to be included in the group.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return the id of the group that was created, or null if a callback was provided.
 */
HueApi.prototype.createGroup = function (name, lightIds, cb) {
    // In version 1.0 of the Phillips Hue API this is not officially supported and has been reverse engineered from
    // tinkering with the api end points...

    var options = _defaultOptions(this),
        promise;

    options.values = {
        name  : name,
        lights: utils.createStringValueArray(lightIds)
    };

    promise = http.invoke(groupsApi.createGroup, options);
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Deletes a group with the specified id, returning <true> if the action was successful.
 *
 * @param id The id of the group to delete.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return <true> if the deletion was successful, or null if a callback was provided.
 */
HueApi.prototype.deleteGroup = function (id, cb) {
    // In version 1.0 of the Phillips Hue API this is not officially supported and has been reverse engineered from
    // tinkering with the api end points...

    var options = _defaultOptions(this),
        promise = _setGroupIdOptionForModification(options, id);

    if (!promise) {
        promise = http.invoke(groupsApi.deleteGroup, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


//TODO setGroupState() - i.e. turn on lights etc...


/**
 * Gets the schedules on the Bridge, as an array of {"id": {String}, "name": {String}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will return the results or <null> if a callback was provided.
 */
HueApi.prototype.schedules = function (cb) {
    var options = _defaultOptions(this),
        promise = http.invoke(schedulesApi.getAllSchedules, options);

    return utils.promiseOrCallback(promise, cb);
};

/**
 * Gets the specified schedule by id, which is in an identical format the the Hue API documentation, with the addition
 * of an "id" value for the schedule.
 *
 * @param id The id of the schedule to retrieve.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @returns A promise that will return the results or <null> if a callback was provided.
 */
HueApi.prototype.getSchedule = function (id, cb) {
    var options = _defaultOptions(this),
        promise = _setScheduleIdOption(options, id);

    function parseResults(result) {
        result.id = id;
        return result;
    }

    if (!promise) {
        promise = http.invoke(schedulesApi.getSchedule, options).then(parseResults);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Creates a one time scheduled event. The results from this function is the id of the created schedule. The bridge only
 * supports 100 schedules, so once they are triggered, they are removed from the bridge.
 *
 * @param schedule {ScheduledEvent}
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will return the id value of the schedule that was created, or <null> if a callback was provided.
 */
HueApi.prototype.scheduleEvent = function (schedule, cb) {
    return _createSchedule(this, schedule, cb);
};


/**
 * Creates a one time scheduled event.
 * @param schedule {ScheduledEvent}
 * @return A promise that will return the id value of the schedule that was created
 */
HueApi.prototype.createSchedule = function (schedule, cb) {
    return _createSchedule(this, schedule, cb);
};


/**
 * Deletes a schedule by id, returning {true} if the deletion was successful.
 *
 * @param id of the schedule
 * @param cb An option callback function to use if you do not want to use a promise for the results.
 * @return {Q.promise} A promise that will return the result of the deletion, or <null> if a callback was provided.
 */
HueApi.prototype.deleteSchedule = function (id, cb) {
    var options = _defaultOptions(this),
        promise;

    promise = _setScheduleIdOption(options, id);

    if (!promise) {
        promise = http.invoke(schedulesApi.deleteSchedule, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Updates an existing schedule event with the provided details.
 *
 * @param id The id of the schedule being updated.
 * @param schedule The object containing the details to update for the existing schedule event.
 * @param cb An optional callback function to use if you do not want to deal with a promise for the results.
 * @return {Q.promise} A promise that will return the result, or <null> if a callback was provided.
 */
HueApi.prototype.updateSchedule = function (id, schedule, cb) {
    var options = _defaultOptions(this),
        promise;

    promise = _setScheduleIdOption(options, id);
    if (!promise) {
        promise = _setScheduleOptionsForUpdate(options, schedule);
    }

    if (!promise) {
        promise = http.invoke(schedulesApi.setScheduleAttributes, options);
    }

    return utils.promiseOrCallback(promise, cb);
};


////////////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new schedule in the Hue Bridge.
 *
 * @param api The HueApi that we are being invoked on.
 * @param schedule The schedule object to create.
 * @param cb An optional callback if you do not want to use the promise for results.
 * @returns {Q.promise} A promise with the creation results, or <null> if a callback was provided.
 * @private
 */
function _createSchedule(api, schedule, cb) {
    var options = _defaultOptions(api),
        promise = _setScheduleOptionsForCreation(options, schedule);

    if (!promise) {
        promise = http.invoke(schedulesApi.createSchedule, options);
    }
    return utils.promiseOrCallback(promise, cb);
}

/**
 * Validates and then injects the username and deviceType details into the options.
 *
 * @param options The options to inject the values into.
 * @param username The username to create.
 * @param deviceType The device description for the username that is being created.
 * @returns {Q.promise} A promise that contains the error if there is one generated from the injection of values.
 * @private
 */
function _setCreateUserOptions(options, username, deviceType) {
    var errorPromise = null,
        validatedUsername = username || "",
        usernameOption = configurationApi.createUser.bodyArguments.username;

    //TODO perform validation as per API definition
    if (validatedUsername.length < usernameOption.minLength) {
        validatedUsername = undefined;
    } else if (validatedUsername.length > usernameOption.maxLength) {
        validatedUsername = undefined;
    }

    options.values = {
        "username"  : validatedUsername,
        "devicetype": deviceType || "Node.js API"
    };

    return errorPromise;
}

/**
 * Validates and then injects the username to be deleted into the options.
 *
 * @param options The options to inject the value into.
 * @param username The username to delete.
 * @returns {Q.promise} A promise containing the error(s) if there were any, otherwise <null>.
 * @private
 */
function _setDeleteUserOptions(options, username) {
    var errorPromise = null;

    //TODO perform a lookup for the user before we attempt to delete it??
    if (!username) {
        errorPromise = _errorPromise("A username to delete must be specified.");
    }
    options.username2 = username;

    return errorPromise;
}

/**
 * Validates and injects the configuration options to set for the Hue Bridge into the provided options.
 *
 * @param options The options to inject into.
 * @param values The values that we wish to modify on the bridge.
 * @private
 */
function _setConfigurationOptions(options, values) {
    var errorPromise = null,
        validOptionFound = false;

    // Use the API specification to check all required values have been provided.
    Object.keys(configurationApi.modifyConfiguration.bodyArguments).forEach(function (value) {
        var option = configurationApi.modifyConfiguration.bodyArguments[value];

        // Check to see if we have at least one option being set
        if (!validOptionFound && values[value]) {
            validOptionFound = true;
        }

        // Check that we have all the required options being provided
        if (!option.optional) {
            // Check that the value has been provided
            if (!errorPromise && !values[value]) {
                errorPromise = _errorPromise("A required configuration option '" + value + "' was not provided.");
            }
        }
    });

    if (!errorPromise) {
        if (!validOptionFound) {
            errorPromise = _errorPromise("No valid options for the bridge configuration were specified.");
        } else {
            options.values = values;
        }
    }

    return errorPromise;
}

/**
 * Validates and then injects the 'id' into the options for a light in the bridge.
 *
 * @param options The options to add the 'id' to.
 * @param id The id of the light
 * @return {Q.promise} A promise that will throw the error if there was one, otherwise <null>.
 * @private
 */
function _setLightIdOption(options, id) {
    var errorPromise = null;

    if (!_isLightIdValid(id)) {
        errorPromise = _errorPromise("The light id '" + id + "' is not valid for this Hue Bridge.");
    } else {
        options.id = id;
    }

    return errorPromise;
}

/**
 * Validates and then injects the 'id' into the options for a group in the bridge.
 *
 * @param options The options to add the 'id' to.
 * @param id The id of the group
 * @return {Q.promise} A promise that will throw an error or null if the group id was valid.
 * @private
 */
function _setGroupIdOption(options, id) {
    var errorPromise = null;

    if (!_isGroupIdValid(id)) {
        errorPromise = _errorPromise("The group id '" + id + "' is not valid for this Hue Bridge.");
    } else {
        options.id = id;
    }

    return errorPromise;
}

/**
 * Validates and then injects the 'id' into the options for a group in the bridge.
 *
 * @param options The options to add the 'id' to.
 * @param id The id of the group
 * @return {Q.promise} A promise that will throw an error or null if the group id was valid.
 * @private
 */
function _setGroupIdOptionForModification(options, id) {
    var errorPromise = null;

    if (!_isGroupIdValidForModification(id)) {
        errorPromise = _errorPromise("The group id '" + id + "' cannot be modified on this Hue Bridge.");
    } else {
        options.id = id;
    }

    return errorPromise;
}

/**
 * Validates and then injects the 'id' into the options for a group in the bridge.
 *
 * @param options The options to add the 'id' to.
 * @param id The id of the schedule
 * @return {Q.promise} A promise that will throw an error or null if the schedule id was valid.
 * @private
 */
function _setScheduleIdOption(options, id) {
    var errorPromise = null;

    if (!_isScheduleIdValid(id)) {
        errorPromise = _errorPromise("The schedule id '" + id + "' is not valid for this Hue Bridge.");
    } else {
        options.id = id;
    }

    return errorPromise;
}

/**
 * Validates and then injects the schedule into the 'values' of the options.
 *
 * @param options The options to inject into.
 * @param schedule The schedule object containing the details for the schedule to create.
 * @returns {Q.promise} A promise containing any errors that might have occured, or <null> if there were none.
 * @private
 */
function _setScheduleOptionsForCreation(options, schedule) {
    var errorPromise = null;

    // Use the API specification to check all required values have been provided.
    Object.keys(schedulesApi.createSchedule.bodyArguments).forEach(function (value) {
        var option = schedulesApi.createSchedule.bodyArguments[value];
        if (!option.optional) {
            // Check that the value has been provided
            if (!errorPromise && !schedule[value]) {
                errorPromise = _errorPromise("A required schedule option '" + value + "' was not provided.");
            }
        }
    });

    if (!errorPromise) {
        options.values = scheduledEvent.create(schedule);
    }

    return errorPromise;
}

/**
 * Validates and then injects the schedule into the 'values' of the options.
 *
 * @param options The options to inject into.
 * @param schedule The schedule object with the details of the updates to make.
 * @returns {Q.promise} A promise with any errors, if there were any, otherwise <null>.
 * @private
 */
function _setScheduleOptionsForUpdate(options, schedule) {
    var errorPromise = null,
        validOptionFound = false;

    // Use the API specification to check all the required values have been provided, or we have at least one value
    Object.keys(schedulesApi.setScheduleAttributes.bodyArguments).forEach(function (value) {
        if (schedule[value]) {
            validOptionFound = true;
        }
    });

    if (!validOptionFound) {
        errorPromise = _errorPromise("No valid values for updating the schedule were found in the schedule details provided.");
    } else {
        options.values = scheduledEvent.create(schedule);
    }

    return errorPromise;
}

/**
 * Creates a promise that will generate an ApiError with the provided message.
 *
 * @param message The error message
 * @returns {Q.promise}
 * @private
 */
function _errorPromise(message) {
    var deferred = Q.defer();
    deferred.reject(new ApiError(message));
    return deferred.promise;
}

/**
 * Creates a default options object for connecting with a Hue Bridge.
 *
 * @param api The api that contains the username and host for the bridge.
 * @returns {{host: *, username: *, timeout: *}}
 * @private
 */
function _defaultOptions(api) {
    return {
        "host"    : api.host,
        "username": api.username,
        "timeout": api.timeout
    };
}

/**
 * Validates that the light id is valid for this Hue Bridge.
 *
 * @param id The id of the light in the Hue Bridge.
 * @returns {boolean} true if the id is valid for this bridge.
 * @private
 */
function _isLightIdValid(id) {
    if (parseInt(id, 10) > 0) {
        //TODO check that this is a valid light id for the system
        return true;
    } else {
        return false;
    }
}

/**
 * Validates that the group id is valid for this Hue Bridge.
 *
 * @param id The id of the group in the Hue Bridge.
 * @returns {boolean} true if the id is valid for this bridge.
 * @private
 */
function _isGroupIdValid(id) {
    if (parseInt(id, 10) >= 0) {
        //TODO check that this is a valid group id for the system
        return id <= 16;
    } else {
        return false;
    }
}

/**
 * Validates that the group id is valid for modification on this Hue Bridge.
 *
 * @param id The id of the group in the Hue Bridge.
 * @returns {boolean} true if the id is valid for this bridge.
 * @private
 */
function _isGroupIdValidForModification(id) {
    if (_isGroupIdValid(id)) {
        return parseInt(id, 10) > 0;
    }
    return false;
}

/**
 * Validates that the schedule id is valid for this Hue Bridge.
 *
 * @param id The id of the group in the Hue Bridge.
 * @returns {boolean} true if the id is valid for this bridge.
 * @private
 */
function _isScheduleIdValid(id) {
    if (parseInt(id, 10) >= 0) {
        //TODO check that this is a valid schedule id for the system
        return id <= 100;
    } else {
        return false;
    }
}
