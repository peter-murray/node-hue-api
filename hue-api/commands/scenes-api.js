"use strict";

//
// The Documented Phillips Hue Bridge API for scenes http://www.developers.meethue.com/documentation/scenes-api
//
// This module wraps up all the functionality for the definition and basic processing of the parameters for the API
// so that it can be called from the httpPromise module.
//
// The benefits of keeping all this code here is that it is much simpler to update the keep in step with the Phillips
// Hue API documentation, than having it scatter piece meal through various other classes and functions.
//

var Trait = require("traits").Trait
  , tApiMethod = require("./traits/tApiMethod")
  , tDescription = require("./traits/tDescription")
  , tPostProcessing = require("./traits/tPostProcessing")
  , tLightStateBody = require("./traits/tLightStateBody")
  , tBodyArguments = require("./traits/tBodyArguments")
  , ApiError = require("../errors").ApiError
  , utils = require("../utils")
  , apiTraits = {}
  ;

function processSceneResult(result) {
  var response = {}
    ;

  if (!utils.wasSuccessful(result)) {
    throw new ApiError(utils.parseErrors(result).join(", "));
  }

  function processResultObject(resultEntry) {
    var obj = resultEntry.success
      , idMatch = null
      ;

    Object.keys(obj).forEach(function (key) {
      var id = key.substr(key.lastIndexOf("/") + 1);
      response[id] = obj[key];

      if (!idMatch) {
        idMatch = /scenes\/(.*)\//.exec(key);
      }
    });

    if (!response.id && idMatch) {
      response.id = idMatch[1];
    }
  }

  if (Array.isArray(result)) {
    result.forEach(processResultObject);
  } else {
    processResultObject(result);
  }

  return response;
}

function validateUpdateResults(result) {
  var returnValue = {};

  if (!utils.wasSuccessful(result)) {
    throw new ApiError(utils.parseErrors(result).join(", "));
  }

  result.forEach(function (value) {
    Object.keys(value.success).forEach(function (keyValue) {
      var data = keyValue.substr(keyValue.lastIndexOf("/") + 1, keyValue.length);
      returnValue[data] = true;
    });
  });
  return returnValue;
}

apiTraits.getAllScenes = Trait.compose(
  tApiMethod(
    "/api/<username>/scenes",
    "GET",
    "1.1",
    "Whitelist"
  ),
  tDescription("Gets a list of all scenes currently stored in the bridge. Scenes are represented by a scene id, a name and a list of lights which are part of the scene.")
);

apiTraits.createScene = Trait.compose(
  tApiMethod(
    "/api/<username>/scenes",
    "POST",
    "1.11",
    "Whitelist"
  ),
  tDescription("Creates the given scene with all lights in the provided lights resource. For a given scene the current light settings of the given lights resources are stored. If the scene id is recalled in the future, these light settings will be reproduced on these lamps. If an existing name is used then the settings for this scene will be overwritten and the light states resaved."),
  tBodyArguments(
    "application/json",
    [
      {name: "name", type: "string", optional: true},
      {name: "lights", type: "list int", optional: false},
      {name: "transitiontime", type: "int", optional: true},
      {name: "recycle", type: "boolean", optional: true},
      {name: "appdata", type: "object", optional: true},
      {name: "picture", type: "hex", optional: true}
    ]
  ),
  tPostProcessing(processSceneResult)
);

apiTraits.getScene = Trait.compose(
  tApiMethod(
    "/api/<username>/scenes/<id>",
    "GET",
    "1.11",
    "Whitelist"
  ),
  tDescription("Gets the attributes of a given scene. Note that lightstates are displayed when an individual scene is retrieved (but not for all scenes).")
);

apiTraits.deleteScene = Trait.compose(
  tApiMethod(
    "/api/<username>/scenes/<id>",
    "DELETE",
    "1.11",
    "Whitelist"
  ),
  tDescription("Deletes a scene from the bridge. In bridge versions earlier than 1.11 scenes cannot be deleted from the bridge.")
);

apiTraits.modifyLightState = Trait.compose(
  tApiMethod(
    "/api/<username>/scenes/<id>/lightstates/<lightId>",
    "PUT",
    "1.11",
    "Whitelist"
  ),
  tDescription("Modifies or creates a new scene. Note that these states are not visible via any API calls, but stored in the lights themselves."),
  tLightStateBody(),
  tPostProcessing(validateUpdateResults)
);

//TODO this is deprecated in 1.11.x
apiTraits.oldModifyLightState = Trait.compose(
  tApiMethod(
    "/api/<username>/scenes/<id>/lights/<lightId>/state",
    "PUT",
    "1.1.1",
    "Whitelist"
  ),
  tDescription("Modifies or creates a new scene. Note that these states are not visible via any API calls, but stored in the lights themselves."),
  tLightStateBody(),
  tPostProcessing(validateUpdateResults)
);

apiTraits.modifyScene = Trait.compose(
  tApiMethod(
    "/api/<username>/scenes/<id>",
    "PUT",
    "1.1.0",
    "Whitelist"
  ),
  tDescription("Modifies or creates a new scene. Note that these states are not visible via any API calls, but stored in the lights themselves."),
  tBodyArguments(
    "application/json",
    [
      {name: "name", type: "string", optional: true},
      {name: "lights", type: "list int", optional: true},
      {name: "storelightstate", type: "boolean", optional: true}
    ]
  ),
  tPostProcessing(validateUpdateResults)
);

module.exports = {
  getAllScenes: Trait.create(Object.prototype, apiTraits.getAllScenes),
  createScene: Trait.create(Object.prototype, apiTraits.createScene),
  modifyLightState: Trait.create(Object.prototype, apiTraits.modifyLightState),
  modifyScene: Trait.create(Object.prototype, apiTraits.modifyScene),
  getScene: Trait.create(Object.prototype, apiTraits.getScene),
  deleteScene: Trait.create(Object.prototype, apiTraits.deleteScene)
};