'use strict';

const ApiEndpoint = require('./endpoint')
  , SceneIdPlaceholder = require('../placeholders/SceneIdPlaceholder')
  , LightIdPlacehoder = require('../placeholders/LightIdPlaceholder')
  , Scene = require('../../../bridge-model/Scene')
  , SceneLightState = require('../../../bridge-model/lightstate/SceneLightState')
  , ApiError = require('../../../ApiError')
  , utils = require('../../../../hue-api/utils')
;

module.exports = {

  getAll: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/scenes')
    .pureJson()
    .postProcess(buildScenesResult),

  createScene: new ApiEndpoint()
    .post()
    .acceptJson()
    .uri('/<username>/scenes')
    .pureJson()
    .payload(buildScenePayload)
    .postProcess(buildCreateSceneResult),

  updateScene: new ApiEndpoint()
    .put()
    .acceptJson()
    .uri('/<username>/scenes/<id>')
    .placeholder(new SceneIdPlaceholder())
    .pureJson()
    .payload(buildBasicSceneUpdatePayload)
    .postProcess(extractUpdatedAttributes),

  updateSceneLightState: new ApiEndpoint()
    .put()
    .acceptJson()
    .uri('/<username>/scenes/<id>/lightstates/<lightStateId>')
    .placeholder(new SceneIdPlaceholder())
    .placeholder(new LightIdPlacehoder('lightStateId'))
    .pureJson()
    .payload(buildUpdateSceneLightStatePayload)
    .postProcess(extractUpdatedAttributes),

  getScene: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/scenes/<id>')
    .placeholder(new SceneIdPlaceholder())
    .pureJson()
    .postProcess(buildSceneResult),

  deleteScene: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/scenes/<id>')
    .placeholder(new SceneIdPlaceholder())
    .pureJson()
    .postProcess(validateSceneDeletion),
};


function buildScenesResult(result) {
  let scenes = [];

  Object.keys(result).forEach(function (id) {
    scenes.push(new Scene(result[id], id));
  });

  return scenes;
}

function buildSceneResult(data, requestParameters) {
  if (requestParameters) {
    return new Scene(data, requestParameters.id);
  } else {
    return new Scene(data);
  }
}

function validateSceneDeletion(result) {
  if (!utils.wasSuccessful(result)) {
    throw new ApiError(utils.parseErrors(result).join(', '));
  }
  return true;
}

function buildScenePayload(parameters) {
  const scene = parameters.scene;

  if (!scene) {
    throw new ApiError('No scene provided');
  } else if (!(scene instanceof Scene)) {
    throw new ApiError('Must provide a valid Scene object');
  }

  const body = scene.payload;
  // Recycle is a required parameter when creating a new scene
  if (!body.recycle) {
    body.recycle = false;
  }

  // Prevent the create from overwriting an existing scene by removing the id value
  delete body.id;

  return {
    type: 'application/json',
    body: body
  };
}

//TODO
function buildUpdateSceneLightStatePayload(parameters) {
  const lightState = parameters.lightState;

  if (!lightState) {
    throw new ApiError('No SceneLightState provided');
  } else if (!(lightState instanceof SceneLightState)) {
    throw new ApiError('Must provide a valid SceneLightState object');
  }

  //TODO need to validate this object to protect ourselves here
  const body = lightState.getPayload();

  return {
    type: 'application/json',
    body: body
  };
}

function buildBasicSceneUpdatePayload(parameters) {
  const scene = parameters.scene;

  if (!scene) {
    throw new ApiError('No scene provided');
  } else if (!(scene instanceof Scene)) {
    throw new ApiError('Must provide a valid Scene object');
  }

  const body = scene.payload;

  // It is not possible to modify the type, so remove it if present
  delete body.type;

  return {
    type: 'application/json',
    body: body
  };
}

function buildCreateSceneResult(result) {
  const hueErrors = utils.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating scene: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: result[0].success.id};
}

function extractUpdatedAttributes(result) {
  if (utils.wasSuccessful(result)) {
    const values = {}
    result.forEach(update => {
      const success = update.success;
      Object.keys(success).forEach(key => {
        const attribute = /.*\/(.*)$/.exec(key)[1];
        values[attribute] = true; //success[key];
      });
    });
    return values;
  } else {
    throw new ApiError('Error in response'); //TODO extract the error
  }
}