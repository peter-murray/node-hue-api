import { model } from '@peter-murray/hue-bridge-model';
import { configurationApi } from './http/endpoints/configuration';
import { ApiDefinition } from './http/ApiDefinition';
import { Api } from './Api';

export class Configuration extends ApiDefinition {

  constructor(hueApi: Api) {
    super(hueApi);
  }

  /**
   * Obtains the complete configuration from the Hue Bridge in a raw Object format that is returned from the API.
   * This function will return all the config along with all the lights, schedules, groups, scenes, resourcelinks, etc...
   *
   * @returns The raw data returned from the Hue Bridge
   */
  getAll(): Promise<object> {
    return this.execute(configurationApi.getFullState);
  }

  /**
   * Gets the unauthenticated configuration data from the bridge.
   * @returns The unauthenticated configuration data from the bridge.
   */
  getUnauthenticatedConfig(): Promise<object> {
    return this.execute(configurationApi.getUnauthenticatedConfig);
  }

  /**
   * Updates a configuration value for the Hue Bridge.
   * @param data The data that is to be updated for the bridge configuration.
   */
  updateConfiguration(data: object | model.BridgeConfiguration): Promise<boolean> {
    return this.execute(configurationApi.updateConfiguration, {config: data});
  }

  getConfiguration(): Promise<model.BridgeConfiguration> {
    return this.execute(configurationApi.getConfiguration);
  }

  /**
   * A virtual press of the link button to perform pairing of software/services. This no longer works on the local
   * network connection due to security implications which led to it being disabled by Hue developers.
   *
   * This will function if you are using the library over the remote API/portal though.
   */
  pressLinkButton(): Promise<boolean> {
    return this.execute(configurationApi.updateConfiguration, {linkbutton: true});
  }
}
