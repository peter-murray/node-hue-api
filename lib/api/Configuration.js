'use strict';

const configurationApi = require('./http/endpoints/configuration')
  , ApiDefinition = require('./http/ApiDefinition.js')
;


module.exports = class Configuration extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
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

  //TODO this no longer functions from local
  pressLinkButton() {
    return this.execute(configurationApi.updateConfiguration, {linkbutton: true});
  }
};
