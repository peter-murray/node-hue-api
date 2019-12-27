'use strict';

const ApiEndpoint = require('./endpoint')
  , ApiError = require('../../../ApiError')
  , util = require('../../../util')
  , GroupIdPlaceholder = require('../../../placeholders/GroupIdPlaceholder')
  , model = require('../../../model')
  , GroupState = require('../../../model/lightstate/GroupState')
;

const GROUP_ID_PLACEHOLDER = new GroupIdPlaceholder();

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
    .placeholder(GROUP_ID_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .postProcess(buildGroup),

  setGroupAttributes: new ApiEndpoint()
    .put()
    .uri('/<username>/groups/<id>')
    .placeholder(GROUP_ID_PLACEHOLDER)
    .acceptJson()
    .payload(buildGroupAttributeBody)
    .pureJson()
    .postProcess(util.wasSuccessful),

  setGroupState: new ApiEndpoint()
    .put()
    .uri('/<username>/groups/<id>/action')
    .placeholder(GROUP_ID_PLACEHOLDER)
    .payload(buildGroupStateBody)
    .pureJson()
    .postProcess(util.wasSuccessful),

  deleteGroup: new ApiEndpoint()
    .delete()
    .uri('/<username>/groups/<id>')
    .placeholder(GROUP_ID_PLACEHOLDER)
    .pureJson()
    .postProcess(validateGroupDeletion),

  setStreaming: new ApiEndpoint()
    .put()
    .uri('/<username>/groups/<id>')
    .placeholder(GROUP_ID_PLACEHOLDER)
    .payload(buildStreamBody)
    .pureJson()
    .postProcess(util.wasSuccessful),
};


function buildGroupsResult(result) {
  const groups = [];

  Object.keys(result).forEach(groupId => {
    const payload = result[groupId]
      , type = payload.type.toLowerCase()
      , group = model.createFromBridge(type, groupId, payload)
    ;

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

  if (!model.isGroupInstance(group)) {
    throw new ApiError('group parameter must be an instance of a Group');
  }

  const result = {
    type: 'application/json',
    body: {
      name: group.name,
      type: group.type,
    }
  };

  if (group.lights) {
    result.body.lights = group.lights;
  } else if (group.type === 'Entertainment') {
    // Entertainment requires a empty array to be passed in if no lights defined.
    result.body.lights = [];
  }

  if (group.class) {
    result.body.class = group.class;
  } else {
    result.body.recycle = group.recycle;
  }

  return result;
}

function buildGroupAttributeBody(parameters) {
  const body = {}
    , group = parameters.group
    ;

  if (!group) {
    throw new ApiError('A group is required to update attributes')
  }

  let payload;
  if (model.isGroupInstance(group)) {
    payload = group.getHuePayload();
  } else {
    payload = group;
  }

  ['name', 'lights', 'class'].forEach(key => {
    if (payload[key]) {
      body[key] = payload[key];
    }
  });

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
  const type = data.type.toLowerCase()
    , id = GROUP_ID_PLACEHOLDER.getValue(requestParameters)
  ;
  return model.createFromBridge(type, id, data);
}


function validateGroupDeletion(result) {
  if (!util.wasSuccessful(result)) {
    throw new ApiError(util.parseErrors(result).join(', '));
  }
  return true;
}