'use strict';

const ApiEndpoint = require('./endpoint')
  , UsernamePlaceholder = require('../placeholders/UsernamePlaceholder')
  , utils = require('../../../../hue-api/utils')
  , ApiError = require('../../../ApiError')
;

function createUser() {
  return new ApiEndpoint()
    .post()
    .acceptJson()
    .uri('/')
    .payload(buildUserPayload)
    .pureJson()
    .postProcess(processCreateUser);
}

function getConfiguration() {
  return new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/config')
    .pureJson();
}

function updateConfiguration() {
  return new ApiEndpoint()
    .put()
    .acceptJson()
    .uri('/<username>/config')
    .payload(buildConfigurationPayload)
    .pureJson()
    .postProcess(processConfigurationUpdate);
}

function deleteUser() {
  return new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/config/whitelist/<element>')
    .placeholder(new UsernamePlaceholder('element'))
    // .errorHandler(deleteUserErrorHandler)
    .pureJson()
    .postProcess(processDeleteUser);
}

function getFullState() {
  return new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>')
    .pureJson();
}

module.exports = {
  createUser: createUser(),
  getConfiguration: getConfiguration(),
  updateConfiguration: updateConfiguration(),
  deleteUser: deleteUser(),
  getFullState: getFullState()
};


function processCreateUser(data) {
  if (utils.wasSuccessful(data)) {
    return data[0].success;
  } else {
    throw new ApiError(`Failed to create new user: ${JSON.stringify(data)}`);
  }
}

// function deleteUserErrorHandler(err) {
//   if (err.getHueErrorType() === 1) {
//     throw new ApiError(`Failed to locate user to delete`);
//   } else {
//     console.error(err);
//   }
// }

function processDeleteUser(data) {
  if (utils.wasSuccessful(data)) {
    return true;
  }
  return false;
}

function buildUserPayload(data) {
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
  const result = {
      type: 'application/json',
      body: {}
    }
    , body = result.body
  ;

  if (parameters.linkbutton) {
    body.linkbutton = true;
  }

  // {name: "proxyport", type: "uint16", optional: true},
  // {name: "name", type: "string", minLength: 4, maxLength: 16, optional: true},
  // {name: "swupdate", type: "object", optional: true},
  // {name: "proxyaddress", type: "string", maxLength: 40, optional: true},
  // {name: "linkbutton", type: "boolean", optional: true},
  // {name: "ipaddress", type: "string", optional: true},
  // {name: "netmask", type: "string", optional: true},
  // {name: "gateway", type: "string", optional: true},
  // {name: "dhcp", type: "boolean", optional: true},
  // {name: "portalservices", type: "boolean", optional: true}
  return result;
}

function processConfigurationUpdate(data) {
  return utils.wasSuccessful(data);
}