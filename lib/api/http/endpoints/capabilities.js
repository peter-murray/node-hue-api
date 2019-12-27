'use strict';

const ApiEndpoint = require('./endpoint')
  , model = require('../../../model')
;

function getAllCapabilities() {
  return new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/capabilities')
    .pureJson()
    .postProcess(buildCapabilities)
    ;
}

module.exports = {
  getAll: getAllCapabilities()
};

function buildCapabilities(data, requestParameters) {
  // const id = requestParameters.baseUrl || null;
  return model.createFromBridge('capabilities', null, data);
}