'use strict';

const ApiEndpoint = require('./endpoint')
  , UsernamePlaceholder = require('../../../placeholders/UsernamePlaceholder')
  , util = require('../../../util')
  , ApiError = require('../../../ApiError')
  , model = require('../../../model')
;

module.exports = {
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
    .postProcess(util.wasSuccessful),

  deleteUser: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/config/whitelist/<userid>')
    .placeholder(new UsernamePlaceholder('userid'))
    .pureJson()
    .postProcess(util.wasSuccessful),

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



function processCreateUser(data) {
  if (util.wasSuccessful(data)) {
    return data[0].success;
  } else {
    throw new ApiError(`Failed to create new user: ${JSON.stringify(data)}`);
  }
}


function createBridgeConfiguration(data) {
  return model.createFromBridge('configuration', null, data);
}

function processUnauthenticatedData(data) {
  return {
    config: data
  };
}

function buildUserPayload(data) {
  //TODO utilize the type system
  //TODO perform validation on the strings here
  // applicationName 0..20
  // deviceName 0...19

  const body = {
    devicetype: `${data.appName}#${data.deviceName}`
  };

  if (data.generateKey) {
    body.generateclientkey = true;
  }

  return {
    type: 'application/json',
    body: body
  };
}

function buildConfigurationPayload(parameters) {
  const config = parameters.config;

  let bridgeConfig;
  if (model.isBridgeConfigurationInstance(config)) {
    bridgeConfig = config;
  } else {
    bridgeConfig = createBridgeConfiguration(config);
  }

  return {
    type: 'application/json',
    body: bridgeConfig.getHuePayload()
  };
}