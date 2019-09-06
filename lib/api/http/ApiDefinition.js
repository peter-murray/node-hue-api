'use strict';

module.exports = class ApiDefinition {

  constructor(hueApi) {
    this._hueApi = hueApi;
  }

  execute(api, parameters) {
    return this.transport.execute(api, parameters);
  }

  get hueApi() {
    return this._hueApi;
  }

  get transport() {
    return this.hueApi._getTransport();
  }
};