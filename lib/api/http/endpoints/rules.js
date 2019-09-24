'use strict';

const ApiEndpoint = require('./endpoint')
  , RuleIdPlaceholder = require('../placeholders/RuleIdPlaceholder')
  , Rule = require('../../../bridge-model/rules/Rule')
  , ApiError = require('../../../ApiError')
  , utils = require('../../../../hue-api/utils')
;

module.exports = {

  getAll: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/rules')
    .pureJson()
    .postProcess(buildRuleResults),

  getRule: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('<username>/rules/<id>')
    .placeholder(new RuleIdPlaceholder())
    .pureJson()
    .postProcess(buildRuleResult),

  createRule: new ApiEndpoint()
    .post()
    .acceptJson()
    .uri('/<username>/rules')
    .pureJson()
    .payload(buildRulePayload)
    .postProcess(buildCreateRuleResult),

  // updateRule: new ApiEndpoint()
  //   .put()
  //   .acceptJson()
  //   .uri('/<username>/rules/<id>')
  //   .placeholder(new RuleIdPlaceholder())
  //   .pureJson()
  //   .payload(buildRuleUpdatePayload)
  //   .postProcess(extractUpdatedAttributes),
  //
  deleteRule: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/rules/<id>')
    .placeholder(new RuleIdPlaceholder())
    .pureJson()
    .postProcess(validateRuleDeletion),
};



function buildRuleResults(result) {
  let scenes = [];

  Object.keys(result).forEach(function (id) {
    scenes.push(new Rule(result[id], id));
  });

  return scenes;
}

function buildRuleResult(data, requestParameters) {
  if (requestParameters) {
    return new Rule(data, requestParameters.id);
  } else {
    return new Rule(data);
  }
}

function validateRuleDeletion(result) {
  if (!utils.wasSuccessful(result)) {
    throw new ApiError(utils.parseErrors(result).join(', '));
  }
  return true;
}

function buildRulePayload(parameters) {
  const rule = parameters.rule;

  if (!rule) {
    throw new ApiError('No rule provided');
  } else if (!(rule instanceof Rule)) {
    throw new ApiError('Must provide a valid Rule object');
  }

  const body = rule.payload;
  // Recycle is a required parameter when creating a new rule
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

// //TODO
// function buildUpdateSceneLightStatePayload(parameters) {
//   const lightState = parameters.lightState;
//
//   if (!lightState) {
//     throw new ApiError('No SceneLightState provided');
//   } else if (!(lightState instanceof SceneLightState)) {
//     throw new ApiError('Must provide a valid SceneLightState object');
//   }
//
//   //TODO need to validate this object to protect ourselves here
//   const body = lightState.getPayload();
//
//   return {
//     type: 'application/json',
//     body: body
//   };
// }
//
// function buildBasicSceneUpdatePayload(parameters) {
//   const scene = parameters.scene;
//
//   if (!scene) {
//     throw new ApiError('No scene provided');
//   } else if (!(scene instanceof Scene)) {
//     throw new ApiError('Must provide a valid Scene object');
//   }
//
//   const body = scene.payload;
//
//   // It is not possible to modify the type, so remove it if present
//   delete body.type;
//
//   return {
//     type: 'application/json',
//     body: body
//   };
// }

function buildCreateRuleResult(result) {
  console.log(JSON.stringify(result, null, 2)); //TODO remove this
  const hueErrors = utils.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating rule: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: result[0].success.id};
}

// function extractUpdatedAttributes(result) {
//   if (utils.wasSuccessful(result)) {
//     const values = {};
//     result.forEach(update => {
//       const success = update.success;
//       Object.keys(success).forEach(key => {
//         const attribute = /.*\/(.*)$/.exec(key)[1];
//         values[attribute] = true; //success[key];
//       });
//     });
//     return values;
//   } else {
//     throw new ApiError('Error in response'); //TODO extract the error
//   }
// }