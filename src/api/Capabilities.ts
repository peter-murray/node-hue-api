import { ApiDefinition } from './http/ApiDefinition';
import { capabilitiesApi } from './http/endpoints/capabilities';
import { Api } from './Api';

export class Capabilities extends ApiDefinition {

  constructor(hueApi: Api) {
    super(hueApi);
  }

  getAll() {
    return this.execute(capabilitiesApi.getAll, {baseUrl: this.hueApi._getConfig().baseUrl});
  }
}