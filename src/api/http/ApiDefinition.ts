import { Api } from '../Api.js';
import { Transport } from './Transport.js';
import { ApiEndpoint } from './endpoints/ApiEndpoint.js';

export class ApiDefinition {

  private readonly _hueApi: Api;

  constructor(hueApi: Api) {
    this._hueApi = hueApi;
  }

  execute(api: ApiEndpoint, parameters?: any): Promise<any> {
    return this.transport.execute(api, parameters);
  }

  get hueApi(): Api {
    return this._hueApi;
  }

  get transport(): Transport {
    return this.hueApi._getTransport();
  }
}