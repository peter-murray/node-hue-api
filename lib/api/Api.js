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
  , StateCache = require('./stateCache')
  // , EntertainmentApi = require('./entertainment/EntertainmentApi')
  , HueApiConfig = require('./HueApiConfig')
;

module.exports = class Api {

  constructor(config, transport, remote) {
    const self = this;

    self._config = new HueApiConfig(config, transport, remote);

    self.capabilities = new Capabilities(self);
    self.configuration = new Configuration(self);
    self.lights = new Lights(self);
    self.groups = new Groups(self);
    self.sensors = new Sensors(self);
    self.schedules = new Schedules(self);
    self.scenes = new Scenes(self);
    self.users = new Users(self);

    // Add the remote API if this is a remote instance of the API
    if (self._config.isRemote) {
      self.remote = new Remote(self);
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

  getCachedState() {
    const self = this;

    if (self.isSyncing()) {
      return self._syncPromise.then(() => {return self._state;});
    } else {
      return Promise.resolve(self._state);
    }
  }

  isSyncing() {
    return this._syncPromise != null;
  }

  getLastSyncTime() {
    return this._lastSyncTime;
  }

  syncWithBridge() {
    const self = this;

    // We can only sync if there is a username passed to us, which will not be the case if we are creating the user
    // first.
    if (self._config.username) {
      if (!self.isSyncing()) {
        self._syncPromise = self.configuration.getAll()
          .then(data => {
            self._syncPromise = null;
            self._state = new StateCache(data);
            self._lastSyncTime = new Date().getTime();
          })
          .catch(() => {
            self._syncPromise = null;
          });
      }
    }
  }

  getLightDefinition(id) {
    return this.getCachedState().then(() => {
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