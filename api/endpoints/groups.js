'use strict';

const ApiEndpoint = require('./endpoint')
    , deepExtend = require('deep-extend')
    , ApiError = require('../../hue-api/errors').ApiError
    , utils = require('../../hue-api/utils')
;

// Valid classes for room class in the bridge
const CLAZZES = [
  'Living room',
  'Kitchen',
  'Dining',
  'Bedroom',
  'Kids bedroom',
  'Bathroom',
  'Nursery',
  'Recreation',
  'Office',
  'Gym',
  'Hallway',
  'Toilet',
  'Front door',
  'Garage',
  'Terrace',
  'Garden',
  'Driveway',
  'Carport',
  'Other'
];

module.exports = {

  getAllGroups: new ApiEndpoint()
      .get()
      .uri('/api/<username>/groups')
      .acceptJson()
      .pureJson()
      .postProcess(buildGroupsResult),

  createGroup: new ApiEndpoint()
      .post()
      .uri('/api/<username>/groups')
      .payload(buildGroupPayload)
      .acceptJson()
      .pureJson()
      .postProcess(buildCreateGroupResult),

  createRoom: new ApiEndpoint()
      .post()
      .uri('/api/<username>/groups')
      .payload(buildRoomPayload)
      .acceptJson()
      .pureJson()
      .postProcess(buildCreateGroupResult),

  getGroupAttributes: new ApiEndpoint()
      .get()
      .uri('/api/<username>/groups/<id>')
      .acceptJson()
      .pureJson()
      .postProcess(injectGroupId),

};

function injectGroupId(result, requestParameters) {
  return deepExtend({id: requestParameters.id}, result);
}

function buildGroupsResult(result) {
  let value = {'0': {name: 'All Lights'}};

  return deepExtend(value, result);
}

function buildCreateGroupResult(result) {
  if (utils.wasSuccessful(result)) {
    return {id: result[0].success.id};
  } else {
    throw new ApiError(utils.parseErrors(result).join(', '));
  }
}

function buildRoomPayload(parameters) {
  const result = {type: 'application/json'}
      , name = parameters['name']
      , lights = parameters['lights'] //TODO needs to be an array
      , clazz = paramters['class']
  ;

  //TODO need validation around the name length and lights being array
  result.body = {
    name: name,
    lights: lights,
    class: _validateRoom(clazz),
    type: 'Room'
  };

  return result;
}

function buildGroupPayload(parameters) {
  const result = {type: 'application/json'}
      , name = parameters['name']
      , lights = parameters['lights'] //TODO needs to be an array
  ;

  //TODO need validation around the name length and lights being array
  result.body = {
    name: name,
    lights: lights,
    type: 'LightGroup'
  };

  return result;
}

function _validateRoom(room) {
  if (CLAZZES.includes(room)) {
    return room;
  } else {
    throw new ApiError(`${room} is not a valid class.`);
  }
}