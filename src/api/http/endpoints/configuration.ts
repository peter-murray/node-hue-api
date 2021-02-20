import { ApiBodyPayload, ApiEndpoint } from './ApiEndpoint';
import { UsernamePlaceholder } from '../../placeholders/UsernamePlaceholder';
import { model } from '@peter-murray/hue-bridge-model';
import { ApiError } from '../../../ApiError';

import { wasSuccessful } from '../../../util';
import { KeyValueType } from '../../../commonTypes';

const instanceChecks = model.instanceChecks;

export type CreatedUser = {
  username: string,
  clientkey?: string
}

const configurationApi = {
  createUser: new ApiEndpoint()
    .post()
    .acceptJson()
    .uri('/')
    .payload(buildUserPayload)
    .pureJson()
    .postProcess(processCreateUser),

  getConfiguration: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/config')
    .pureJson()
    .postProcess(createBridgeConfiguration),

  updateConfiguration: new ApiEndpoint()
    .put()
    .acceptJson()
    .uri('/<username>/config')
    .payload(buildConfigurationPayload)
    .pureJson()
    .postProcess(wasSuccessful),

  deleteUser: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/config/whitelist/<userid>')
    .placeholder(new UsernamePlaceholder('userid'))
    .pureJson()
    .postProcess(wasSuccessful),

  getFullState: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>')
    .pureJson(),

  getUnauthenticatedConfig: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/config')
    .pureJson()
    .postProcess(processUnauthenticatedData),
};
export {configurationApi};

function processCreateUser(data: any): CreatedUser {
  if (wasSuccessful(data)) {
    return data[0].success;
  } else {
    throw new ApiError(`Failed to create new user: ${JSON.stringify(data)}`);
  }
}

function createBridgeConfiguration(data: any): model.BridgeConfiguration {
  return model.createFromBridge('configuration', undefined, data);
}

function processUnauthenticatedData(data: any) {
  return {
    config: data
  };
}

function buildUserPayload(data: any): ApiBodyPayload {
  //TODO utilize the type system
  //TODO perform validation on the strings here
  // applicationName 0..20
  // deviceName 0...19

  const body = {
    devicetype: `${data.appName}#${data.deviceName}`
  };

  if (data.generateKey) {
    // @ts-ignore
    body.generateclientkey = true;
  }

  return {
    type: 'application/json',
    body: body
  };
}

function buildConfigurationPayload(parameters: KeyValueType): ApiBodyPayload {
  const config = parameters.config;

  let bridgeConfig;
  if (instanceChecks.isBridgeConfigurationInstance(config)) {
    bridgeConfig = config;
  } else {
    bridgeConfig = createBridgeConfiguration(config);
  }

  return {
    type: 'application/json',
    body: bridgeConfig.getHuePayload()
  };
}