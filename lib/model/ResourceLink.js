'use strict';

const ApiError = require('../ApiError')
  , BridgeObjectWithId = require('./BridgeObjectWithId')
  , parameters = require('../types')
;

// All the valid resource types that the Hue API documentation provides
const VALID_RESOURCELINK_TYPES = [
  'lights',
  'sensors',
  'groups',
  'scenes',
  'rules',
  'schedules',
  'resourcelinks',
];


const ATTRIBUTES = [
  parameters.uint16({name: 'id'}),
  parameters.string({name: 'name', min: 1, max: 32}),
  parameters.string({name: 'description', min: 0, max: 64}),
  parameters.choice({name: 'type', validValues: ['Link'], defaultValue: 'Link'}),
  parameters.uint16({name: 'classid'}),
  parameters.string({name: 'owner'}), // Supposedly 10 minimum length but "none" is set as this value in my bridge
  parameters.boolean({name: 'recycle'}),
  // links: //TODO too complex as these are not stored in bridge format
];


module.exports = class ResourceLink extends BridgeObjectWithId {

  constructor(id) {
    super(ATTRIBUTES, id);
    this.resetLinks();
  }

  set name(value) {
    return this.setAttributeValue('name', value);
  }

  get name() {
    return this.getAttributeValue('name');
  }

  get description() {
    return this.getAttributeValue('description');
  }

  set description(value) {
    return this.setAttributeValue('description', value);
  }

  get type() {
    return this.getAttributeValue('type');
  }

  get classid() {
    return this.getAttributeValue('classid');
  }

  set classid(value) {
    return this.setAttributeValue('classid', value);
  }

  get owner() {
    return this.getAttributeValue('owner');
  }

  get recycle() {
    return this.getAttributeValue('recycle');
  }

  set recycle(value) {
    return this.setAttributeValue('recycle', value);
  }

  get links() {
    // Prevent editing of the link representation
    return Object.assign({}, this._links);
  }

  resetLinks() {
    this._links = {};
    return this;
  }

  addLink(type, id) {
    const links = this._links
      , validatedLinkType = validateLinkType(type)
    ;

    if (! links[validatedLinkType]) {
      links[validatedLinkType] = [];
    }

    links[validatedLinkType].push(id);

    return this;
  }

  removeLink(type, id) {
    const links = this._links
      , validatedLinkType = validateLinkType(type)
      , linkType = links[validatedLinkType]
    ;

    if (linkType) {
      const idx = linkType.indexOf(`${id}`);
      if (idx > -1) {
        linkType.splice(idx, 1);
      }
    }

    return this;
  }

  toStringDetailed() {
    let result = super.toStringDetailed();

    const links = this.links;
    result += `\n  links: ${JSON.stringify(links)}`;

    return result;
  }

  getJsonPayload() {
    const dataLinks = this.links
      , data = super.getJsonPayload();

    // Add the links to the object
    data.links = JSON.parse(JSON.stringify(dataLinks));

    return data;
  }

  getHuePayload() {
    const data = super.getHuePayload()
      , resourceLinkLinks = this.links
      , links = []
    ;

    // Convert the links back into the Hue Bride address form
    Object.keys(resourceLinkLinks).forEach(resource => {
      const resourceIds = resourceLinkLinks[resource];
      if (resourceIds) {
        resourceIds.forEach(resourceId => {
          links.push(`/${resource}/${resourceId}`);
        });
      }
    });
    data.links = links;

    return data;
  }

  /**
   * @param data {*}
   * @private
   */
  _populate(data) {
    // Links are taken apart and separated out from the data
    const rawData = Object.assign({}, data);
    const linkData = rawData.links;
    delete rawData.links;

    super._populate(rawData);
    this._links = processLinks(linkData);
    return this;
  }
};


function processLinks(linkData) {
  const result = {};

  if (linkData) {
    // This is the correct format for the bridge data
    if (Array.isArray(linkData)) {
      linkData.forEach(link => {
        const parts = /\/(.*)\/(.*)/.exec(link)
          , linkType = parts[1]
          , linkId = parts[2]
        ;

        const validatedLinkType = validateLinkType(linkType);

        let links = result[validatedLinkType];
        if (!links) {
          links = [];
          result[validatedLinkType] = links;
        }

        links.push(linkId);
      });
    } else {
      // We end up here if deserializing our own copy of a resource link
      Object.keys(linkData).forEach(key => {
        const validatedLinkType = validateLinkType(key);
        let links = linkData[key];
        result[validatedLinkType] = links;
      });
    }
  }

  return result;
}


function validateLinkType(type) {
  if (!type) {
    throw new ApiError('A ResourceLink Type must be provided');
  }
  const typeLowerCase = type.toLowerCase()
    , idx = VALID_RESOURCELINK_TYPES.indexOf(typeLowerCase)
  ;

  if (idx === -1) {
    throw new ApiError(`Invalid resource link type ${type}`);
  }

  return typeLowerCase;
}