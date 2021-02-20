import { Api } from '../Api';
import { Transport } from './Transport';
import { ApiEndpoint } from './endpoints/ApiEndpoint';

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