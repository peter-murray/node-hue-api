'use strict';

const  BridgeObjectWithId = require('./BridgeObjectWithId')
  , types = require('../types')
;


const ATTRIBUTES = [
  types.uint8({name: 'id'}),
  types.string({name: 'name', min: 0, max: 32, optional: true}),
  types.string({name: 'description', min: 0, max: 64, optional: true}),
  types.object({
    name: 'command',
    optional: false,
    types: [
      types.string({name: 'address', optional: false}),
      types.choice({name: 'method', optional: false, validValues: ['POST', 'PUT', 'DELETE']}),
      types.object({name: 'body', optional: false}),
    ],
  }),
  types.string({name: 'time'}),
  types.timePattern({name: 'localtime'}),
  types.string({name: 'created'}),
  types.choice({name: 'status', validValues: ['enabled', 'disabled'], defaultValue: 'enabled'}),
  types.boolean({name: 'autodelete'}),
  types.boolean({name: 'recycle', defaultValue: false}),
  types.string({name: 'starttime'}),
];


module.exports = class Schedule extends BridgeObjectWithId {

  constructor(id) {
    super(ATTRIBUTES, id);
  }

  get name() {
    return this.getAttributeValue('name');
  }

  set name(value) {
    return this.setAttributeValue('name', value)
  }

  get description() {
    return this.getAttributeValue('description');
  }

  set description(value) {
    return this.setAttributeValue('description', value);
  }

  get command() {
    return this.getAttributeValue('command');
  }

  set command(value) {
    return this.setAttributeValue('command', value);
  }

  get time() {
    return this.getAttributeValue('time');
  }

  get localtime() {
    return this.getAttributeValue('localtime');
  }

  set localtime(value) {
    return this.setAttributeValue('localtime', value);
  }

  get status() {
    return this.getAttributeValue('status');
  }

  set status(value) {
    return this.setAttributeValue('status', value);
  }

  get autodelete() {
    return this.getAttributeValue('autodelete');
  }

  set autodelete(value) {
    return this.setAttributeValue('autodelete', value);
  }

  get recycle() {
    return this.getAttributeValue('recycle');
  }

  set recycle(value) {
    return this.setAttributeValue('recycle', value);
  }

  get created() {
    return this.getAttributeValue('created');
  }
};