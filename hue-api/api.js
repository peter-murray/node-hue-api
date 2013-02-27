"use strict";

var util = require("util"),
    httpPromise = require("./httpUtilsPromise"),
    apiPaths = require("./apiPaths"),
    Q = require("q"),
    parseUri = require("parseUri"),
    md5 = require("MD5"),
    exports = module.exports = {};

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

/**
 * Allows a new user/device to be registered with the Philips Hue Bridge.
 * @param host The hostname or IP Address of the Hue Bridge.
 * @param username The username to register.
 * @param description The description for the user/device that is being registered. This is a human readable
 * description of the user/device. If one is not provided then a default will be set.
 * @return {*}
 */
exports.registerUser = function (host, username, description) {
    var user = {
        "username": md5(username),
        "devicetype": description || "Node API"
    };

    function extractUsername(user) {
        return user[0].success.username;
    }

    return httpPromise.httpPost(host, apiPaths.api(), user)
        .then(extractUsername);
};

/**
 * Attempts to connect with a Philips Hue Bridge.
 * @return Will return an Object with details of the Hue Bridge if successful.
 */
HueApi.prototype.connect = function () {
    return _connect(this.host, this.username);
};

/**
 * Loads the description for the Philips Hue
 * @return A promise that will be provided with a description object.
 */
HueApi.prototype.description = function () {
    return _descriptionXml(this.host);
};

/**
 * Obtain a list of registered "users" or "devices" that can interact with the Philips Hue.
 * @return A promise that will provide the results of registered users.
 */
HueApi.prototype.registeredUsers = function () {
    var processUsers = function (result) {
        var devices = [],
            id,
            device,
            whitelist = result.config.whitelist;

        if (whitelist) {
            for (id in whitelist) {
                if (whitelist.hasOwnProperty(id)) {
                    device = result.config.whitelist[id];
                    devices.push(
                        {
                            "name"    : device.name,
                            "username": id,
                            "created" : device["create date"],
                            "accessed": device["last use date"]
                        }
                    );
                }
            }
        }

        return {"devices": devices};
    };

    return httpPromise.jsonGet(this.host, apiPaths.api(this.username))
        .then(processUsers);
};

/**
 * Registers a User with the Philips Hue Bridge.
 * @param username The username to register, which will be converted to a MD5 type name.
 * @param deviceType A description for the type of the user being registered.
 * @return {*} The promise that will register a user. A "done()" call must be performed to reveal any errors that are
 * generated during registration.
 */
HueApi.prototype.registerUser = function (username, deviceType) {
    //TODO this can be called outside of this class, as long as you can find/search for the Hue Bridge

    //TODO make this properly cater for the link button not being pressed

    var user = {
        "username": md5(username),
        "devicetype": deviceType || "Node API"
    };

    function extractUsername(user) {
        return user[0].success.username;
    }

    this.registeredUsers().then(_checkUserNotAlreadyRegistered(user.username)).done();

    return httpPromise.httpPost(this.host, apiPaths.api(), user)
        .then(extractUsername);
};

/**
 * Unregisters a user from the Philips Hue Bridge
 * @param username The username to unregister from the bridge.
 * @return {*} The response of the deletion activity
 */
HueApi.prototype.unregisterUser = function (username) {
    return httpPromise.httpDelete(this.host, apiPaths.deregister(username));
};

/**
 * Obtains the details of the individual lights that are attached to the Philips Hue.
 * @return A promise that will be provided with the lights object
 */
HueApi.prototype.lights = function () {
    function buildResults(result) {
        var lights = [],
            id;

        for (id in result) {
            if (result.hasOwnProperty(id)) {
                lights.push(
                    {
                        "id"  : id,
                        "name": result[id].name
                    }
                );
            }
        }
        return {"lights": lights};
    }

    return httpPromise.jsonGet(this.host, apiPaths.lights(this.username))
        .then(buildResults);
};

/**
 * Obtains the status of the specified light.
 * @param id The id of the light as an integer, this value will be parsed into an integer value so can be a {String} or
 * {Number} value.
 * @return {*} A promise that will show the result from the light id.
 */
HueApi.prototype.lightStatus = function (id) {
    if (! _isLightIdValid(id)) {
        throw new Error("The light id '" + id + "' is not valid for this Hue Bridge.");
    }

    return httpPromise.jsonGet(this.host, apiPaths.lights(this.username, id));
};

/**
 * Sets the light state to the provided values.
 * @param id The id of the light which is an integer or a value that can be parsed into an integer value.
 * @param stateValues {Object} containing the properties and values to set on the light
 * @return A promise that will set the specified state on the light.
 */
HueApi.prototype.setLightState = function (id, stateValues) {
    if (! _isLightIdValid(id)) {
        throw new Error("The light id '" + id + "' is not valid for this Hue Bridge.");
    }

    var parseResults = function (result) {
        //TODO the error handling is already taken care of I think...
        if (! _wasSuccessful(result)) {
            throw new Error(_parseErrors(result).join(", "));
        }
        return true;
    };

    return httpPromise.httpPut(this.host,
                               apiPaths.lightState(this.username, id),
                               stateValues)
        .then(parseResults);
};

/**
 * Gets the schedules
 * @return A promise that will return the schedules as an object
 */
HueApi.prototype.schedules = function () {
    var parseResults = function (result) {
        if (!_wasSuccessful(result)) {
            throw new Error(_parseErrors(results).join(", "));
        }
        return JSON.parse(result);
    };
    return httpPromise.httpGet(this.host, apiPaths.schedules(this.username))
        .then(parseResults);
};

HueApi.prototype.getSchedule = function (id) {
    var parseResults = function (result) {
        if (!_wasSuccessful(result)) {
            throw new Error(_parseErrors(results).join(", "));
        }
        return JSON.parse(result);
    };
    
    return httpPromise.httpGet(this.host, apiPaths.schedules(this.username, id))
        .then(parseResults);
};

/**
 * Sets a schedule for given light
 * @param id The id of the light which is an integer or a value that can be parsed into an integer value.
 * @param name A name for the schedule
 * @param when {Date} when the scheduled event should trigger
 * @param stateValues {Object} containing the properties and values to set on the light
 */
HueApi.prototype.setSchedule = function(id, name, when, stateValues) {
    var parseResults = function (result) {
        if (!_wasSuccessful(result)) {
            throw new Error(_parseErrors(results).join(", "));
        }
        return true;
    };
    
    var values = {
        "name": name,
        "time": when.toJSON().substring(0, 19),
        "description": " ",
        "command": {
            "method": "PUT",
            "address": apiPaths.lightState(this.username, id),
            "body": stateValues
        }
    };
    console.log(values);
    return httpPromise.httpPost(this.host,
                                apiPaths.schedules(this.username),
                                values)
        .then(parseResults);
};

/**
 * Deletes a schedule by id
 * @param id of the schedule
 */
HueApi.prototype.deleteSchedule = function(id) {
    var parseResults = function (result) {
        if (! _wasSuccessful(result)) {
            throw new Error(_parseErrors(result).join(", "));
        }
        return true;
    };
    
    return httpPromise.httpDelete(this.host,
                                  apiPaths.schedules(this.username, id))
        .then(parseResults);
};

/**
 * Reads the bridge configuration
 * @return bridge configuration as json
 */
HueApi.prototype.config = function() {
    var parseResults = function (result) {
        if (!_wasSuccessful(result)) {
            throw new Error(_parseErrors(result).join(", "));
        }
        return JSON.parse(result);
    };
    return httpPromise.httpGet(this.host, apiPaths.config(this.username))
        .then(parseResults);
};

////////////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
////////////////////////////////////////////////////////////////////////////////////////////////

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

/**
 * Tries to connect to a Hue Bridge.
 * @param host The host name (or IP Address) of the bridge.
 * @param username The username to connect as.
 * @return {*} A Object with the name, version, macAddress, ipAddress and link button state for the bridge
 * @private
 */
function _connect(host, username) {
//    console.log("IP Address: " + this.ipAddress);
//    console.log("Username: " + this.username);
    var resultBuilder = function (result) {
        return {
            "name": result.config.name,
            "version": result.config.swversion,
            "linkButton": result.config.linkbutton,
            "macAddress": result.config.mac,
            "host": result.config.ipaddress
        };
    };

    return httpPromise.jsonGet(host, apiPaths.api(username))
        .then(resultBuilder);
}

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

function _isLightIdValid(id) {
    if (parseInt(id, 10) > 0) {
        //TODO check that this is a valid light id for the system
        return true;
    } else {
//        throw new TypeError("The id for the light was not valid, '" + id + "'");
        return false;
    }
}

function _parseErrors(result) {
    var errors = [];

    if (util.isArray(result)) {
        Array.forEach(function (result) {
            if (result.error) {
                errors.push(result.error);
            }
        }, result);
    } else {
        if (result.error) {
            errors.push(result.error);
        } else {
            //TODO
            console.log("UNPARSED");
            console.log(result);
        }
    }

    //TODO actually find the error messages
    return errors;
}

function _checkUserNotAlreadyRegistered(user) {
    return function (devices) {
        var checkDevice = function (device) {
            if (device.username === user) {
                throw new Error("The user is already registered: " + user);
            }
        };

        if (devices) {
            devices.devices.forEach(checkDevice);
        }
    };
}
////////////////////////////////////////////////////////////////////////////////////////////////
