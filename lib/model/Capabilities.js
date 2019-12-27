'use strict';

const BridgeObject = require('./BridgeObject')
  , types = require('../types')
;

const ATTRIBUTES = [
  types.object({
    name: 'lights',
    types: [
      types.uint16({name: 'available'}),
      types.uint16({name: 'total'}),
    ]
  }),
  types.object({
    name: 'sensors',
    types: [
      types.uint16({name: 'available'}),
      types.uint16({name: 'total'}),
      types.object({
        name: 'clip',
        types: [
          types.uint16({name: 'available'}),
          types.uint16({name: 'total'}),
        ]
      }),
      types.object({
        name: 'zll',
        types: [
          types.uint16({name: 'available'}),
          types.uint16({name: 'total'}),
        ]
      }),
      types.object({
        name: 'zgp',
        types: [
          types.uint16({name: 'available'}),
          types.uint16({name: 'total'}),
        ]
      })
    ]
  }),
  types.object({
    name: 'groups',
    types: [
      types.uint16({name: 'available'}),
      types.uint16({name: 'total'}),
    ]
  }),
  types.object({
    name: 'scenes',
    types: [
      types.uint16({name: 'available'}),
      types.uint16({name: 'total'}),
      types.object({
        name: 'lightstates',
        types: [
          types.uint16({name: 'available'}),
          types.uint16({name: 'total'}),
        ]
      }),
    ]
  }),
  types.object({
    name: 'schedules',
    types: [
      types.uint16({name: 'available'}),
      types.uint16({name: 'total'}),
    ]
  }),
  types.object({
    name: 'rules',
    types: [
      types.uint16({name: 'available'}),
      types.uint16({name: 'total'}),
      types.object({
        name: 'conditions',
        types: [
          types.uint16({name: 'available'}),
          types.uint16({name: 'total'}),
        ]
      }),
      types.object({
        name: 'actions',
        types: [
          types.uint16({name: 'available'}),
          types.uint16({name: 'total'}),
        ]
      }),
    ]
  }),
  types.object({
    name: 'resourcelinks',
    types: [
      types.uint16({name: 'available'}),
      types.uint16({name: 'total'}),
    ]
  }),
  types.object({
    name: 'streaming',
    types: [
      types.uint16({name: 'available'}),
      types.uint16({name: 'total'}),
      types.uint16({name: 'channels'}),
    ]
  }),
  types.object({
    name: 'timezones',
    types: [
      types.list({name: 'values', minEntries: 0, listType: types.string({name: 'timezone'})}),
    ]
  }),
];


module.exports = class Capabilities extends BridgeObject {

  constructor() {
    super(ATTRIBUTES);
  }

  get lights() {
    return this.getAttributeValue('lights');
  }

  get sensors() {
    return this.getAttributeValue('sensors');
  }

  get groups() {
    return this.getAttributeValue('groups');
  }

  get scenes() {
    return this.getAttributeValue('scenes');
  }

  get schedules() {
    return this.getAttributeValue('schedules');
  }

  get rules() {
    return this.getAttributeValue('rules');
  }

  get resourceLinks() {
    return this.getAttributeValue('resourcelinks');
  }

  get resourcelinks() {
    return this.getAttributeValue('resourcelinks');
  }

  get streaming() {
    return this.getAttributeValue('streaming');
  }

  get timezones() {
    return this.getAttributeValue('timezones').values;
  }
};