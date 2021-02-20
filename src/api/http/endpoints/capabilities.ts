import { ApiEndpoint } from './ApiEndpoint';
import { model } from '@peter-murray/hue-bridge-model';
import { KeyValueType } from '../../../commonTypes';

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