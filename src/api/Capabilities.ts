import { ApiDefinition } from './http/ApiDefinition.js';
import { capabilitiesApi } from './http/endpoints/capabilities.js';
import { Api } from './Api.js';

export class Capabilities extends ApiDefinition {

  constructor(hueApi: Api) {
    super(hueApi);
  }

  getAll() {
    return this.execute(capabilitiesApi.getAll, {baseUrl: this.hueApi._getConfig().baseUrl});
  }
}