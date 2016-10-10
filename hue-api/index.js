"use strict";

var Q = require("q")
    , deepExtend = require("deep-extend")
    , http = require("./httpPromise")
    , ApiError = require("./errors").ApiError
    , utils = require("./utils")
    , lightsApi = require("./commands/lights-api")
    , sensorsApi = require("./commands/sensors-api")
    , groupsApi = require("./commands/groups-api")
    , schedulesApi = require("./commands/schedules-api")
    , scenesApi = require("./commands/scenes-api")
    , configurationApi = require("./commands/configuration-api")
    , infoApi = require("./commands/info-api")
    , scheduledEvent = require("./scheduledEvent")
    , bridgeDiscovery = require("./bridge-discovery")
    , lightState = require("./lightstate")
    , rgb = require("./rgb")
    ;

function HueApi(config) {
    this._config = config;
}

module.exports = function (host, username, timeout, port) {
    var config = {
        hostname: host,
        username: username,
        timeout: timeout || 10000,
        port: port || 80
    };

    return new HueApi(config);
};


/**
 * Gets the version data for the Philips Hue Bridge.
 *
 * @param cb An optional callback function if you don't want to be informed via a promise.
 * @returns {Q.promise} A promise will be provided that will resolve to the version data for the bridge, or {null} if a
 * callback was provided.
 */
HueApi.prototype.getVersion = function (cb) {
    var promise = this.config()
        .then(function (data) {
            return {
                name: data.name,
                version: {
                    api: data.apiversion,
                    software: data.swversion
                }
            };
        });

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.version = HueApi.prototype.getVersion;


/**
 * Loads the description for the Philips Hue.
 *
 * @param cb An optional callback function if you don't want to be informed via a promise.
 * @return {Q.promise} A promise that will be provided with a description object, or {null} if a callback was provided.
 */
HueApi.prototype.description = function (cb) {
    var promise = bridgeDiscovery.description(this._config.hostname);
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getDescription = HueApi.prototype.description;


/**
 * Reads the bridge configuration and returns it as a JSON object.
 *
 * @param cb An optional callback function to use if you do not want to use the promise for results.
 * @return {Q.promise} A promise with the result, or <null> if a callback function was provided.
 */
HueApi.prototype.config = function (cb) {
    var options = this._defaultOptions(),
        promise = http.invoke(configurationApi.getConfiguration, options);

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getConfig = HueApi.prototype.config;


/**
 * Obtains the complete state for the Bridge. This is considered to be a very expensive operation and should not be invoked
 * frequently. The results detail all config, users, groups, schedules and lights for the system.
 *
 * @param cb An optional callback function if you don't want to be informed via a promise.
 * @returns {Q.promise} A promise with the result, or {null} if a callback function was provided
 */
HueApi.prototype.getFullState = function (cb) {
    var options = this._defaultOptions(),
        promise = http.invoke(configurationApi.getFullState, options);

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.fullState = HueApi.prototype.getFullState;


/**
 * Allows a new user/device to be registered with the Philips Hue Bridge. This will return the name of the user that was
 * created by the function call.
 *
 * This function does not require the HueApi to have been initialized with a host or username. It does however require
 * the end user to have pressed the link button on the bridge, before invoking this function.
 *
 * @param host The hostname or IP Address of the Hue Bridge.
 * @param deviceDescription The description for the user/device that is being registered. This is a human readable
 * description of the user/device. If one is not provided then a default will be set.
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return {Q.promise} A promise with the result, or <null> if a callback was provided.
 */
HueApi.prototype.registerUser = function (host, deviceDescription, cb) {
    var options = {
            host: host,
            values: {}
        }
        , devicetype = "Node.js API"
        , promise
        ;

    if (utils.isFunction(deviceDescription)) {
        options.values.devicetype = devicetype;
        cb = deviceDescription;
    } else {
        options.values.devicetype = deviceDescription || devicetype
    }

    promise = http.invoke(configurationApi.createUser, options);
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.createUser = HueApi.prototype.registerUser;


/**
 * Presses the Link Button on the Bridge (without the user actually having to do it). If successful then {true} will be
 * returned as the result.
 *
 * @param cb An optional callback function to use if you do not want to use the promise returned.
 * @return {Q.promise} A promise with the result, or <null> if a callback was provided.
 */
HueApi.prototype.pressLinkButton = function (cb) {
    var options = this._defaultOptions(),
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
    var options = this._defaultOptions(),
        promise;

    promise = _setDeleteUserOptions(options, username);
    if (!promise) {
        promise = http.invoke(configurationApi.deleteUser, options);
    }
    return utils.promiseOrCallback(promise, cb);
};
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
                            "name": device.name,
                            "username": key,
                            "created": device["create date"],
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
HueApi.prototype.getRegisteredUsers = HueApi.prototype.registeredUsers;


/**
 * Obtains the details of the individual sensors that are attached to the Philips Hue.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the lights object, or {null} if a callback function was provided.
 */
HueApi.prototype.sensors = function (cb) {
    var options = this._defaultOptions(),
        promise;

    promise = http.invoke(sensorsApi.getAllSensors, options);

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getSensors = HueApi.prototype.sensors;

/**
 * Obtains the details of the individual lights that are attached to the Philips Hue.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the lights object, or {null} if a callback function was provided.
 */
HueApi.prototype.lights = function (cb) {
    var options = this._defaultOptions(),
      promise;

    promise = http.invoke(lightsApi.getAllLights, options);

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getLights = HueApi.prototype.lights;


/**
 * Obtains the status of the specified light.
 *
 * @param id The id of the light as an integer, this value will be parsed into an integer value so can be a {String} or
 * {Number} value.
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the light status, or {null} if a callback function was provided.
 */
HueApi.prototype.lightStatus = function (id, cb) {
    var options = this._defaultOptions(),
        promise;

    promise = _setLightIdOption(options, id);

    if (!promise) {
        promise = http.invoke(lightsApi.getLightAttributesAndState, options);
    }
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getLightStatus = HueApi.prototype.lightStatus;


HueApi.prototype.lightStatusWithRGB = function(id, cb) {
    var promise = this.lightStatus(id);

    promise = promise.then(function(light) {
        var state = light.state
          , x = state.xy[0]
          , y = state.xy[1]
          , brightness = state.bri / 254
          ;
        return deepExtend({state: {rgb: rgb.convertXYtoRGB(x, y, brightness)}}, light);
    });

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getLightStatusWithRGB = HueApi.prototype.lightStatusWithRGB;

/**
 * Obtains the new lights found by the bridge, dependant upon the last search.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the new lights search result, or {null} if a callback function was provided.
 */
HueApi.prototype.newLights = function (cb) {
    var options = this._defaultOptions(),
        promise = http.invoke(lightsApi.getNewLights, options);

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getNewLights = HueApi.prototype.newLights;


/**
 * Starts a search for new lights.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the new lights, or {null} if a callback function was provided.
 */
HueApi.prototype.searchForNewLights = function (cb) {
    var options = this._defaultOptions(),
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
    var options = this._defaultOptions(),
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
    var promise = this._getLightStateOptions(id, stateValues)
        .then(function (options) {
            return http.invoke(lightsApi.setLightState, options);
        });
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
    var promise = this._getGroupLightStateOptions(id, stateValues)
        .then(function (options) {
            return http.invoke(groupsApi.setGroupState, options);
        });
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Obtains all the groups from the Hue Bridge as an Array of {id: {*}, name: {*}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will obtain the groups, or {null} if a callback was provided.
 */
HueApi.prototype.groups = function (cb) {
    var options = this._defaultOptions(),
        promise = http.invoke(groupsApi.getAllGroups, options);

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getGroups = HueApi.prototype.groups;
HueApi.prototype.getAllGroups = HueApi.prototype.groups;


/**
 * Obtains all the Luminaires from the Hue Bridge as an Array of {id: {*}, name: {*}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will obtain the luminaires, or {null} if a callback was provided.
 */
HueApi.prototype.luminaires = function (cb) {
    var promise = this._filterGroups("Luminaire");
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getLuminaires = HueApi.prototype.luminaires;


/**
 * Obtains all the LightSources from the Hue Bridge as an Array of {id: {*}, name: {*}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will obtain the lightsources, or {null} if a callback was provided.
 */
HueApi.prototype.lightSources = function (cb) {
    var promise = this._filterGroups("Lightsource");
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getLightSources = HueApi.prototype.lightSources;


/**
 * Obtains all the LightGroups from the Hue Bridge as an Array of {id: {*}, name: {*}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will obtain the LightGroups, or {null} if a callback was provided.
 */
HueApi.prototype.lightGroups = function (cb) {
    var promise = this._filterGroups("LightGroup");
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getLightGroups = HueApi.prototype.lightGroups;


/**
 * Obtains the details for a specified group in a format of {id: {*}, name: {*}, lights: [], lastAction: {*}}.
 *
 * @param id {Number} or {String} which is the id of the group to get the details for.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will set the specified state on the light, or {null} if a callback was provided.
 */
HueApi.prototype.getGroup = function (id, cb) {
    var options = this._defaultOptions(),
        promise;

    //TODO find a way to make this a normal post processing action in the groups-api, the id from the call needs to be injected...
    function processGroupResult(group) {
        var result = {
            id: String(id),
            name: group.name,
            type: group.type,
            lights: group.lights,
            lastAction: group.action
        };

        if (group.type === "Luminaire" && group.modelid) {
            result.modelid = group.modelid;
        }

        return result;
    }

    promise = _setGroupIdOption(options, id);
    if (!promise) {
        promise = http.invoke(groupsApi.getGroupAttributes, options).then(processGroupResult);
    }

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.group = HueApi.prototype.getGroup;


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
    var options = this._defaultOptions(),
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
        } else if (param === undefined || param === null) {
            // Ignore it
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
 * Creates a new light Group.
 *
 * @param name The name of the group that we are creating, limited to 16 characters.
 * @param lightIds {Array} of ids for the lights to be included in the group.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return the id of the group that was created, or null if a callback was provided.
 */
HueApi.prototype.createGroup = function (name, lightIds, cb) {
    var options = this._defaultOptions(),
        promise;

    options.values = {
        name: name,
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
    var options = this._defaultOptions(),
        promise = _setGroupIdOptionForModification(options, id);

    if (!promise) {
        promise = http.invoke(groupsApi.deleteGroup, options);
    }
    return utils.promiseOrCallback(promise, cb);
};


/**
 * Gets the schedules on the Bridge, as an array of {"id": {String}, "name": {String}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will return the results or <null> if a callback was provided.
 */
HueApi.prototype.schedules = function (cb) {
    var options = this._defaultOptions(),
        promise = http.invoke(schedulesApi.getAllSchedules, options);

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getSchedules = HueApi.prototype.schedules;


/**
 * Gets the specified schedule by id, which is in an identical format the the Hue API documentation, with the addition
 * of an "id" value for the schedule.
 *
 * @param id The id of the schedule to retrieve.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @returns A promise that will return the results or <null> if a callback was provided.
 */
HueApi.prototype.getSchedule = function (id, cb) {
    var options = this._defaultOptions()
      , promise = _setScheduleIdOption(options, id)
      ;

    function parseResults(result) {
        result.id = id;
        return result;
    }

    if (!promise) {
        promise = http.invoke(schedulesApi.getSchedule, options).then(parseResults);
    }
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.schedule = HueApi.prototype.getSchedule;


/**
 * Creates a one time scheduled event. The results from this function is the id of the created schedule. The bridge only
 * supports 100 schedules, so once they are triggered, they are removed from the bridge.
 *
 * @param schedule {ScheduledEvent}
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will return the id value of the schedule that was created, or <null> if a callback was provided.
 */
HueApi.prototype.scheduleEvent = function (schedule, cb) {
    return this._createSchedule(schedule, cb);
};
HueApi.prototype.createSchedule = HueApi.prototype.scheduleEvent;


/**
 * Deletes a schedule by id, returning {true} if the deletion was successful.
 *
 * @param id of the schedule
 * @param cb An option callback function to use if you do not want to use a promise for the results.
 * @return {Q.promise} A promise that will return the result of the deletion, or <null> if a callback was provided.
 */
HueApi.prototype.deleteSchedule = function (id, cb) {
    var options = this._defaultOptions()
      , promise = _setScheduleIdOption(options, id)
      ;

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
    var options = this._defaultOptions()
      , promise
      ;

    promise = _setScheduleIdOption(options, id);
    if (!promise) {
        promise = _setScheduleOptionsForUpdate(options, schedule);
    }

    if (!promise) {
        promise = http.invoke(schedulesApi.setScheduleAttributes, options);
    }

    return utils.promiseOrCallback(promise, cb);
};


/**
 * Gets the scenes on the Bridge, as an array of {"id": {String}, "name": {String}, "lights": {Array}, "active": {Boolean}}
 * objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will return the results or <null> if a callback was provided.
 */
HueApi.prototype.scenes = function (cb) {
    var promise = this._scenes()
        .then(function (result) {
            var scenes = [];

            Object.keys(result).forEach(function (id) {
                var scene = result[id]
                  , enrichedScene = deepExtend({}, scene)
                  ;

                enrichedScene.id = id;
                scenes.push(enrichedScene);
            });
            return scenes;
        });

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getScenes = HueApi.prototype.scenes;


/**
 * Obtains a scene by a given id.
 * @param sceneId {String} The id of the scene to obtain.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will return the scene or <null> if a callback was provided.
 */
HueApi.prototype.scene = function (sceneId, cb) {
    var options = this._defaultOptions()
      , promise = _setSceneIdOption(options, sceneId)
      ;

    if (!promise) {
      // No errors in sceneId
      promise = http.invoke(scenesApi.getScene, options)
        .then(function(data) {
          data.id = sceneId;
          return data;
        })
    }

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getScene = HueApi.prototype.scene;

/**
 * Deletes a Scene (that is stored inside the bridge, not in the lights).
 * @param sceneId The ID for the scene to delete
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @returns {*} A promise that will return the result from deleting the scene or null if a callback was provided.
 */
HueApi.prototype.deleteScene = function(sceneId, cb) {
    var options = this._defaultOptions()
      , promise = _setSceneIdOption(options, sceneId)
      ;

    if (!promise) {
        // No errors in sceneId
        promise = http.invoke(scenesApi.deleteScene, options);
    }

    return utils.promiseOrCallback(promise, cb);
};

/**
 * Creates a new Scene.
 * When the scene is created, it will store the current state of the lights and will use those "current" settings
 * when the scene is recalled/activated later.
 *
 * There are two variants to this function, one that accepts lightIds and a name and another that takes a Scene object.
 * The former is to maintain backwards compatibility with the 1.2.x version of this library.
 *
 * @param lightIds {Array} of ids for the lights to be included in the scene.
 * @param name {String} The name of the scene to be created. If one is not provided, then the id of the scene will become the name.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return the id of the scene that was created (as well as the values that make up the scene),
 * or null if a callback was provided.
 */
HueApi.prototype.createScene = function (scene, cb) {
    var self = this;

    if (Array.isArray(arguments[0])) {
        return self.createBasicScene(arguments[0], arguments[1], arguments[2]);
    } else {
        return self.createAdvancedScene(arguments[0], arguments[1]);
    }
};

/**
 * Provides backwards compatibility for < 1.11.x versions of the Hue Bridge Firmware.
 * @param lightIds
 * @param name
 * @param cb
 * @returns {*}
 */
HueApi.prototype.createBasicScene = function (lightIds, name, cb) {
    var self = this
      , options = self._defaultOptions()
      , promise
      ;

    options.values = {
        name: name,
        lights: utils.createStringValueArray(lightIds),
        recycle: false
    };

    promise = http.invoke(scenesApi.createScene, options);
    return utils.promiseOrCallback(promise, cb);
};

/**
 * Provides scene creation for >= 1.11.x firmware versions of the Hue Bridge.
 * @param scene The Scene object containing the details of the scene to be created.
 * @param cb An optional callback function to use if you do not want to use a promise chain for the results.
 * @returns {*}
 */
HueApi.prototype.createAdvancedScene = function(scene, cb) {
    var self = this
      , options = self._defaultOptions()
      , myScene = deepExtend({recycle: false}, scene)
      , promise
      ;

    //TODO validate the options object
    options.values = myScene;

    promise = http.invoke(scenesApi.createScene, options);
    return utils.promiseOrCallback(promise, cb);
};

//TODO scene updates are now done as two different calls one for name and lights (and possible store current state) and a second of just setting individual light states
/**
 * Update the lights and/or name associated with a scene (or will create a new one if the
 * sceneId is not present in the bridge).
 *
 * @param sceneId {String} The id for the scene in the bridge
 * @param scene The configuration of the scene with the details to modify, which can be either a name or an array of
 * light ids.
 * @param storeLightState {Boolean} flag to save the current light state of the lights in the scene.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return the id of the scene that was updated and the light ids that are now set,
 * or null if a callback was provided.
 */
HueApi.prototype.updateScene = function (sceneId, scene, storeLightState, cb) {
    var self = this
        , options = self._defaultOptions()
        , storeState = !! storeLightState
        , promise = _setSceneIdOption(options, sceneId)
        ;

    if (!promise) {
        // No errors in sceneId

        //TODO validate that we have at least one parameter to modify before calling

        if (utils.isFunction(storeLightState)) {
            cb = storeLightState;
            storeState = false;
        }

        options.values = {};

        // Only set the storelightstate to true, as the bridge does not accept a false value for this in version 1.11.0
        if (storeState) {
            options.values.storelightstate = true;
        }

        if (scene) {
            if (scene.lights) {
                options.values.lights = utils.createStringValueArray(scene.lights);
            }

            if (scene.name) {
                options.values.name = scene.name;
            }
        }
        promise = http.invoke(scenesApi.modifyScene, options);
    }
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.modifyScene = HueApi.prototype.updateScene;

/**
 * Modifies the light state of one of the lights in a scene.
 *
 * @param sceneId The scene id, which if it does not exist a new scene will be created.
 * @param lightId integer The id of light that is having the state values set.
 * @param stateValues {Object} containing the properties and values to set on the light.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will return the state values on the light, or {null} if a callback was provided.
 */
HueApi.prototype.setSceneLightState = function (sceneId, lightId, stateValues, cb) {
    var promise;

    promise = this._getLightStateOptions(lightId, stateValues)
        .then(function (options) {
            // Need to set id and lightId correctly, the above call treats the lightId as the id
            options.lightId = options.id;
            options.id = sceneId;

            return http.invoke(scenesApi.modifyLightState, options);
        });
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.updateSceneLightState = HueApi.prototype.setSceneLightState;
HueApi.prototype.modifySceneLightState = HueApi.prototype.setSceneLightState;


/**
 * Helper-function that recalls a scene for a group using setGroupLightState. Reason for existence is simplicity for
 * user.
 *
 * @param sceneId The id of the scene to activate, which is an integer or a value that can be parsed into an integer value.
 * @param groupIdFilter An optional group filter to apply to the scene, to select a sub set of the lights in the scene. This can
 * be {null} or {undefined} to not apply a filter.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will set activate the scene, or {null} if a callback was provided.
 */
HueApi.prototype.activateScene = function (sceneId, groupIdFilter, cb) {
    var promise;

    if (utils.isFunction(groupIdFilter)) {
        cb = groupIdFilter;
        groupIdFilter = null;
    }

    try {
        groupIdFilter = Number(groupIdFilter, 10);
        if (isNaN(groupIdFilter)) {
            groupIdFilter = 0;
        }
    } catch (err) {
        groupIdFilter = 0;
    }

    promise = this.setGroupLightState(groupIdFilter, {scene: sceneId});
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.recallScene = HueApi.prototype.activateScene;


// TODO this is flawed as the name can be in multiple scenes, all of which are active...
///**
// * Helper function that recalls a scene for a group using setGroupLightState. The id is extracted from the name, if
// * multiple ids is encountered which often is the case when a scene is edited via an ios/android app the last one is
// * used. Currently this is the scene last saved this is an assumption bases on undocumented handling.
// *
// * @param id The id of the light which is an integer or a value that can be parsed into an integer value.
// * @param stateValues {Object} containing the properties and values to set on the light.
// * @param cb An optional callback function to use if you do not want to use a promise for the results.
// * @return A promise that will set the specified state on the light, or {null} if a callback was provided.
// */
////TODO rename
//HueApi.prototype.recallSceneByName = function (groupId, sceneName, cb) {
//    var self = this
//        , deferred = Q.defer()
//        , scenes = {}
//        ;
//
//    //TODO this will not function as expected
//    self.scenes()
//        .then(function (sceneArray) {
//            sceneArray.forEach(function (scene) {
//                scenes[scene.name] = scene.id;
//            });
//
//            if (typeof scenes[sceneName] !== 'undefined') {
//                self.setGroupLightState(groupId, {scene: scenes[sceneName]})
//                    .then(function (result) {
//                        deferred.resolve(result);
//                    });
//            }
//        }).done();
//
//    return utils.promiseOrCallback(deferred.promise, cb);
//};


/**
 * Obtains all the allowed timezones from the bridge.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return the id of the scene that was created, or null if a callback was provided.
 */
HueApi.prototype.getTimezones = function (cb) {
    var options = this._defaultOptions()
        , promise = http.invoke(infoApi.getAllTimezones, options)
        ;

    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.timezones = HueApi.prototype.getTimezones;


////////////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////

HueApi.prototype._getConfig = function () {
    return this._config;
};

/**
 * Creates a default options object for connecting with a Hue Bridge.
 *
 * @returns {{host: *, username: *, timeout: *}}
 * @private
 */
HueApi.prototype._defaultOptions = function () {
    var config = this._getConfig();

    return {
        host: config.hostname,
        username: config.username,
        timeout: config.timeout,
        port: config.port
    };
};

HueApi.prototype._filterGroups = function (type) {
    var self = this;

    return self.groups()
        .then(function (groups) {
            var results = [];

            if (groups) {
                groups.forEach(function (group) {
                    if (group.type === type) {
                        results.push(group);
                    }
                })
            }

            return results;
        });
};

HueApi.prototype._scenes = function () {
    var options = this._defaultOptions();
    return http.invoke(scenesApi.getAllScenes, options);
};

/**
 * Obtains the lights in a group and separates them into sub groups based on the model.
 * @param groupId The id of the group.
 * @returns {Object} A map of modelid to and array of lights that have that model.
 * @private
 */
HueApi.prototype._getGroupLightsByType = function (groupId) {
    var self = this;

    return Q.all(
        [
            self.getGroup(groupId),
            self.getLights()
        ])
        .spread(function (group, allLights) {
            var map = {}
                , lightMap = getLightsModelMap(allLights)
                ;

            if (group && group.lights) {
                group.lights.forEach(function(lightId) {
                    var modelid = lightMap[lightId];

                    if (map[modelid]) {
                        map[modelid].push(lightId);
                    } else {
                        map[modelid] = [lightId];
                    }
                });
            }

            return map;
        });
};

/**
 * Generates the light state options for a group
 * @param groupId The group to apply the state values to
 * @param stateValues The state of the lights to apply
 * @returns {Q.promise} That will resolve to a set of options for the group or an array of options to apply subsets of
 * lights in the group.
 * @private
 */
HueApi.prototype._getGroupLightStateOptions = function (groupId, stateValues) {
    var self = this
        , options = self._defaultOptions()
        , state
        , deferred
        , promise
        ;

    promise = _setGroupIdOption(options, groupId);

    if (!promise) {
        // No errors in the group id

        if (lightState.isLightState(stateValues)) {
            state = stateValues;
        } else {
            state = lightState.create(stateValues);
        }

        if (state.hasRGB()) {
            //TODO RGB is tricky with groups, need to break the group into types and perform conversion
            // Get all lights in the group,
            // separate into types based on model
            // create multiple states per model
            // return a map of sub groups to states required

            deferred = Q.defer();
            deferred.reject(new ApiError("RGB state is not supported for groups yet"));
            promise = deferred.promise;

            //// Separate the lights into models and apply the state to each type
            //promise = self._getGroupLightsByType(groupId)
            //    .then(function(groupLightsMap) {
            //        var models = Object.keys(groupLightsMap)
            //            , result = []
            //            ;
            //
            //        models.forEach(function(model) {
            //            var newState = state.copy();
            //            newState.applyRGB(model);
            //
            //            result.push({
            //                modelid: model,
            //                lights: groupLightsMap[model],
            //                state: newState
            //            });
            //        });
            //
            //        return result;
            //    })
            //    .then(function(subgroupsWithState) {
            //       //TODO need to create options
            //    });
        } else {
            options.values = state.payload();

            deferred = Q.defer();
            deferred.resolve(options);
            promise = deferred.promise;
        }
    }

    return promise;
};

HueApi.prototype._getLightStateOptions = function (lightId, stateValues) {
    var self = this
        , options = self._defaultOptions()
        , deferred
        , state
        , promise
        ;

    promise = _setLightIdOption(options, lightId);

    if (!promise) {
        // We have not errored, so check if we need to convert an rgb value

        if (lightState.isLightState(stateValues)) {
            state = stateValues;
        } else {
            state = lightState.create(stateValues);
        }

        if (state.hasRGB()) {
            promise = self.lightStatus(lightId)
                .then(function (lightDetails) {
                    state = state.applyRGB(lightDetails.modelid);
                    options.values = state.payload();

                    return options;
                });
        } else {
            options.values = state.payload();

            deferred = Q.defer();
            deferred.resolve(options);

            promise = deferred.promise;
        }

    }

    return promise;
};

/**
 * Creates a new schedule in the Hue Bridge.
 *
 * @param schedule The schedule object to create.
 * @param cb An optional callback if you do not want to use the promise for results.
 * @returns {Q.promise} A promise with the creation results, or <null> if a callback was provided.
 * @private
 */
HueApi.prototype._createSchedule = function (schedule, cb) {
    var options = this._defaultOptions(),
        promise = _setScheduleOptionsForCreation(options, schedule);

    if (!promise) {
        promise = http.invoke(schedulesApi.createSchedule, options);
    }
    return utils.promiseOrCallback(promise, cb);
};

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

function getLightsModelMap(lightsArray) {
    var map = {};

    if (Array.isArray(lightsArray)) {
        lightsArray.forEach(function(light) {
            map[light.id] = light.modelid;
        });
    }

    return map;
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
 * Validates and then injects the 'id' into the options for a group in the bridge.
 *
 * @param options The options to add the 'id' to.
 * @param sceneId The id of the scene
 * @return {Q.promise} A promise that will throw an error or null if the scene id was valid.
 * @private
 */
function _setSceneIdOption(options, sceneId) {
    var errorPromise = null;

    if (!_isSceneIdValid(sceneId)) {
        errorPromise = _errorPromise("The scene id '" + sceneId + "' is not valid for this Hue Bridge.");
    } else {
        options.id = sceneId;
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

function _isSceneIdValid(id) {
    return id && (String(id).length > 0);
}