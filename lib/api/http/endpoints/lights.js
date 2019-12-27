'use strict';

const ApiEndpoint = require('./endpoint')
  , LightIdPlaceholder = require('../../../placeholders/LightIdPlaceholder')
  , LightState = require('../../../model/lightstate/LightState')
  , ApiError = require('../../../ApiError')
  , util = require('../../../util')
  , model = require('../../../model')
  , rgb = require('../../../rgb')
;

const LIGHT_ID_PLACEHOLDER = new LightIdPlaceholder();

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
    .postProcess(util.wasSuccessful),

  getLightAttributesAndState: new ApiEndpoint()
    .get()
    .uri('/<username>/lights/<id>')
    .placeholder(LIGHT_ID_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .postProcess(injectLightId),

  // rename lights
  setLightAttributes: new ApiEndpoint()
    .put()
    .uri('/<username>/lights/<id>')
    .placeholder(LIGHT_ID_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .payload(buildLightNamePayload)
    .postProcess(util.wasSuccessful),

  setLightState: new ApiEndpoint()
    .put()
    .uri('/<username>/lights/<id>/state')
    .placeholder(LIGHT_ID_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .payload(buildLightStateBody)
    .postProcess(validateLightStateResult),

  deleteLight: new ApiEndpoint()
    .delete()
    .uri('/<username>/lights/<id>')
    .placeholder(LIGHT_ID_PLACEHOLDER)
    .acceptJson()
    .pureJson()
};

function buildLightsResult(result) {
  let lights = [];

  if (result) {
    Object.keys(result).forEach(function (id) {
      const light = model.createFromBridge('light', id, result[id]);
      lights.push(light);
    });
  }

  return lights;
}

function buildLightNamePayload(parameters) {
  // To support deprecation in the API where we take (id, name) and now just a (light) payload, cater for it here and
  // remove once lights.rename(id, name) is removed from API

  let light = null;
  if (parameters.light) {
    light = parameters.light;
  } else {
    // Set the name on a Light instance so that it can be validated using parameter constraints there
    light = model.createFromBridge('light', 0, {name: parameters.name});
  }

  return {
    type: 'application/json',
    body: {name: light.name},
  };
}

function injectLightId(result, requestParameters) {
  const id = LIGHT_ID_PLACEHOLDER.getValue(requestParameters);
  return Object.assign({id: id}, result);
}

function buildLightStateBody(parameters) {
  const payload = getStateForDevice(parameters.device, parameters.state);
  return {type: 'application/json', body: payload};
}

function validateLightStateResult(result) {
  if (!util.wasSuccessful(result)) {
    throw new ApiError(util.parseErrors(result).join(', '));
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