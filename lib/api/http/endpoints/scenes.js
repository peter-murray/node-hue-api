'use strict';

const ApiEndpoint = require('./endpoint')
  , SceneIdPlaceholder = require('../../../placeholders/SceneIdPlaceholder')
  , LightIdPlacehoder = require('../../../placeholders/LightIdPlaceholder')
  , model = require('../../../model')
  , SceneLightState = require('../../../model/lightstate/SceneLightState')
  , ApiError = require('../../../ApiError')
  , util = require('../../../util')
;

const SCENE_ID_PLACEHOLDER = new SceneIdPlaceholder();

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
    .payload(getCreateScenePayload)
    .postProcess(buildCreateSceneResult),

  updateScene: new ApiEndpoint()
    .put()
    .acceptJson()
    .uri('/<username>/scenes/<id>')
    .placeholder(new SceneIdPlaceholder())
    .pureJson()
    .payload(buildBasicSceneUpdatePayload)
    .postProcess(util.extractUpdatedAttributes),

  updateSceneLightState: new ApiEndpoint()
    .put()
    .acceptJson()
    .uri('/<username>/scenes/<id>/lightstates/<lightStateId>')
    .placeholder(SCENE_ID_PLACEHOLDER)
    .placeholder(new LightIdPlacehoder('lightStateId'))
    .pureJson()
    .payload(buildUpdateSceneLightStatePayload)
    .postProcess(util.extractUpdatedAttributes),

  getScene: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/scenes/<id>')
    .placeholder(SCENE_ID_PLACEHOLDER)
    .pureJson()
    .postProcess(buildSceneResult),

  deleteScene: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/scenes/<id>')
    .placeholder(SCENE_ID_PLACEHOLDER)
    .pureJson()
    .postProcess(validateSceneDeletion),
};


function buildScenesResult(result) {
  let scenes = [];

  Object.keys(result).forEach(function (id) {
    const data = result[id]
      , type = data.type.toLowerCase()
    ;

    const scene = model.createFromBridge(type, id, data);
    scenes.push(scene);
  });

  return scenes;
}

function buildSceneResult(data, requestParameters) {
  const type = data.type.toLowerCase()
    , id = SCENE_ID_PLACEHOLDER.getValue(requestParameters)
  ;
  return model.createFromBridge(type, id, data);
}

function validateSceneDeletion(result) {
  if (!util.wasSuccessful(result)) {
    throw new ApiError(util.parseErrors(result).join(', '));
  }
  return true;
}

function getCreateScenePayload(parameters) {
  const scene = parameters.scene;

  if (!scene) {
    throw new ApiError('No scene provided');
  } else if (!model.isSceneInstance(scene)) {
    throw new ApiError('Must provide a valid Scene object');
  }

  const body = scene.getHuePayload();
  // Remove properties that are not used is creation
  delete body.id;
  delete body.locked;
  delete body.owner;
  delete body.lastupdated;
  delete body.version;

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
  } else if (!model.isSceneInstance(scene)) {
    throw new ApiError('Must provide a valid Scene object');
  }

  const scenePayload = scene.getHuePayload()
    , body = {}
  ;

  // Extract the properties that we are allowed to update as per the API docs
  ['name', 'lights', 'lightstates', 'storelightstate'].forEach(key => {
    const value = scenePayload[key];

    if (value !== null) {
      body[key] = value;
    }
  });

  return {
    type: 'application/json',
    body: body
  };
}

function buildCreateSceneResult(result) {
  const hueErrors = util.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating scene: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: result[0].success.id};
}