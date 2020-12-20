import { ApiDefinition } from './http/ApiDefinition';
import { capabilitiesApi } from './http/endpoints/capabilities';

export class Capabilities extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return this.execute(capabilitiesApi.getAll, {baseUrl: this.hueApi._getConfig().baseUrl});
  }
}