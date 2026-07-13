import { model } from '@peter-murray/hue-bridge-model';
import { ApiDefinition } from './http/ApiDefinition';
import { ApiError } from '../ApiError';
import { lightsApi } from './http/endpoints/lights';

import { LightIdPlaceholder } from './placeholders/LightIdPlaceholder';
import { KeyValueType } from '../commonTypes';
import { Api } from './Api';
import { HueRateLimiter } from './HueRateLimiter';

const LIGHT_ID_PARSER = new LightIdPlaceholder();

type LightStateType = model.LightState | KeyValueType

type LightId = number | string | model.Light;
type LightsType = model.Light | model.Luminaire | model.Lightsource;

export class Lights extends ApiDefinition {

  private _lightStateLimiter: HueRateLimiter;

  constructor(hueApi: Api) {
    super(hueApi);
    this._lightStateLimiter = new HueRateLimiter(hueApi.name, 'lights', hueApi.rateLimitConfig.lightRateLimit);
  }

  getAll(): Promise<LightsType[]> {
    return this.execute(lightsApi.getAllLights);
  }

  getLight(id: LightId): Promise<LightsType> {
    const lightId: number = getLightId(id);

    return this.getAll()
      .then(lights => {
        const found: LightsType[] = lights.filter((light: LightsType) => light.id === lightId);

        if (found.length === 0) {
          throw new ApiError(`Light ${lightId} not found`);
        }
        return found[0];
      });
  }

  //TODO
  // /**
  //  * @deprecated since 4.0. Use getLight(id) instead.
  //  * @param id {number} The ide of the light to get.
  //  * @returns {Promise<Light>}
  //  */
  // getLightById(id: LightId) {
  //   util.deprecatedFunction('5.x', 'lights.getLightById(id)', 'Use lights.getLight(id) instead.');
  //   return this.getLight(id);
  // }

  getLightByName(name: string): Promise<LightsType[]> {
    return this.getAll().then(lights => {
      return lights.filter(light => light.name === name);
    });
  }

  /** Discovers the "new" lights detected by the Bridge. */
  getNew(): Promise<LightsType[]> {
    return this.execute(lightsApi.getNewLights);
  }

  /** Starts a search for "new"/undiscovered Lights by the bridge. This can take up to 30 seconds to complete. */
  searchForNew(): Promise<boolean> {
    return this.execute(lightsApi.searchForNewLights);
  }

  getLightAttributesAndState(id: LightId): Promise<object> {
    return this.execute(lightsApi.getLightAttributesAndState, {id: id});
  }

  getLightState(id: LightId): Promise<object> {
    return this.getLightAttributesAndState(id).then(result => {
      // @ts-ignore
      return result.state;
    });
  }

  /**
   * Sets the current state for the Light to desired settings.
   */
  setLightState(id: LightId, state: LightStateType): Promise<object> {
    const lightId: number = getLightId(id);

    return this.hueApi.getLightDefinition(lightId)
      .then(device => {
        if (!device) {
          throw new ApiError(`Light with id:${lightId} was not found on this bridge`);
        }
        return this._setLightState(id, state, device);
      });
  }

  /**
   * Renames a Light on the Bridge to the specified name in the Light instance.
   */
  renameLight(light: LightsType): Promise<boolean> {
    return this.execute(lightsApi.setLightAttributes, {id: light, light: light});
  }

  // /**
  //  * @deprecated since 4.x, use renameLight(light) instead
  //  * @param id {int} The Light to rename.
  //  * @param name {string} The new name.
  //  * @returns {Promise}
  //  */
  // rename(id, name) {
  //   if (arguments.length === 1) {
  //     util.deprecatedFunction('5.x', 'lights.rename(id, name)', 'Use lights.renameLight(light) instead.');
  //     return this.renameLight(id);
  //   } else {
  //     util.deprecatedFunction('5.x', 'lights.rename(id, name)', 'Use lights.renameLight(light) instead.');
  //     return this.execute(lightsApi.setLightAttributes, {id: id, name: name});
  //   }
  // }

  deleteLight(id: LightId): Promise<boolean> {
    return this.execute(lightsApi.deleteLight, {id: id});
  }

  _setLightState(id: LightId, state: KeyValueType | LightStateType, device: LightsType) {
    const self = this;

    return this._lightStateLimiter.schedule(() => {
      return self.execute(lightsApi.setLightState, {id: id, state: state, device: device});
    });
  }
}

function getLightId(id: LightId): number {
  return LIGHT_ID_PARSER.getValue({id: id});
}