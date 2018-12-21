'use strict';

const ApiEndpoint = require('./endpoint')
    , deepExtend = require('deep-extend')
    , lightIdPlaceholder = require('../placeholders/lightIdPlaceholder')
    , lightState = require('../lightState')
    , ApiError = require('../../hue-api/errors').ApiError
    , utils = require('../../hue-api/utils')
;

module.exports = {

  getAllLights: new ApiEndpoint()
      .version('1.0')
      .get()
      .uri('/api/<username>/lights')
      .acceptJson()
      .pureJson()
      .postProcess(buildLightsResult),

  getNewLights: new ApiEndpoint()
      .version('1.0')
      .get()
      .uri('/api/<username>/lights/new')
      .acceptJson()
      .pureJson(),

  searchForNewLights: new ApiEndpoint()
      .post()
      .uri('/api/<username>/lights')
      .acceptJson()
      .postProcess(utils.wasSuccessful),

  getLightAttributesAndState: new ApiEndpoint()
      .get()
      .uri('/api/<username>/lights/<id>')
      .placeholder('id', lightIdPlaceholder)
      .acceptJson()
      .pureJson()
      .postProcess(injectLightId),

  // rename lights
  setLightAttributes: new ApiEndpoint()
      .put()
      .uri('/api/<username>/lights/<id>')
      .placeholder('id', lightIdPlaceholder)
      .acceptJson()
      .pureJson()
      .payload(buildLightNamePayload)
      .postProcess(utils.wasSuccessful),

  setLightState: new ApiEndpoint()
      .put()
      .uri('/api/<username>/lights/<id>/state')
      .placeholder('id', lightIdPlaceholder)
      .acceptJson()
      .pureJson()
      .payload(buildLightStateBody)
      .postProcess(validateLightStateResult),

  deleteLight: new ApiEndpoint()
      .delete()
      .uri('/api/<username>/lights/<id>')
      .placeholder('id', lightIdPlaceholder)
      .acceptJson()
      .pureJson()
};

function buildLightsResult(result) {
  let lights = [];

  if (result) {
    Object.keys(result).forEach(function(id) {
      lights.push(deepExtend({id: id}, result[id]));
    });
  }

  return {'lights': lights};
}

function buildLightNamePayload(parameters) {
  const nameMaxLength = 32
      , result = {type: 'application/json'}
      , name = parameters['name']
  ;

  if (name && name.length > 0) {
    result.body = {name: name};

    if (name.length > nameMaxLength) {
      throw new ApiError('Light name is too long');
    }
  }

  return result;
}

function injectLightId(result, requestParameters) {
  return deepExtend({id: requestParameters.id}, result);
}

function buildLightStateBody(data) {
  let values = lightState().withAlert().values;

  //TODO
}

function validateLightStateResult(result) {
  if (!utils.wasSuccessful(result)) {
    throw new ApiError(utils.parseErrors(result).join(', '));
  }
  return true;
}