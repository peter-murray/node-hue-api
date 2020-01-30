'use strict';

module.exports = class ApiDefinition {

  constructor(hueApi) {
    this._hueApi = hueApi;
  }

  /**
   * Execute the request to the specified API endpoint.
   * @param {ApiEndpoint} api The Api Endpoint to target
   * @param {Object=} parameters The optional parameters for the request
   * @returns {Promise<any>}
   */
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