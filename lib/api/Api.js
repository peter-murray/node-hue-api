'use strict';

const Capabilities = require('./Capabilities')
  , Lights = require('./Lights')
  , Groups = require('./Groups')
  , Configuration = require('./Configuration')
  , Users = require('./Users')
  , Sensors = require('./Sensors')
  , Schedules = require('./Schedules')
  , Scenes = require('./Scenes')
  , Remote = require('./Remote')
  , Rules = require('./Rules')
  , ResourceLinks = require('./ResourceLinks')
  , Cache = require('./Cache')
  // , EntertainmentApi = require('./entertainment/EntertainmentApi')
  , HueApiConfig = require('./HueApiConfig')
;
/**
 * @typedef {import('../model/Light')} Light
 * @typedef {import('./Cache')} Cache
 *
 * @type {Api}
 */
module.exports = class Api {

  constructor(config, transport, remote) {
    const self = this;

    self._config = new HueApiConfig(config, transport, remote);
    
    self._api = {
      capabilities: new Capabilities(self),
      configuration: new Configuration(self),
      lights: new Lights(self),
      groups: new Groups(self),
      sensors: new Sensors(self),
      schedules: new Schedules(self),
      scenes: new Scenes(self),
      users: new Users(self),
      rules: new Rules(self),
      resourceLinks: new ResourceLinks(self)
    };

    // Add the remote API if this is a remote instance of the API
    if (self._config.isRemote) {
      self._api.remote = new Remote(self);
    }

    //TODO initial investigation in to the Streaming API for Entertainment
    // if (config.clientkey) {
    //   self.entertainment = new EntertainmentApi(self);
    // }

    // Load the initial state upon first connection
    self._lastSyncTime = -1;
    self._state = null;

    self.syncWithBridge();
  }

  /** @returns {Capabilities} */
  get capabilities() {
    return this._api.capabilities;
  }

  /** @returns {Configuration} */
  get configuration() {
    return this._api.configuration;
  }

  /** @returns {Lights} */
  get lights() {
    return this._api.lights;
  }

  /** @returns {Groups} */
  get groups() {
    return this._api.groups;
  }

  /** @returns {Sensors} */
  get sensors() {
    return this._api.sensors;
  }

  /** @returns {Schedules} */
  get schedules() {
    return this._api.schedules;
  }

  /** @returns {Scenes} */
  get scenes() {
    return this._api.scenes;
  }

  /** @returns {Users} */
  get users() {
    return this._api.users;
  }

  /** @returns {Rules} */
  get rules() {
    return this._api.rules;
  }

  /** @returns {ResourceLinks} */
  get resourceLinks() {
    return this._api.resourceLinks;
  }

  /**
   * Obtains the remote API endpoints, this will only be present if you have a remote connection established.
   * @returns {Remote|null|undefined}
   */
  get remote() {
    return this._api.remote;
  }

  /**
   * Obtains the previously cached state that was obtained from the bridge.
   * @returns {Promise<Cache>}
   */
  getCachedState() {
    const self = this;

    if (self.isSyncing()) {
      return self._syncPromise.then(() => {
        return self._state;
      });
    } else {
      return Promise.resolve(self._state);
    }
  }

  /**
   * Checks to see if the API is still syncing with the Hue bridge.
   * @returns {boolean}
   */
  isSyncing() {
    return this._syncPromise != null;
  }

  /**
   * The timestamp of the last sync for the cached state.
   * @returns {number}
   */
  getLastSyncTime() {
    return this._lastSyncTime;
  }

  /**
   * Performs an async synchronization activity with the hue bridge to cache the state of things like lights, etc...
   */
  syncWithBridge() {
    const self = this;

    if (!self.isSyncing()) {
      if (self._config.username) {
        // We can only sync if there is a username passed to us, which will not be the case if we are creating the user
        // first.
        self._syncPromise = self.configuration.getAll();
      } else {
        // We can only obtain the open config when no user is passed in
        self._syncPromise = self.configuration.getUnauthenticatedConfig();
      }

      self._syncPromise = self._syncPromise.then(data => {
          self._syncPromise = null;
          self._state = new Cache(data);
          self._lastSyncTime = new Date().getTime();
        })
        .catch(() => {
          self._syncPromise = null;
        });
    }
  }

  /**
   * Fetches the light for the specified id from the cached state.
   * @param {number|string} id The id of the light to fetch from the cached state.
   * @returns {Promise<Light>}
   */
  getLightDefinition(id) {
    return this.getCachedState()
      .then(() => {
        return this._state.getLight(id);
      });
  }

  _getConfig() {
    return this._config;
  }

  _getTransport() {
    return this._config.transport;
  }

  _getRemote() {
    return this._config.remote;
  }


};