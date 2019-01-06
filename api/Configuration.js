'use strict';

const configurationApi = require('./http/endpoints/configuration')
  , ApiDefinition = require('./http/ApiDefinition.js')
;


module.exports = class Configuration extends ApiDefinition {

  constructor(hueApi, request) {
    super(hueApi, request);
  }

  getAll() {
    return this.execute(configurationApi.getFullState);
  }

  update(data) {
    return this.execute(configurationApi.updateConfiguration, data);
  }

  get() {
    return this.execute(configurationApi.getConfiguration);
  }

  createUser(appName, deviceName, generateKey) {
    return this.execute(configurationApi.createUser,
      {appName: appName, deviceName: deviceName, generateKey: !!generateKey}
    );
  }

  deleteUser(username) {
    return this.execute(configurationApi.deleteUser, {username2: username});
  }

  pressLinkButton() {
    return this.execute(configurationApi.updateConfiguration, {linkbutton: true});
  }
};
