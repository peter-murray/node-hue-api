import { model } from '@peter-murray/hue-bridge-model';
import { ApiBodyPayload, ApiEndpoint } from './ApiEndpoint';
import { GroupIdPlaceholder } from '../../placeholders/GroupIdPlaceholder';
import { ApiError } from '../../../ApiError';

import { parseErrors, wasSuccessful } from '../../../util';
import { KeyValueType } from '../../../commonTypes';

const GroupState = model.GroupState
  , instanceChecks = model.instanceChecks
;

const GROUP_ID_PLACEHOLDER = new GroupIdPlaceholder();

const groupsApi = {

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
    .postProcess(wasSuccessful),

  setGroupState: new ApiEndpoint()
    .put()
    .uri('/<username>/groups/<id>/action')
    .placeholder(GROUP_ID_PLACEHOLDER)
    .payload(buildGroupStateBody)
    .pureJson()
    .postProcess(wasSuccessful),

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
    .postProcess(wasSuccessful),
};
export { groupsApi };

function buildGroupsResult(result: any): model.Group[] {
  const groups: model.Group[] = [];

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
function buildCreateGroupResult(result: any): { id: number } {
  const hueErrors = parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating group: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: Number(result[0].success.id)};
}

function buildGroupStateBody(data: any): ApiBodyPayload {
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

function buildGroupBody(parameters: KeyValueType): ApiBodyPayload {
  const group = parameters.group;

  if (!group) {
    throw new ApiError('A group must be provided');
  }

  if (!instanceChecks.isGroupInstance(group)) {
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
    // @ts-ignore
    result.body.lights = group.lights;
  } else if (group.type === 'Entertainment') {
    // Entertainment requires a empty array to be passed in if no lights defined.
    // @ts-ignore
    result.body.lights = [];
  }

  if (group.class) {
    // @ts-ignore
    result.body.class = group.class;
  } else {
    // @ts-ignore
    result.body.recycle = group.recycle;
  }

  return result;
}

function buildGroupAttributeBody(parameters: any): ApiBodyPayload {
  const body: KeyValueType = {}
    , group = parameters.group
  ;

  if (!group) {
    throw new ApiError('A group is required to update attributes');
  }

  //TODO if you have an entertainment group and are updating the lights, they must be capabilities.streaming.renderer = true

  let payload: KeyValueType;
  if (instanceChecks.isGroupInstance(group)) {
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

function buildStreamBody(parameters: any): ApiBodyPayload {
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


function buildGroup(data: any, requestParameters: any): model.Group {
  const type = data.type.toLowerCase()
    , id = GROUP_ID_PLACEHOLDER.getValue(requestParameters)
  ;
  return model.createFromBridge(type, id, data);
}


function validateGroupDeletion(result: any): boolean {
  if (!wasSuccessful(result)) {
    const parsed = parseErrors(result);
    throw new ApiError(parsed? parsed.join(', ') : `Unexpected response for deletion: ${JSON.stringify(result)}`);
  }
  return true;
}