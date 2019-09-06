'use strict';

const configurationApi = require('./http/endpoints/configuration')
  , ApiDefinition = require('./http/ApiDefinition.js')
;


module.exports = class Users extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return getAllUsersAsArray(this);
  }

  get(username) {
    return getAllUsers(this)
      .then(users => {
        let result = null;

        if (users[username]) {
          result = Object.assign({username: username}, users[username]);
        }

        return result;
      });
  }

  getByName(appName, deviceName) {
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

  createUser(appName, deviceName) {
    return this.execute(configurationApi.createUser, {appName: appName, deviceName: deviceName, generateKey: true});
  }

  deleteUser(username) {
    return this.execute(configurationApi.deleteUser, {element: username});
  }

  // pressLinkButton() {
  //   return this.execute(configurationApi.updateConfiguration, {linkbutton: true});
  // }
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
