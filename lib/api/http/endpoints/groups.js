'use strict';

const ApiEndpoint = require('./endpoint')
  , ApiError = require('../../../ApiError')
  , utils = require('../../../../hue-api/utils')
  , GroupIdPlaceholder = require('../placeholders/GroupIdPlaceholder')
  , Group = require('../../../bridge-model/Group')
  , GroupState = require('../../../bridge-model/lightstate/GroupState')
;

// Valid classes for room class in the bridge
const ROOM_CLASSES = [
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
  'Other',
  // The following are valid in 1.30 and higher of the API
  'Home',
  'Downstairs',
  'Upstairs',
  'Top floor',
  'Attic',
  'Guest room',
  'Staircase',
  'Lounge',
  'Man cave',
  'Computer',
  'Studio',
  'Music',
  'TV',
  'Reading',
  'Closet',
  'Storage',
  'Laundry room',
  'Balcony',
  'Porch',
  'Barbecue',
  'Pool',
];

module.exports = {

  getAllGroups: new ApiEndpoint()
    .get()
    .uri('/<username>/groups')
    .acceptJson()
    .pureJson()
    .postProcess(buildGroupsResult),

  createGroup: new ApiEndpoint()
    .post()
    .uri('/<username>/groups')
    .payload(buildGroupBody)
    .acceptJson()
    .pureJson()
    .postProcess(buildCreateGroupResult),

  getGroupAttributes: new ApiEndpoint()
    .get()
    .uri('/<username>/groups/<id>')
    .placeholder(new GroupIdPlaceholder())
    .acceptJson()
    .pureJson()
    .postProcess(buildGroup),

  setGroupAttributes: new ApiEndpoint()
    .put()
    .uri('/<username>/groups/<id>')
    .placeholder(new GroupIdPlaceholder())
    .acceptJson()
    .payload(buildGroupAttributeBody)
    .pureJson()
    .postProcess(utils.wasSuccessful),

  setGroupState: new ApiEndpoint()
    .put()
    .uri('/<username>/groups/<id>/action')
    .placeholder(new GroupIdPlaceholder())
    .payload(buildGroupStateBody)
    .pureJson()
    .postProcess(utils.wasSuccessful),

  deleteGroup: new ApiEndpoint()
    .delete()
    .uri('/<username>/groups/<id>')
    .placeholder(new GroupIdPlaceholder())
    .pureJson()
    .postProcess(validateGroupDeletion),

  setStreaming: new ApiEndpoint()
    .put()
    .uri('/<username>/groups/<id>')
    .placeholder(new GroupIdPlaceholder())
    .payload(buildStreamBody)
    .pureJson()
    .postProcess(utils.wasSuccessful),
};

function buildGroupsResult(result) {
  const groups = [];

  Object.keys(result).forEach(groupId => {
    groups.push(new Group(result[groupId], groupId));
  });

  return groups;
}

//TODO this is questionable
function buildCreateGroupResult(result) {
  const hueErrors = utils.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating group: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: Number(result[0].success.id)};
}

function buildGroupStateBody(data) {
  if (!data || !data.state) {
    throw new ApiError('A GroupState must be provided');
  }

  let state;
  if (data.state instanceof GroupState) {
    state = data.state;
  } else {
    state = new GroupState().populate(data.state);
  }

  return {
    type: 'application/json',
    body: state.getPayload()
  };
}

function buildGroupBody(parameters) {
  const result = {
    type: 'application/json',
    body: {
      name: parameters.name,
      lights: parameters.lights ? asStringArray(parameters.lights): [],
      type: parameters.type,
    }
  };

  if (parameters.type === 'Room' || parameters.type === 'Zone') {
    result.body.class = _validateRoom(parameters.room);
  } else if (parameters.type === 'LightGroup') {
    result.body.recycle = getRecycle(parameters);
  }

  return result;
}

function buildGroupAttributeBody(parameters) {
  const body = {}
    , groupAttributes = parameters ? parameters.groupAttributes : null;

  //TODO may be better suited to a class here
  if (groupAttributes) {
    if (groupAttributes.name) {
      body.name = groupAttributes.name; // TODO string 0..32
    }

    if (groupAttributes.lights) {
      body.lights = asStringArray(groupAttributes.lights); //TODO array of at least one element and must be an existing light otherwise error 7 returned
    }

    if (groupAttributes.class) {
      //TODO test what happens if you do this on something that is not a room
      body.class = _validateRoom(groupAttributes.class);
    }
  }

  return {
    type: 'application/json',
    body: body
  };
}

function buildStreamBody(parameters) {
  const body = {
    stream: {
      active: !!parameters.active
    }
  };

  return {
    type: 'application/json',
    body: body
  }
}

function getRecycle(parameters) {
  if (parameters) {
    if (Object.hasOwnProperty('recycle')) {
      return parameters.recycle;
    }
  }
  return true;
}

function buildGroup(data, requestParameters) {
  if (requestParameters) {
    return new Group(data, requestParameters.id);
  } else {
    return new Group(data);
  }
}

//TODO a utils function
function asStringArray(value) {
  if (Array.isArray(value)) {
    const result = [];

    value.forEach(val => {
      result.push(`${val}`);
    });

    return result;
  } else {
    return [`${value}`];
  }
}

function _validateRoom(room) {
  if (!room) {
    room = 'Other';
  }

  if (ROOM_CLASSES.includes(room)) {
    return room;
  } else {
    throw new ApiError(`${room} is not a valid class.`);
  }
}

function validateGroupDeletion(result) {
  if (!utils.wasSuccessful(result)) {
    throw new ApiError(utils.parseErrors(result).join(', '));
  }
  return true;
}