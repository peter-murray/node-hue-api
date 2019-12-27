'use strict';

const resourceLinksApi = require('./http/endpoints/resourcelinks')
  , ResourceLink = require('../model/ResourceLink')
  , ApiDefinition = require('./http/ApiDefinition.js')
;

/**
 * @type {ResourceLinks}
 */
module.exports = class ResourceLinks extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  /**
   * @returns {Promise<ResourceLink[]>}
   */
  getAll() {
    return this.execute(resourceLinksApi.getAll);
  }

  /**
   * @param id {string | ResourceLink} The resource link id or resource link to retrieve from the bridge.
   * @returns {Promise<ResourceLink>}
   */
  getResourceLink(id) {
    return this.execute(resourceLinksApi.getResourceLink, {id: id});
  }

  /**
   * @param name {string}
   * @returns {Promise<ResourceLink[]>}
   */
  getResourceLinkByName(name) {
    return this.getAll()
      .then(resourceLinks => {
        return resourceLinks.filter(resourceLink => resourceLink.name === name);
      });
  }

  /**
   * @param resourceLink {ResourceLink}
   * @returns {Promise<ResourceLink>}
   */
  createResourceLink(resourceLink) {
    const self = this;

    return self.execute(resourceLinksApi.createResourceLink, {resourceLink: resourceLink})
      .then(result => {
        return self.getResourceLink(result.id);
      });
  }

  /**
   * @param {string | ResourceLink} id
   * @returns {Promise<boolean>}
   */
  deleteResourceLink(id) {
    let resourceLinkId = id;
    if (id instanceof ResourceLink) {
      resourceLinkId = id.id;
    }
    return this.execute(resourceLinksApi.deleteResourceLink, {id: resourceLinkId});
  }

  /**
   * @param {ResourceLink} resourceLink
   * @returns {Promise<Object>}
   */
  updateResourceLink(resourceLink) {
    return this.execute(resourceLinksApi.updateResourceLink, {id: resourceLink.id, resourceLink: resourceLink});
  }
};