'use strict';

const configurationApi = require('./http/endpoints/configuration')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , util = require('../util')
;


module.exports = class Users extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return getAllUsersAsArray(this);
  }

  getUser(username) {
    return getAllUsers(this)
      .then(users => {
        let result = null;

        if (users[username]) {
          result = Object.assign({username: username}, users[username]);
        }

        return result;
      });
  }

  /**
   * @deprecated Use getUserByName(username) instead
   * @param username {string}
   */
  get(username) {
    util.deprecatedFunction('5.x', 'users.get(username)', 'Use users.getUser(username) instead.');
    return this.getUser(username);
  }

  getUserByName(appName, deviceName) {
    let nameToMatch;

    if (arguments.length === 0) {
      return Promise.resolve(null);
    } else if (arguments.length === 1) {
      nameToMatch = appName;
    } else {
      nameToMatch = `${appName}#${deviceName}`;
    }

    return getAllUsersAsArray(this)
      .then(users => {
        return users.filter(user => user.name === nameToMatch);
      });
  }

  /**
   * @deprecated use getUserByName(appName, deviceName) instead.
   * @param appName {string}
   * @param deviceName {string}
   * @returns {Promise<Object[]>}
   */
  getByName(appName, deviceName) {
    util.deprecatedFunction('5.x', 'scenes.get(id)', 'Use scenes.getScene(id) instead.');
    return this.getUserByName(appName, deviceName);
  }

  /**
   * @param appName {string}
   * @param deviceName {string}
   * @returns {Promise<any>>}
   */
  createUser(appName, deviceName) {
    return this.hueApi.getCachedState()
      .then(state => {
        //TODO may need to combine the modelid and API version, but am assuming that all newer bridges are kept up to
        // date, as do not know the specific version number of the introduction of the generateclientkey parameter.
        const oldBridge = state.modelid === 'BSB001';
        return this.execute(configurationApi.createUser, {appName: appName, deviceName: deviceName, generateKey: !oldBridge});
      });
  }

  deleteUser(username) {
    return this.execute(configurationApi.deleteUser, {element: username});
  }
};


function getAllUsers(api) {
  return api.execute(configurationApi.getConfiguration)
    .then(config => {
      return config.whitelist || null;
    });
}

function getAllUsersAsArray(api) {
  return getAllUsers(api)
    .then(users => {
      const results = [];

      Object.keys(users).forEach(username => {
        results.push(Object.assign({username: username}, users[username]));
      });
      return results;
    });
}
