import { ApiEndpoint } from './ApiEndpoint.js';
import { model } from '@peter-murray/hue-bridge-model';
import { KeyValueType } from '../../../commonTypes.js';

function getAllCapabilities() {
  return new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/capabilities')
    .pureJson()
    .postProcess(buildCapabilities)
    ;
}

const capabilitiesApi = {
  getAll: getAllCapabilities()
}
export {capabilitiesApi};

function buildCapabilities(data: KeyValueType, requestParameters: KeyValueType): model.Capabilities {
  // const id = requestParameters.baseUrl || null;
  return model.createFromBridge('capabilities', undefined, data);
}