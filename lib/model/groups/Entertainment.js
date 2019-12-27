'use strict';

const Group = require('./Group')
  , types = require('../../types')
;

const ATTRIBUTES = [
  types.string({name: 'type', defaultValue: 'Entertainment'}),
  // iOS Hue application is defaulting the types to TV currently, also only TV and Other seem to work out of all the classes
  types.choice({name: 'class', defaultValue: 'TV', validValues: ['TV', 'Other']}),
  types.object({
    name: 'stream',
    types: [
      types.string({name: 'proxymode'}),
      types.string({name: 'proxynode'}),
      types.boolean({name: 'active'}),
      types.string({name: 'owner'}),
    ]
  }),
  types.object({name: 'locations'}),
  types.list({name: 'lights', minEntries: 0, listType: types.string({name: 'lightId'})}),
];

/**
 * A Group of lights that can be utilized in an Entertainment situation for streaming.
 *
 * There are limitations on which lights can be added to an Entertainment Group, as they need to support the ability
 * to stream, which requires newer lights in the hue ecosystem.
 *
 * @type {Entertainment}
 */
module.exports = class Entertainment extends Group {

  constructor(id) {
    super(ATTRIBUTES, id);
  }

  set lights(value) {
    return this.setAttributeValue('lights', value);
  }

  /** @return {Array.string} */
  get lights() {
    return this.getAttributeValue('lights');
  }

  /**
   * @param value {string}
   * @returns {Entertainment}
   */
  set class(value) {
    return this.setAttributeValue('class', value);
  }

  /**
   * @returns {string}
   */
  get class() {
    return this.getAttributeValue('class');
  }

  /**
   * Obtains details of the stream on the Entertainment Group.
   *
   * @typedef Stream
   * @type {object}
   * @property proxymode {string}
   * @property proxynode {string}
   * @property active {boolean} The status of whether or not the stream is active
   * @property owner {string} The owner (user id) of the stream if it is active
   *
   * @returns @type {Stream}
   */
  get stream() {
    return this.getAttributeValue('stream');
  }

  // TODO consider unpacking this in to something more user friendly
  get locations() {
    return this.getAttributeValue('locations');
  }
};
