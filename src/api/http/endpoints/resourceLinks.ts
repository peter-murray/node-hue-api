import { model } from '@peter-murray/hue-bridge-model';
import { extractUpdatedAttributes, parseErrors, wasSuccessful } from '../../../util';
import { ResourceLinkPlaceholder } from '../../placeholders/ResourceLinkPlaceholder';
import { ApiBodyPayload, ApiEndpoint } from './ApiEndpoint';
import { ApiError } from '../../../ApiError';
import { KeyValueType } from '../../../commonTypes';


const instanceChecks = model.instanceChecks;

const RESOURCELINK_PLACEHOLDER = new ResourceLinkPlaceholder();

type ResourceLinkId = {id: number};

const resourceLinksApi = {

  getAll: new ApiEndpoint()
    .get()
    .uri('/<username>/resourcelinks')
    .acceptJson()
    .pureJson()
    .postProcess(buildResourceLinkResults),

  getResourceLink: new ApiEndpoint()
    .get()
    .uri('/<username>/resourcelinks/<id>')
    .placeholder(RESOURCELINK_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .postProcess(buildResourceLink),

  createResourceLink: new ApiEndpoint()
    .post()
    .uri('/<username>/resourcelinks')
    .payload(createResourceLinkPayload)
    .acceptJson()
    .pureJson()
    .postProcess(buildCreateResourceLinkResult),

  updateResourceLink: new ApiEndpoint()
    .put()
    .uri('/<username>/resourcelinks/<id>')
    .placeholder(RESOURCELINK_PLACEHOLDER)
    .payload(buildResourceLinkUpdatePayload)
    .acceptJson()
    .pureJson()
    .postProcess(extractUpdatedAttributes),

  deleteResourceLink: new ApiEndpoint()
    .delete()
    .uri('/<username>/resourcelinks/<id>')
    .placeholder(RESOURCELINK_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .postProcess(wasSuccessful)
};

export {resourceLinksApi};

function buildResourceLinkResults(data: KeyValueType) {
  const resourceLinks: model.ResourceLink[] = [];

  if (data) {
    Object.keys(data).forEach(id => {
      resourceLinks.push(model.createFromBridge('resourcelink', id, data[id]));
    });
  }

  return resourceLinks;
}

function buildResourceLink(data: object, requestParameters: any) {
  if (data) {
    const id = RESOURCELINK_PLACEHOLDER.getValue(requestParameters);
    return model.createFromBridge('resourcelink', id, data);
  }
  return null;
}

function buildCreateResourceLinkResult(result: any): ResourceLinkId {
  const hueErrors = parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating resourcelink: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: Number(result[0].success.id)};
}

function buildResourceLinkUpdatePayload(parameters: KeyValueType) {
  const resourceLink = parameters.resourceLink;

  if (!resourceLink) {
    throw new ApiError('No ResourceLink provided');
  } else if (!instanceChecks.isResourceLinkInstance(resourceLink)) {
    throw new ApiError('Must provide a valid ResourceLink object');
  }

  const body = buildResourceLinkBody(resourceLink);
  // Cannot change the owner, type or recycle values
  delete body.type;
  delete body.recycle;
  delete body.owner;

  return {
    type: 'application/json',
    body: body
  };
}

function createResourceLinkPayload(parameters: KeyValueType): ApiBodyPayload {
  const resourceLink = parameters.resourceLink;

  if (!resourceLink) {
    throw new ApiError('No ResourceLink provided');
  } else if (!instanceChecks.isResourceLinkInstance(resourceLink)) {
    throw new ApiError('Must provide a valid ResourceLink object');
  }

  const body = buildResourceLinkBody(resourceLink);
  if (!body.links || body.links.length === 0) {
    throw new ApiError('You must provide a ResourceLink with some links defined');
  }

  return {
    type: 'application/json',
    body: body
  };
}

function buildResourceLinkBody(resourceLink: model.ResourceLink): KeyValueType {
  const data: KeyValueType = resourceLink.getHuePayload();

  // Cannot have an ID in the create payload
  delete data.id;

  return data;
}