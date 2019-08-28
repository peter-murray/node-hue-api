'use strict';

const Capabilities = require('./Capabilities')
  , Lights = require('./Lights')
  , Groups = require('./Groups')
  , Configuration = require('./Configuration')
  , Users = require('./Users')
  , Sensors = require('./Sensors')
  , Schedules = require('./Schedules')
  , Scenes = require('./Scenes')
  , StateCache = require('./stateCache')
  // , EntertainmentApi = require('./entertainment/EntertainmentApi')
;

module.exports = class Api {

  constructor(config, request) {
    let self = this;
    self._config = config;

    self.capabilities = new Capabilities(self, request);
    self.configuration = new Configuration(self, request);
    self.lights = new Lights(self, request);
    self.groups = new Groups(self, request);
    self.sensors = new Sensors(self, request);
    self.schedules = new Schedules(self, request);
    self.scenes = new Scenes(self, request);
    self.users = new Users(self, request);

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
};
