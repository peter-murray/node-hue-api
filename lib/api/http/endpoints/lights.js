'use strict';

const ApiEndpoint = require('./endpoint')
  , LightIdPlaceholder = require('../placeholders/LightIdPlaceholder')
  , LightState = require('../../../bridge-model/lightstate/LightState')
  , ApiError = require('../../../ApiError')
  , utils = require('../../../../hue-api/utils')
  , deviceBuilder = require('../../../bridge-model/devices')
  , rgb = require('../../../rgb')
;

module.exports = {

  getAllLights: new ApiEndpoint()
    .version('1.0')
    .get()
    .uri('/<username>/lights')
    .acceptJson()
    .pureJson()
    .postProcess(buildLightsResult),

  getNewLights: new ApiEndpoint()
    .version('1.0')
    .get()
    .uri('/<username>/lights/new')
    .acceptJson()
    .pureJson(),

  searchForNewLights: new ApiEndpoint()
    .post()
    .uri('/<username>/lights')
    .acceptJson()
    .pureJson()
    .postProcess(utils.wasSuccessful),

  getLightAttributesAndState: new ApiEndpoint()
    .get()
    .uri('/<username>/lights/<id>')
    .placeholder(new LightIdPlaceholder())
    .acceptJson()
    .pureJson()
    .postProcess(injectLightId),

  // rename lights
  setLightAttributes: new ApiEndpoint()
    .put()
    .uri('/<username>/lights/<id>')
    .placeholder(new LightIdPlaceholder())
    .acceptJson()
    .pureJson()
    .payload(buildLightNamePayload)
    .postProcess(utils.wasSuccessful),

  setLightState: new ApiEndpoint()
    .put()
    .uri('/<username>/lights/<id>/state')
    .placeholder(new LightIdPlaceholder())
    .acceptJson()
    .pureJson()
    .payload(buildLightStateBody)
    .postProcess(validateLightStateResult),

  deleteLight: new ApiEndpoint()
    .delete()
    .uri('/<username>/lights/<id>')
    .placeholder(new LightIdPlaceholder())
    .acceptJson()
    .pureJson()
};

function buildLightsResult(result) {
  let lights = [];

  if (result) {
    Object.keys(result).forEach(function (id) {
      lights.push(deviceBuilder.create(result[id], id));
    });
  }

  return lights;
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
  return Object.assign({id: requestParameters.id}, result);
}

function buildLightStateBody(parameters) {
  // let state = lightState.createGroup();
  const payload = getStateForDevice(parameters.device, parameters.state);
  return {type: 'application/json', body: payload};
}

function validateLightStateResult(result) {
  if (!utils.wasSuccessful(result)) {
    throw new ApiError(utils.parseErrors(result).join(', '));
  }
  return true;
}

function getStateForDevice(device, desiredState) {
  if (!device) {
    throw new ApiError('No light device provided');
  }

  const allowedStates = device.getSupportedStates()
    , state = {}
  ;

  let desiredStatePayload;

  if (desiredState instanceof LightState) {
    desiredStatePayload = desiredState.getPayload();
  } else {
    const lightState = new LightState();
    lightState.populate(desiredState);
    desiredStatePayload = lightState.getPayload();
  }

  // Only allow the setting of parameters that the light supports in its state (e.g. do not set a color on a white light
  // Check for RGB and perform conversion (and remove any other settings)
  if (desiredStatePayload.rgb) {
    const colorGamut = device.colorGamut;
    if (!colorGamut) {
      throw new ApiError('Cannot set an RGB color on a light that does not support a Color Gamut');
    }
    state.xy = rgb.rgbToXY(desiredStatePayload.rgb, colorGamut);
    //TODO there is ordering here, in that xy wins if present, but we should remove the others if set (ct, hs) to reduce loading on bridge
    delete desiredStatePayload.rgb;
  }

  Object.keys(desiredStatePayload).forEach(desiredStateKey => {
    if (allowedStates.indexOf(desiredStateKey) > -1) {
      state[desiredStateKey] = desiredStatePayload[desiredStateKey];
    } else {
      //TODO Switch to throwing errors when this occurs
      console.error(`Attempting to set a state ${desiredStateKey} on a light that does not support it, ${device.id}`);
    }
  });

  return state;
}