'use strict';

const ApiEndpoint = require('./endpoint')
  , ApiError = require('../../../ApiError')
  , util = require('../util')
  , GroupIdPlaceholder = require('../placeholders/GroupIdPlaceholder')
  , model = require('../../../model')
  , GroupState = require('../../../model/lightstate/GroupState')
;

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
    .postProcess(util.wasSuccessful),

  setGroupState: new ApiEndpoint()
    .put()
    .uri('/<username>/groups/<id>/action')
    .placeholder(new GroupIdPlaceholder())
    .payload(buildGroupStateBody)
    .pureJson()
    .postProcess(util.wasSuccessful),

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
    .postProcess(util.wasSuccessful),
};


function buildGroupsResult(result) {
  const groups = [];

  Object.keys(result).forEach(groupId => {
    const group = model.createFromBridge('group', groupId, result[groupId]);
    groups.push(group);
  });

  return groups;
}

//TODO this is questionable
function buildCreateGroupResult(result) {
  const hueErrors = util.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

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
  const group = parameters.group;

  if (! group) {
    throw new ApiError('A group must be provided');
  }

  const result = {
    type: 'application/json',
    body: {
      name: group.name,
      type: group.type,
    }
  };

  const lights = util.asStringArray(group.lights);
  if (lights) {
    result.body.lights = lights;
  }

  if (group.type === 'Room' || group.type === 'Zone') {
    result.body.class = group.class;
  } else if (group.type === 'LightGroup') {
    result.body.recycle = group.recycle;
  }

  return result;
}

function buildGroupAttributeBody(parameters) {
  const body = {}
    , groupAttributes = parameters ? parameters.groupAttributes : null;

  const group = model.createFromBridge('group', null, groupAttributes)
    , payload = group.getHuePayload()
  ;

  ['name', 'class'].forEach(attr => {
    if (groupAttributes[attr]) {
      body[attr] = payload[attr];
    }
  });

  if (payload.lights) {
    body.lights = util.asStringArray(payload.lights); //TODO array of at least one element and must be an existing light otherwise error 7 returned
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
  };
}


function buildGroup(data, requestParameters) {
  return model.createFromBridge('group', requestParameters.id, data);
}


function validateGroupDeletion(result) {
  if (!util.wasSuccessful(result)) {
    throw new ApiError(util.parseErrors(result).join(', '));
  }
  return true;
}