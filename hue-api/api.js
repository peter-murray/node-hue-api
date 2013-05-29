"use strict";

var util = require("util"),
    httpPromise = require("./httpUtilsPromise"),
    apiPaths = require("./apiPaths"),
//    scheduledEvent = require("./scheduledEvent"),
    errors = require("./errors"),
    Q = require("q"),
    parseUri = require("parseUri"),
//    md5 = require("MD5"),
    exports = module.exports = {};

//    ALL_LIGHTS_NAME = "All Lights";

////////////////////////////////////////////////////////////////////////////////////////////////
// PUBLIC API
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new Hue API that points at a particular bridge.
 * @param host The hostname or IP Address for the Bridge.
 * @param username The username to use for accessing the bridge API.
 * @constructor
 */
function HueApi(host, username) {
    this.host = host;
    this.username = username;
}
exports.HueApi = HueApi;

/**
 * Will locate the Philips Hue Devices on the network. Depending upon the speed and size of the network the timeout
 * may need to be adjusted to locate the Hue Bridge.
 * @param timeout The maximum time to wait for Hue Devices to be located. If not specified will use the default of 5
 * seconds.
 * @return A promise that will resolve the Hue Bridges as an Array of "host" and "port" objects.
 */
exports.locateBridges = function (timeout) {
    var search = require("./search.js");
    return search.locateBridges(timeout).then(_identifyBridges);
};

///**
// * Allows a new user/device to be registered with the Philips Hue Bridge.
// * @param host The hostname or IP Address of the Hue Bridge.
// * @param username The username to register.
// * @param description The description for the user/device that is being registered. This is a human readable
// * description of the user/device. If one is not provided then a default will be set.
// * @return {*}
// */
//exports.registerUser = function (host, username, description) {
//    var user = {
//        "username"  : md5(username),
//        "devicetype": description || "Node API"
//    };
//
//    function extractUsername(user) {
//        return user[0].success.username;
//    }
//
//    return httpPromise.httpPost(host, apiPaths.api(), user)
//        .then(extractUsername);
//};

///**
// * Attempts to connect with a Philips Hue Bridge.
// * @return Will return an Object with details of the Hue Bridge if successful.
// */
//HueApi.prototype.connect = function () {
//    return _connect(this.host, this.username);
//};

/**
 * Loads the description for the Philips Hue
 * @return A promise that will be provided with a description object.
 */
HueApi.prototype.description = function () {
    return _descriptionXml(this.host);
};

/**
// * Obtain a list of registered "users" or "devices" that can interact with the Philips Hue.
// * @return A promise that will provide the results of registered users.
// */
//HueApi.prototype.registeredUsers = function () {
//    var processUsers = function (result) {
//        var devices = [],
//            id,
//            device,
//            whitelist = result.config.whitelist;
//
//        if (whitelist) {
//            for (id in whitelist) {
//                if (whitelist.hasOwnProperty(id)) {
//                    device = result.config.whitelist[id];
//                    devices.push(
//                        {
//                            "name"    : device.name,
//                            "username": id,
//                            "created" : device["create date"],
//                            "accessed": device["last use date"]
//                        }
//                    );
//                }
//            }
//        }
//
//        return {"devices": devices};
//    };
//
//    return httpPromise.jsonGet(this.host, apiPaths.api(this.username))
//        .then(processUsers);
//};

///**
// * Registers a User with the Philips Hue Bridge.
// * @param username The username to register, which will be converted to a MD5 type name.
// * @param deviceType A description for the type of the user being registered.
// * @return {*} The promise that will register a user. A "done()" call must be performed to reveal any errors that are
// * generated during registration.
// */
//HueApi.prototype.registerUser = function (username, deviceType) {
//    //TODO this can be called outside of this class, as long as you can find/search for the Hue Bridge
//
//    //TODO make this properly cater for the link button not being pressed
//
//    var user = {
//        "username"  : md5(username),
//        "devicetype": deviceType || "Node API"
//    };
//
//    function extractUsername(user) {
//        return user[0].success.username;
//    }
//
//    this.registeredUsers().then(_checkUserNotAlreadyRegistered(user.username)).done();
//
//    return httpPromise.httpPost(this.host, apiPaths.api(), user)
//        .then(extractUsername);
//};

///**
// * Unregisters a user from the Philips Hue Bridge
// * @param username The username to unregister from the bridge.
// * @return {*} The response of the deletion activity
// */
//HueApi.prototype.unregisterUser = function (username) {
//    return httpPromise.httpDelete(this.host, apiPaths.deregister(username));
//};

///**
// * Obtains the details of the individual lights that are attached to the Philips Hue.
// * @return A promise that will be provided with the lights object
// */
//HueApi.prototype.lights = function () {
//    function buildResults(result) {
//        var lights = [],
//            id;
//
//        for (id in result) {
//            if (result.hasOwnProperty(id)) {
//                lights.push(
//                    {
//                        "id"  : id,
//                        "name": result[id].name
//                    }
//                );
//            }
//        }
//        return {"lights": lights};
//    }
//
//    return httpPromise.jsonGet(this.host, apiPaths.lights(this.username))
//        .then(buildResults);
//};

///**
// * Obtains the status of the specified light.
// * @param id The id of the light as an integer, this value will be parsed into an integer value so can be a {String} or
// * {Number} value.
// * @return {*} A promise that will show the result from the light id.
// */
//HueApi.prototype.lightStatus = function (id) {
//    if (!_isLightIdValid(id)) {
//        throw new errors.ApiError("The light id '" + id + "' is not valid for this Hue Bridge.");
//    }
//
//    return httpPromise.jsonGet(this.host, apiPaths.lights(this.username, id));
//};

///**
// * Obtains all the groups from the Hue Bridge
// * @return A promise that will return an array of objects {id, name} for the groups.
// */
//HueApi.prototype.groups = function () {
//    var parseResults = function (result) {
//        var groupArray = [];
//        // There is an implicit all lights group that is not returned in the results of the lookup, so explicitly add it
//        groupArray.push({"id": "0", "name": ALL_LIGHTS_NAME});
//
//        Object.keys(result).forEach(function (value) {
//            groupArray.push({
//                                "id"  : value,
//                                "name": result[value].name
//                            });
//        });
//        return groupArray;
//    };
//
//    return httpPromise.jsonGet(this.host, apiPaths.groups(this.username, null))
//        .then(parseResults);
//};

///**
// * Obtains the details for a specified group
// * @param id {Integer} or {String} which is the id of the group to get the details for.
// * @return {*} A promise which will return an object containing {id: "", name: "", lights: [], lastAction: {}}.
// */
//HueApi.prototype.getGroup = function (id) {
//    var parseResults = function (group) {
//        var result = {
//            "id"        : String(id),
//            "name"      : id === 0 ? ALL_LIGHTS_NAME : group.name,
//            "lights"    : group.lights,
//            "lastAction": group.action
//        };
//        //TODO Api has a placeholder for scenes which are currently not used.
//        return result;
//    };
//
//    return httpPromise.jsonGet(this.host, apiPaths.groups(this.username, id))
//        .then(parseResults);
//};

///**
// * Updates a light group to the specified name and lights ids. The name and light ids can be specified independently or
// * together when calling this function.
// * @param groupId The id of the group to update the name and/or light ids associated with it.
// * @param name {String} The name of the group
// * @param lightIds {Array} An array of light ids to be assigned to the group. If any of the ids are not present in the
// * bridge the creation will fail with an error being produced.
// * @return {*} A promise with a result of <true> if the update was successful, otherwise an error will be thrown.
// */
//HueApi.prototype.updateGroup = function (groupId, name, lightIds) {
//    if (!groupId || !_isGroupIdValid(groupId)) {
//        throw new errors.ApiError("Group Id '" + groupId + "' is not valid for the bridge");
//    }
//
//    var parseResults = function (result) {
//            if (!_wasSuccessful(result)) {
//                throw new errors.ApiError(_parseErrors(result).join(", "));
//            }
//            return true;
//        },
//        values = {},
//        parameters = [].slice.call(arguments, 1);
//
//    if (parameters.length === 0) {
//        throw new errors.ApiError("A name or lightId array must be specified");
//    } else if (parameters.length === 1) {
//        if (Array.isArray(parameters[0])) {
//            values.lights = _createStringValueArray(parameters[0]);
//        } else {
//            values.name = parameters[0];
//        }
//    } else {
//        values.name = parameters[0];
//        values.lights = _createStringValueArray(parameters[1]);
//    }
//
//    return httpPromise.httpPut(this.host,
//                               apiPaths.groups(this.username, groupId),
//                               values)
//        .then(parseResults);
//};

///**
// * Creates a new light Group
// * @param name The name of the group that we are creating, limited to 16 characters.
// * @param lightIds {Array} of ids for the lights to be included in the group.
// * @return {*} A promise that will return the id of the group that was created in a JSON object {id: xx}.
// */
//HueApi.prototype.createGroup = function (name, lightIds) {
//    // In version 1.0 of the Phillips Hue API this is not officially supported and has been reverse engineered from
//    // tinkering with the api end points...
//
//    var values = {
//            "name"  : name, // TODO the name appears to be limited to 16 characters
//            "lights": _createStringValueArray(lightIds)
//        },
//        parseResults;
//
//    parseResults = function (result) {
//        var idString;
//
//        if (!_wasSuccessful(result)) {
//            throw new errors.ApiError(_parseErrors(result).join(", "));
//        }
//
//        idString = result[0].success.id;
//        idString = idString.substr(idString.lastIndexOf("/") + 1);
//        return {"id": idString};
//    };
//
//    return httpPromise.httpPost(this.host,
//                                apiPaths.groups(this.username, null),
//                                values)
//        .then(parseResults);
//};

///**
// * Deletes a group with the specified id.
// * @param id The id of the group to delete.
// * @return {*} A promise that will return <true> if the deletion was successful.
// */
//HueApi.prototype.deleteGroup = function (id) {
//    // Protect the default implicit all lights group from being deleted (not sure if this is even possible, but do not want to risk it)
//    if (id === 0) {
//        throw new errors.ApiError("Cannot delete the 'All Lights' default group");
//    }
//
//    var parseResults = function (result) {
//        if (!_wasSuccessful(result)) {
//            throw new errors.ApiError(_parseErrors(result).join(", "));
//        }
//        return true;
//    };
//
//    return httpPromise.httpDelete(this.host, apiPaths.groups(this.username, id))
//        .then(parseResults);
//};

///**
// * Sets the light state to the provided values.
// * @param id The id of the light which is an integer or a value that can be parsed into an integer value.
// * @param stateValues {Object} containing the properties and values to set on the light
// * @param group An optional group Id to target when setting the light state on a group of lights
// * @return A promise that will set the specified state on the light.
// */
//HueApi.prototype.setLightState = function (id, stateValues, group) {
//    var parseResults,
//        promiseResult;
//
//    //check if group parameter is set, if not override with false.
//    if (!group) {
//        group = false;
//    }
//
//    //helper function to validate light id
//    if (!group && !_isLightIdValid(id)) {
//        throw new errors.ApiError("The light id '" + id + "' is not valid for this Hue Bridge.");
//    }
//
//    //helper function to validate group id - if group
//    if (group && !_isGroupIdValid(id)) {
//        throw new errors.ApiError("The group id '" + id + "' is not valid for this Hue Bridge.");
//    }
//
//    parseResults = function (result) {
//        //TODO the error handling is already taken care of I think...
//        if (!_wasSuccessful(result)) {
//            throw new errors.ApiError(_parseErrors(result).join(", "));
//        }
//        return true;
//    };
//
//    if (group) {
//        //send to group action path
//        promiseResult = httpPromise.httpPut(this.host,
//                                            apiPaths.groupsAction(this.username, id),
//                                            stateValues)
//            .then(parseResults);
//    } else {
//        //send single state path, no group
//        promiseResult = httpPromise.httpPut(this.host,
//                                            apiPaths.lightState(this.username, id),
//                                            stateValues)
//            .then(parseResults);
//    }
//    return promiseResult;
//};

///**
// * Gets the schedules
// * @return A promise that will return the schedules as an array of {id, name} objects.
// */
//HueApi.prototype.schedules = function () {
//    var parseResults = function (result) {
//        if (!_wasSuccessful(result)) {
//            throw new errors.ApiError(_parseErrors(result).join(", "));
//        }
//
//        var values = [];
//        Object.keys(result).forEach(function (value) {
//            values.push({
//                            "id"  : value,
//                            "name": result[value].name
//                        });
//        });
//
//        return values;
//    };
//
//    return httpPromise.jsonGet(this.host, apiPaths.schedules(this.username))
//        .then(parseResults);
//};

//HueApi.prototype.getSchedule = function (id) {
//    var parseResults = function (result) {
//        if (!_wasSuccessful(result)) {
//            throw new errors.ApiError(_parseErrors(result).join(", "));
//        }
//
//        // Add the id to the object we are returning
//        result.id = id;
//        return result;
//    };
//
//    if (!id) {
//        throw new errors.ApiError("An id for a schedule must be specified.");
//    }
//
//    return httpPromise.jsonGet(this.host, apiPaths.schedules(this.username, id))
//        .then(parseResults);
//};

///**
// * Creates a one time scheduled event.
// * @param schedule {ScheduledEvent}
// * @return A promise that will return the id value of the schedule that was created
// */
//HueApi.prototype.scheduleEvent = function (schedule) {
//    return _createSchedule(this, schedule);
//};
//
///**
// * Creates a one time scheduled event.
// * @param schedule {ScheduledEvent}
// * @return A promise that will return the id value of the schedule that was created
// */
//HueApi.prototype.createSchedule = function(schedule) {
//    return _createSchedule(this, schedule);
//};

///**
// * Updates an existing schedule event with the provided details.
// * @param schedule The object containing the details to update for the existing schedule event.
// */
//HueApi.prototype.updateSchedule = function(id, schedule) {
//    var values,
//        deferred,
//        promise,
//        parseResults = function(result) {
//            var returnValue = {};
//
//            if (!_wasSuccessful(result)) {
//                throw new errors.ApiError(_parseErrors(result).join(", "));
//            }
//
//            result.forEach(function(value) {
//                Object.keys(value.success).forEach(function(keyValue) {
//                    // The time values being returned do not appear to be correct from the Bridge, it is almost like
//                    // they are in a transition state when the function returns the value, as such time values are not
//                    // going to be returned from this function for now.
//                    //
//                    // Name and description values appear to be correctly represented in the results, but commands are
//                    // typically cut short to just "Updated" so to cater for this variability I am just going to return
//                    // true for each value that was modified, and leave it up to the user to request the value it was
//                    // set to by re-querying the schedule.
//                    //
//                    // I have to trust that the Hue Bridge API will have set the values correctly when it reports
//                    // success otherwise they have some serious issues...
//                    var data = keyValue.substr(keyValue.lastIndexOf("/") + 1, keyValue.length);
//                    returnValue[data] = true;
//                });
//            });
//            return returnValue;
//        };
//
//    if (!id) {
//        throw new errors.ApiError("A schedule id must be specified");
//    }
//
//    if (!schedule) {
//        throw new errors.ApiError("An object containing the values for the update to the schedule must be provided");
//    }
//
//    values = scheduledEvent.create(schedule);
//    // Check that there is something we are updating
//    if (!values.name && !values.description && !values.command && !values.time) {
//        deferred = Q.defer();
//        deferred.reject(new errors.ApiError("A valid property of 'name', 'description', 'time' or 'command' was not found for update."));
//        promise = deferred.promise;
//    } else {
//        promise = httpPromise.httpPut(this.host, apiPaths.schedules(this.username, id), values)
//            .then(parseResults);
//    }
//
//    return promise;
//};

/**
 * Sets a schedule for given light.
 *
 * This function is depricated as it is specific to only one use of schedules and contains almost no validation checking.
 * It has been replaced by {scheduleEvent()} function.
 *
 * @param id The id of the light which is an integer or a value that can be parsed into an integer value.
 * @param name A name for the schedule
 * @param when {Date} when the scheduled event should trigger
 * @param stateValues {Object} containing the properties and values to set on the light
 */
HueApi.prototype.setSchedule = function (id, name, when, stateValues) {
    console.log("This function 'setSchedule(id, name, when. stateValues)' is deprecated and will be removed in a future release. Use 'scheduleEvent()' or 'createSchedule()' instead.");

    var parseResults = function (result) {
            if (!_wasSuccessful(result)) {
                throw new errors.ApiError(_parseErrors(result).join(", "));
            }
            return true;
        },

        values = {
            "name"       : name,
            "time"       : when.toJSON().substring(0, 19),
            "description": " ",
            "command"    : {
                "method" : "PUT",
                "address": apiPaths.lightState(this.username, id),
                "body"   : stateValues
            }
        };

    return httpPromise.httpPost(this.host,
                                apiPaths.schedules(this.username),
                                values)
        .then(parseResults);
};

///**
// * Deletes a schedule by id
// * @param id of the schedule
// */
//HueApi.prototype.deleteSchedule = function (id) {
//    var parseResults = function (result) {
//        if (!_wasSuccessful(result)) {
//            throw new errors.ApiError(_parseErrors(result).join(", "));
//        }
//        return true;
//    };
//
//    if (!id) {
//        throw new errors.ApiError("A schedule id must be provided.");
//    }
//
//    return httpPromise.httpDelete(this.host,
//                                  apiPaths.schedules(this.username, id))
//        .then(parseResults);
//};

///**
// * Reads the bridge configuration
// * @return bridge configuration as json
// */
//HueApi.prototype.config = function () {
//    var parseResults = function (result) {
//        if (!_wasSuccessful(result)) {
//            throw new errors.ApiError(_parseErrors(result).join(", "));
//        }
//        return result;
//    };
//    return httpPromise.jsonGet(this.host, apiPaths.config(this.username))
//        .then(parseResults);
//};


////////////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
////////////////////////////////////////////////////////////////////////////////////////////////

//function _createSchedule(api, schedule) {
//    var values,
//        parseResult = function (result) {
//            if (!_wasSuccessful(result)) {
//                throw new errors.ApiError(_parseErrors(result).join(", "));
//            }
//            return {"id": result[0].success.id};
//        };
//
//    if (schedule.time && schedule.command) {
//        // time and the command a required parameters for this API call
//        values = scheduledEvent.create(schedule);
//    } else {
//        throw new errors.ApiError("The event object must have command and time values");
//    }
//
//    return httpPromise.httpPost(api.host, apiPaths.schedules(api.username), values)
//        .then(parseResult);
//}

/**
 * Obtains an object representation of the Description XML.
 * @param host The host to get the description XML from.
 * @return {*} The object representing some of the values in the description XML.
 * @private
 */
function _descriptionXml(host) {
    return httpPromise.httpGet(host, apiPaths.descriptionXml())
        .then(_parseDescription);
}

/**
 * Identifies the bridges based on the response from possible devices from SSDP search
 * @param possibleBridges The results from the search to be processed.
 * @return A promise that will process all the results and return only the valid Hue Bridges.
 * @private
 */
function _identifyBridges(possibleBridges) {
    function getHueBridgeHost(description) {
        function isHueBridge(description) {
            var name;

            if (description && description.model && description.model.name) {
                name = description.model.name;
                if (name.toLowerCase().indexOf("philips hue bridge") >= 0) {
                    return true;
                }
            }
            return false;
        }

        var uri;

        if (isHueBridge(description)) {
            uri = parseUri(description.url);
            return {
                "host": uri.host,
                "port": uri.port
            };
        }
        return null;
    }

    var lookups = [],
        path,
        uri;

    for (path in possibleBridges) {
        if (possibleBridges.hasOwnProperty(path)) {
            uri = parseUri(path);
            lookups.push(_descriptionXml(uri.host).then(getHueBridgeHost));
        }
    }
    return Q.all(lookups);
}

///**
// * Tries to connect to a Hue Bridge.
// * @param host The host name (or IP Address) of the bridge.
// * @param username The username to connect as.
// * @return {*} A Object with the name, version, macAddress, ipAddress and link button state for the bridge
// * @private
// */
//function _connect(host, username) {
////    console.log("IP Address: " + this.ipAddress);
////    console.log("Username: " + this.username);
//    var resultBuilder = function (result) {
//        return {
//            "name"      : result.config.name,
//            "version"   : result.config.swversion,
//            "linkButton": result.config.linkbutton,
//            "macAddress": result.config.mac,
//            "host"      : result.config.ipaddress
//        };
//    };
//
//    return httpPromise.jsonGet(host, apiPaths.api(username))
//        .then(resultBuilder);
//}

/**
 * Parses the XML Description and converts it into an Object.
 * @param xml The XML to parse and convert into an object
 * @return {Function|promise|promise|exports.promise}
 * @private
 */
function _parseDescription(xml) {
    var xml2js = require("xml2js"),
        parser = new xml2js.Parser(),
        deferred = Q.defer();

    parser.parseString(xml, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            var result = {
                "version"     : {
                    "major": data.root.specVersion[0].major[0],
                    "minor": data.root.specVersion[0].minor[0]
                },
                "url"         : data.root.URLBase[0],
                "name"        : data.root.device[0].friendlyName[0],
                "manufacturer": data.root.device[0].manufacturer[0],
                "model"       : {
                    "name"       : data.root.device[0].modelName[0],
                    "description": data.root.device[0].modelDescription[0],
                    "number"     : data.root.device[0].modelNumber[0],
                    "serial"     : data.root.device[0].serialNumber[0],
                    "udn"        : data.root.device[0].UDN[0]
                },
                //TODO this is not currently implemented in 1.0 version
                "service"     : {
                    "type"       : data.root.device[0].serviceList[0].service[0].serviceType[0],
                    "id"         : data.root.device[0].serviceList[0].service[0].serviceId[0],
                    "controlUrl" : data.root.device[0].serviceList[0].service[0].controlURL[0],
                    "eventSubUrl": data.root.device[0].serviceList[0].service[0].eventSubURL[0],
                    "scpdUrl"    : data.root.device[0].serviceList[0].service[0].SCPDURL[0]
                }
            };
            deferred.resolve(result);
        }
    });

    return deferred.promise;
}

function _wasSuccessful(result) {
    var success = true,
        idx,
        len;

    if (util.isArray(result)) {
        for (idx = 0, len = result.length; idx < len; idx++) {
            success = success && _wasSuccessful(result[idx]);
        }
    } else {
        success = result.success !== 'undefined';
    }
    return success;
}

//function _isLightIdValid(id) {
//    if (parseInt(id, 10) > 0) {
//        //TODO check that this is a valid light id for the system
//        return true;
//    } else {
////        throw new TypeError("The id for the light was not valid, '" + id + "'");
//        return false;
//    }
//}

//function _isGroupIdValid(id) {
//    if (parseInt(id, 10) > 0) {
//        //TODO: check group is valid
//        //Keep in mind, group 0 is always valid, stands for ALL lights known by hue bridge
//        return true;
//    } else {
//        return false;
//    }
//}

//function _parseErrors(result) {
//    var errors = [];
//
//    if (util.isArray(result)) {
//        Array.forEach(function (result) {
//            if (result.error) {
//                errors.push(result.error);
//            }
//        }, result);
//    } else {
//        if (result.error) {
//            errors.push(result.error);
//        } else {
//            //TODO
//            console.log("UNPARSED");
//            console.log(result);
//        }
//    }
//
//    //TODO actually find the error messages
//    return errors;
//}

function _checkUserNotAlreadyRegistered(user) {
    return function (devices) {
        var checkDevice = function (device) {
            if (device.username === user) {
                throw new errors.ApiError("The user is already registered: " + user);
            }
        };

        if (devices) {
            devices.devices.forEach(checkDevice);
        }
    };
}

//function _createStringValueArray(values) {
//    var result = [];
//
//    if (Array.isArray(values)) {
//        values.forEach(function (value) {
//            result.push(_asStringValue(value));
//        });
//    } else {
//        result.push(_asStringValue(values));
//    }
//
//    return result;
//}

//function _asStringValue(value) {
//    var result;
//
//    if (typeof(value) === 'string') {
//        result = value;
//    } else {
//        result = String(value);
//    }
//    return result;
//}
////////////////////////////////////////////////////////////////////////////////////////////////
