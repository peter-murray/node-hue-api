'use strict';

const ApiEndpoint = require('./endpoint')
  , ResourceLinkPlaceholder = require('../../../placeholders/ResourceLinkPlaceholder')
  , model = require('../../../model')
  , ApiError = require('../../../ApiError')
  , util = require('../../../util')
;

const RESOURCELINK_PLACEHOLDER = new ResourceLinkPlaceholder();

module.exports = {

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
    .postProcess(util.extractUpdatedAttributes),

  deleteResourceLink: new ApiEndpoint()
    .delete()
    .uri('/<username>/resourcelinks/<id>')
    .placeholder(RESOURCELINK_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .postProcess(util.wasSuccessful)
};


function buildResourceLinkResults(data) {
  const resourceLinks = [];

  if (data) {
    Object.keys(data).forEach(id => {
      resourceLinks.push(model.createFromBridge('resourcelink', id, data[id]));
    });
  }

  return resourceLinks;
}

function buildResourceLink(data, requestParameters) {
  if (data) {
    const id = RESOURCELINK_PLACEHOLDER.getValue(requestParameters);
    return model.createFromBridge('resourcelink', id, data);
  }
  return null;
}

function buildCreateResourceLinkResult(result) {
  const hueErrors = util.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating resourcelink: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: Number(result[0].success.id)};
}

function buildResourceLinkUpdatePayload(parameters) {
  const resourceLink = parameters.resourceLink;

  if (!resourceLink) {
    throw new ApiError('No ResourceLink provided');
  } else if (!model.isResourceLinkInstance(resourceLink)) {
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

function createResourceLinkPayload(parameters) {
  const resourceLink = parameters.resourceLink;

  if (!resourceLink) {
    throw new ApiError('No ResourceLink provided');
  } else if (!model.isResourceLinkInstance(resourceLink)) {
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

function buildResourceLinkBody(resourceLink) {
  const data = resourceLink.getHuePayload();

  // Cannot have an ID in the create payload
  delete data.id;

  return data;
}