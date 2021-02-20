import { model } from '@peter-murray/hue-bridge-model';
import { LightIdPlaceholder } from './placeholders/LightIdPlaceholder';

const LIGHT_ID_PLACEHOLDER = new LightIdPlaceholder();

type CacheData = {
  lights: {[key: number]: {[key:string]: any}},
  config: {[key: string]: any}
}

export class Cache {

  private data: CacheData;

  private _lights: {[key: number]: model.Light};

  constructor(data: CacheData) {
    this.data = data;
    this._lights = {};
  }

  /**
   * Obtains a known light from the cache
   * @param id {Number | String} The id for the light.
   */
  getLight(id: number | string | model.Light): model.Light {
    const lightId = LIGHT_ID_PLACEHOLDER.getValue({id: id});

    let light: model.Light = this._lights[lightId];

    if (!light) {
      let lightData = this.data.lights[lightId];
      if (lightData) {
        light = model.createFromBridge('light', lightId, lightData);
        this._lights[lightId] = light;
      }
    }

    return light;
  }

  /**
   * Get the modelid for the bridge.
   */
  get modelid(): string {
    // BSB001 is the first generation bridge, BSB002 is the current generation one that can support entertainment API
    return this.data.config.modelid;
  }

  /**
   * Get the API version for the bridge.
   * @return The Api Version for the bridge.
   */
  get apiversion(): string {
    return this.data.config.apiversion;
  }
}