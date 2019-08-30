'use strict';

const utils = require('./utils')
  , SceneBuilder = require('./SceneBuilder')
  , ScheduleBuilder = require('./ScheduledEventBuilder')
  , LightStateShim = require('./LightStateShim')

  // New API
  , newApi = require('../lib/api/index')
  , discovery = require('../lib/api/discovery')
  , LightState = require('./LightStateShim')
  , SceneLightState = require('../lib/bridge-model/lightstate/SceneLightState')
;

function HueApi(config) {
  const self = this;
  self._config = config;
  self._initializing = newApi.create(config.hostname, config.username, config.timeout, config.port)
    .then(api => {
      self._api = api;
      self._initializing = null;
    });
}

HueApi.prototype._getNewApi = function () {
  const self = this;

  return new Promise((resolve) => {
    if (self._initializing) {
      self._initializing.then(() => {
        resolve(self._api);
      });
    } else {
      resolve(self._api);
    }
  });
};

module.exports = function (host, username, timeout, port) {
  const config = {
    hostname: host,
    username: username,
  };

  if (timeout) {
    config.timeout = timeout;
  }

  if (port) {
    config.port = port;
  }
  return new HueApi(config);
};


/**
 * Gets the version data for the Philips Hue Bridge.
 * Gets the version data for the Philips Hue Bridge.
 *
 * @param cb An optional callback function if you don't want to be informed via a promise.
 */
HueApi.prototype.getVersion = function (cb) {
  //TODO this could be done via the cached state
  const promise = this._getNewApi().then(api => {
    return api.configuration.getAll()
      .then(state => {
        return {
          name: state.config.name,
          version: {
            api: state.config.apiversion,
            software: state.config.swversion
          }
        };
      });
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
  const promise = discovery.description(this._config.hostname);
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
  const promise = this._getNewApi().then(api => {
    return api.configuration.get();
  });

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
  const promise = this._getNewApi().then(api => {
    return api.configuration.getAll();
  });

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
 * @param deviceName The name of the device (human readable) limited to 19 characters.
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return {Q.promise} A promise with the result, or <null> if a callback was provided.
 */
HueApi.prototype.registerUser = function (deviceDescription, cb) {
  let deviceName = null;

  if (utils.isFunction(deviceDescription)) {
    cb = deviceDescription;
  } else {
    deviceName = deviceDescription;
  }

  if (!deviceName) {
    deviceName = 'app';
  }

  const promise = this._getNewApi().then(api => {
    return api.configuration.createUser('node_hue_api', deviceName, false);
  });

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
  const promise = this._getNewApi().then(api => {
    return api.configuration.pressLinkButton();
  });

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
  const promise = this._getNewApi().then(api => {
    return api.configuration.deleteUser(username);
  });

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
    const list = result.whitelist,
      devices = [];

    if (list) {
      Object.keys(list).forEach(function (key) {
        let device;
        if (list.hasOwnProperty(key)) {
          device = list[key];
          devices.push(
            {
              'name': device.name,
              'username': key,
              'created': device['createGroup date'],
              'accessed': device['last use date']
            }
          );
        }
      });
    }
    return {'devices': devices};
  }

  const promise = this.config().then(processUsers);
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
  const promise = this._getNewApi().then(api => {
    return api.sensors.getAll().then(sensors => {return {sensors: sensors};});
  });

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
  function generateResponseData(data) {
    const result = [];

    data.forEach(light => {
      result.push(Object.assign({id: light.id}, light.bridgeData));
    });

    return {lights: result};
  }

  const promise = this._getNewApi().then(api => {
    return api.lights.getAll();
  }).then(generateResponseData);

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
  const promise = this._getNewApi().then(api => {
    return api.lights.getLightAttributesAndState(id);
  });

  return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getLightStatus = HueApi.prototype.lightStatus;


/**
 * Obtains the new lights found by the bridge, dependant upon the last search.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the new lights search result, or {null} if a callback function was provided.
 */
HueApi.prototype.newLights = function (cb) {
  const promise = this._getNewApi()
    .then(api => {
      return api.lights.getNew();
    });

  return utils.nativePromiseOrCallback(promise, cb);
};
HueApi.prototype.getNewLights = HueApi.prototype.newLights;

/**
 * Starts a search for new lights.
 *
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the new lights, or {null} if a callback function was provided.
 */
HueApi.prototype.searchForNewLights = function (cb) {
  const promise = this._getNewApi().then(api => {
    return api.lights.searchForNew();
  });

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
  const promise = this._getNewApi().then(api => {
    return api.lights.rename(id, name);
  });

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
  const self = this,
    promise = self._getNewApi().then(api => {
      const lightState = _getNewLightState(id, stateValues);
      return api.lights.setLightState(id, lightState);
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
  const promise = this._getNewApi()
    .then(api => {
      return api.groups.setGroupState(id, stateValues);
    });

  return utils.promiseOrCallback(promise, cb);
};

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
 * Obtains the status of the specified sensor.
 *
 * @param id The id of the sensor as an integer, this value will be parsed into an integer value so can be a {String} or
 * {Number} value.
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the sensor status, or {null} if a callback function was provided.
 */
HueApi.prototype.sensorStatus = function (id, cb) {
    var options = this._defaultOptions(),
        promise;

    promise = _setSensorIdOption(options, id);

    if (!promise) {
        promise = http.invoke(sensorsApi.getSensorAttributesAndState, options);
    }
    return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getSensorStatus = HueApi.prototype.sensorStatus;

/**
 * Sets the name of a sensor on the Bridge.
 *
 * @param id The ID of the sensor to set the name for.
 * @param name The name to apply to the sensor.
 * @param cb An optional callback function to use if you do not want a promise returned.
 * @return A promise that will be provided with the results of setting the name, or {null} if a callback function was provided.
 */
HueApi.prototype.setSensorName = function (id, name, cb) {
    var options = this._defaultOptions(),
        promise;

    promise = _setSensorIdOption(options, id);

    options.values = {
        "name": name
    };

    if (!promise) {
        promise = http.invoke(sensorsApi.renameSensor, options);
    }
    return utils.promiseOrCallback(promise, cb);
};



/**
 * Obtains all the groups from the Hue Bridge as an Array of {id: {*}, name: {*}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will obtain the groups, or {null} if a callback was provided.
 */
HueApi.prototype.groups = function (cb) {
  const promise = this._getNewApi()
    .then(api => {
      return api.groups.getAll();
    });

  return utils.nativePromiseOrCallback(promise, cb);
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
  const promise = this._getNewApi().then(api => {
    return api.groups.getLuminaires();
  });

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
  const promise = this._getNewApi().then(api => {
    return api.groups.getLightSources();
  });

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
  const promise = this._getNewApi().then(api => {
    return api.groups.getLightGroups();
  });

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
  const promise = this._getNewApi()
    .then(api => {
      return api.groups.get(id);
    });

  return utils.nativePromiseOrCallback(promise, cb);
  // //TODO find a way to make this a normal post processing action in the groups-api, the id from the call needs to be injected...
  // function processGroupResult(group) {
  //   var result = {
  //     id: String(id),
  //     name: group.name,
  //     type: group.type,
  //     lights: group.lights,
  //     lastAction: group.action
  //   };

  // if (group.type === 'Luminaire' && group.modelid) {
  //   result.modelid = group.modelid;
  // }

  // return result;
  // }
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
  // Due to name and lightIds being "optional" we have to re-parse the arguments to get the right ones
  const parameters = [].slice.call(arguments, 1)
    , payload = {}
  ;

  parameters.forEach(function (param) {
    if (param instanceof Function) {
      cb = param;
    } else if (Array.isArray(param)) {
      payload.lights = utils.createStringValueArray(param);
    } else if (param === undefined || param === null) {
      // Ignore it
    } else {
      payload.name = param;
    }
  });

  const promise = this._getNewApi()
    .then(api => {
      return api.groups.update(id, payload);
    });

  return utils.nativePromiseOrCallback(promise, cb);
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
  const promise = this._getNewApi()
    .then(api => {
      return api.groups.createGroup(name, lightIds);
    });

  return utils.nativePromiseOrCallback(promise, cb);
};


/**
 * Deletes a group with the specified id, returning <true> if the action was successful.
 *
 * @param id The id of the group to delete.
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return <true> if the deletion was successful, or null if a callback was provided.
 */
HueApi.prototype.deleteGroup = function (id, cb) {
  const promise = this._getNewApi()
    .then(api => {
      return api.groups.deleteGroup(id);
    });

  return utils.nativePromiseOrCallback(promise, cb);
};


/**
 * Gets the schedules on the Bridge, as an array of {"id": {String}, "name": {String}} objects.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return A promise that will return the results or <null> if a callback was provided.
 */
HueApi.prototype.schedules = function (cb) {
  const promise = this._getNewApi().then(api => {
    return api.schedules.getAll();
  });

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
  const promise = this._getNewApi().then(api => {
    return api.schedules.get(id);
  });

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
  const promise = this._getNewApi().then(api => {



    return api.schedules.createSchedule(schedule);
  });

  return utils.promiseOrCallback(promise, cb);
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
  const promise = this._getNewApi().then(api => {
    return api.schedules.deleteSchedule(id);
  });

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
  const promise = this._getNewApi().then(api => {
    return api.schedules.update(id, schedule);
  });

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
  const promise = this._getNewApi().then(api => {
    return api.scenes.getAll();
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
  const promise = this._getNewApi().then(api => {
    return api.scenes.get(sceneId);
  });

  return utils.promiseOrCallback(promise, cb);
};
HueApi.prototype.getScene = HueApi.prototype.scene;

/**
 * Deletes a Scene (that is stored inside the bridge, not in the lights).
 * @param sceneId The ID for the scene to delete
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @returns {*} A promise that will return the result from deleting the scene or null if a callback was provided.
 */
HueApi.prototype.deleteScene = function (sceneId, cb) {
  const promise = this._getNewApi().then(api => {
    return api.scenes.deleteScene(sceneId);
  });

  return utils.promiseOrCallback(promise, cb);
};

/**
 * Creates a new Scene.
 * When the scene is created, it will store the current state of the lights and will use those "current" settings
 * when the scene is recalled/activated later.
 **
 * @param scene {Scene} The scene to be created.
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return the id of the scene that was created (as well as the values that make up the scene),
 * or null if a callback was provided.
 */
HueApi.prototype.createScene = function (scene, cb) {
  const promise = this._getNewApi().then(api => {

    if (scene instanceof SceneBuilder) {
      scene = scene.getScene();
    }

    return api.scenes.createScene(scene);
  });

  return utils.promiseOrCallback(promise, cb);
};


/**
 * Update the lights and/or name associated with a scene (or will createGroup a new one if the
 * sceneId is not present in the bridge).
 *
 * @param sceneId {String} The id for the scene in the bridge
 * @param scene {Scene} The update scene to use to set update the existing one with
 *
 * @param cb An optional callback function to use if you do not want to use a promise for the results.
 * @return {*} A promise that will return the id of the scene that was updated and the light ids that are now set,
 * or null if a callback was provided.
 */
HueApi.prototype.updateScene = function (sceneId, scene, cb) {
  const promise = this._getNewApi().then(api => {

    if (scene instanceof SceneBuilder) {
      scene = scene.getScene();
    }

    return api.scenes.update(sceneId, scene);
  });

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
  const promise = this._getNewApi().then(api => {
    const sceneLightState = new SceneLightState();

    if (stateValues instanceof LightState) {
      sceneLightState.populate(stateValues.getPayload());
    } else {
      sceneLightState.populate(stateValues);
    }
    return api.scenes.updateLightState(sceneId, lightId, sceneLightState);
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



////////////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////


// TODO this is just a transition function until we deprecate the API
function _getNewLightState(lightId, stateValues) {
  if (stateValues instanceof LightStateShim) {
    return stateValues.lightState;
  } else if (stateValues instanceof LightState) {
    return stateValues;
  } else {
    const newLightState = new LightState();
    newLightState.populate(stateValues);
    return newLightState;
  }
}
