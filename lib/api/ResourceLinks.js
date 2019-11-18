'use strict';

const resourceLinksApi = require('./http/endpoints/resourcelinks')
  , ResourceLink = require('../model/ResourceLink')
  , ApiDefinition = require('./http/ApiDefinition.js')
;


module.exports = class ResourceLinks extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return this.execute(resourceLinksApi.getAll);
  }

  get(id) {
    return this.execute(resourceLinksApi.getResourceLink, {id: id});
  }

  createResourceLink(resourceLink) {
    const self = this;

    return self.execute(resourceLinksApi.createResourceLink, {resourceLink: resourceLink})
      .then(result => {
        return self.get(result.id);
      });
  }

  deleteResourceLink(id) {
    let resourceLinkId = id;
    if (id instanceof ResourceLink) {
      resourceLinkId = id.id;
    }
    return this.execute(resourceLinksApi.deleteResourceLink, {id: resourceLinkId});
  }

  updateResourceLink(resourceLink) {
    return this.execute(resourceLinksApi.updateResourceLink, {id: resourceLink.id, resourceLink: resourceLink});
  }

  //TODO consider adding getByName()
};