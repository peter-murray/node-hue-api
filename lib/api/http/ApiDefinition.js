'use strict';

module.exports = class ApiDefinition {

  constructor(hueApi, request) {
    this._hueApi = hueApi;
    this._request = request;
  }

  execute(api, parameters) {
    return this.request.execute(api, parameters);
  }

  get hueApi() {
    return this._hueApi;
  }

  get request() {
    return this._request;
  }
};