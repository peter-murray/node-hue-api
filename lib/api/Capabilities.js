'use strict';

const capabilitiesApi = require('./http/endpoints/capabilities')
  , ApiDefinition = require('./http/ApiDefinition')
;

module.exports = class Capabilities extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return this.execute(capabilitiesApi.getAll, {baseUrl: this.hueApi._getConfig().baseUrl});
  }
};