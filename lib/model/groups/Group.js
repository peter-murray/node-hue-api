'use strict';

const BridgeObjectWithId = require('../BridgeObjectWithId')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
  , util = require('../../util')
;

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


const ATTRIBUTES = [
  types.int8({name: 'id'}),
  types.string({name: 'name', min: 0, max: 32}),
  types.list({name: 'sensors', minEntries: 0, listType: types.string({name: 'sensorId'})}),
  types.object({name: 'action'}), //TODO a lightstate
  types.object({
    name: 'state',
    types: [
      types.boolean({name: 'all_on'}),
      types.boolean({name: 'any_on'}),
    ]
  }),
  // Only present if the group contains a ZLLPresence or CLIPPresence
  types.object({
    name: 'presence',
    types: [
      types.string({name: 'lastupdated'}),
      types.boolean({name: 'presence'}),
      types.boolean({name: 'presence_all'})
    ]
  }),
  // Only present if the group contains a ZLLLightlevel or CLIPLightLevel
  types.object({
    name: 'lightlevel', types: [
      types.string({name: 'lastupdated'}),
      types.boolean({name: 'dark'}),
      types.boolean({name: 'dark_all'}),
      types.boolean({name: 'daylight'}),
      types.boolean({name: 'daylight_any'}),
      types.uint16({name: 'lightlevel'}),
      types.uint16({name: 'lightlevel_min'}),
      types.uint16({name: 'lightlevel_max'}),
    ]
  }),
  types.boolean({name: 'recycle', defaultValue: false}),
];

module.exports = class Group extends BridgeObjectWithId {

  constructor(attributes, id) {
    super(util.flatten(ATTRIBUTES, attributes), id);

    if (!this._attributes.type) {
      throw new ApiError('Missing a valid type attribute for the Group');
    }

    if (!this._attributes.lights) {
      throw new ApiError('Missing a valid lights attribute for the Group');
    }
  }

  get name() {
    return this.getAttributeValue('name');
  }

  set name(value) {
    return this.setAttributeValue('name', value);
  }

  set sensors(value) {
    return this.setAttributeValue('sensors', value);
  }

  /** @return {Array.string} */
  get sensors() {
    return this.getAttributeValue('sensors');
  }

  /** @return {string} */
  get type() {
    return this.getAttributeValue('type');
  }

  get action() {
    // //TODO this is a lightstate
    // return this.getRawDataValue('action');
    return this.getAttributeValue('action');
  }

  /** @return {boolean} */
  get recycle() {
    return this.getAttributeValue('recycle');
  }

  get state() {
    return this.getAttributeValue('state');
  }

  static getAllGroupClasses() {
    return ROOM_CLASSES;
  }
};