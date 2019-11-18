'use strict';

const BridgeObject = require('./BridgeObject')
  , types = require('../types')
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
  types.choice({name: 'type', validValues: ['LightGroup', 'Luminaire', 'LightSource', 'Room', 'Entertainment', 'Zone'], defaultValue: 'LightGroup'}),
  types.list({name: 'lights', minEntries: 0, listType: types.uint8({name: 'lightId'})}), //TODO a room can be empty, but all others require at least one
  types.list({name: 'sensors', minEntries: 0, listType: types.string({name: 'sensorId'})}),
  types.object({name: 'action'}),
  types.object({name: 'state'}),
  types.object({name: 'presence', types: [types.string({name: 'lastupdated'}), types.boolean({name: 'presence'}), types.boolean({name: 'presence_all'})]}),
  types.object({name: 'lightlevel', types: [
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
  types.choice({name: 'class', defaultValue: 'Other', validValues: ROOM_CLASSES}),
  types.object({name: 'locations'})
];

module.exports = class Group extends BridgeObject {

  constructor(id) {
    super(ATTRIBUTES, id);
  }

  get name() {
    return this.getAttributeValue('name');
  }

  set name(value) {
    return this.setAttributeValue('name', value);
  }

  set lights(value) {
    return this.setAttributeValue('lights', value);
  }

  get lights() {
    return this.getAttributeValue('lights');
  }

  set type(value) {
    return this.setAttributeValue('type', value);
  }

  get type() {
    return this.getAttributeValue('type');
  }

  get action() {
    // //TODO this is a lightstate
    // return this.getRawDataValue('action');
    return this.getAttributeValue('action');
  }

  get recycle() {
    return this.getAttributeValue('recycle');
  }

  get sensors() {
    //TODO check what this actually returns when there is one
    return this.getAttributeValue('sensors');
  }

  get state() {
    return this.getAttributeValue('state');
  }

  set class(value) {
    return this.setAttributeValue('class', value);
  }

  get class() {
    return this.getAttributeValue('class');
  }

  get locations() {
    // TODO locations are specific to a room
    return this.getAttributeValue('locations');
  }

  get stream() {
    return this.getAttributeValue('stream');
  }

  //TODO need more getters
};