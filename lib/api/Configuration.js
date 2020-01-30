'use strict';

const configurationApi = require('./http/endpoints/configuration')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , util = require('../util')
;

/**
 * Interacts with the Hue Bridge Configuration.
 *
 * @typedef {import('../model/BridgeConfiguration)} BridgeConfiguration
 *
 * @type {Configuration}
 */
module.exports = class Configuration extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  /**
   * Obtains the complete configuration from the Hue Bridge in a raw Object format that is returned from the API.
   * This function will return all the config along with all the lights, schedules, groups, scenes, resourcelinks, etc...
   *
   * @returns {Promise<any>} The raw data returned from the Hue Bridge
   */
  getAll() {
    return this.execute(configurationApi.getFullState);
  }

  /**
   * Gets the unauthenticated configuration data from the bridge.
   * @returns {Promise<any>} The unauthenticated configuration data from the bridge.
   */
  getUnauthenticatedConfig() {
    return this.execute(configurationApi.getUnauthenticatedConfig);
  }

  /**
   * Updates a configuration value for the Hue Bridge.
   * @param data {Object | BridgeConfiguration} An Object (or BridgeConfiguration) representing the data that is to be
   * updated for the bridge configuration.
   * @deprecated Use updateConfiguration() instead
   * @returns {Promise<boolean>}
   */
  update(data) {
    util.deprecatedFunction('5.x', 'configuration.update(data)', 'Use configuration.updateConfiguration(data) instead');
    return this.updateConfiguration(data);
  }

  /**
   * Updates a configuration value for the Hue Bridge.
   * @param data {Object | BridgeConfiguration} An Object (or BridgeConfiguration) representing the data that is to be
   * updated for the bridge configuration.
   * @returns {Promise<boolean>}
   */
  updateConfiguration(data) {
    return this.execute(configurationApi.updateConfiguration, {config: data});
  }

  /**
   * Obtains the configuration of the Hue Bridge.
   * @returns {Object} A object representing the configuration properties of the Hue Bridge.
   * @deprecated Use getConfiguration() instead.
   */
  get() {
    util.deprecatedFunction('5.x', 'configuration.get()', 'Use configuration.getConfiguration() instead');
    return this.getConfiguration();
  }

  /**
   * Obtains the configuration of the Hue Bridge.
   * @returns {Promise<Object>} A object representing the configuration properties of the Hue Bridge.
   */
  getConfiguration() {
    return this.execute(configurationApi.getConfiguration);
  }

  /**
   * A virtual press of the link button to perform pairing of software/services. This no longer works on the local
   * network connection due to security implications which led to it being disabled by Hue developers.
   *
   * This will function if you are using the library over the remote API/portal though.
   *
   * @returns {Promise<boolean>}
   */
  pressLinkButton() {
    return this.execute(configurationApi.updateConfiguration, {linkbutton: true});
  }
};
