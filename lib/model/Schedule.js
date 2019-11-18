'use strict';

const ApiError = require('../ApiError')
  , BridgeObject = require('./BridgeObject')
  , BridgeTime = require('./datetime/BridgeTime')
  , dateTime = require('./datetime')
  , parameters = require('../types')
;


const ATTRIBUTES = [
  parameters.string({name: 'name', min: 0, max: 32, optional: true}),
  parameters.string({name: 'description', min: 0, max: 64, optional: true}),
  parameters.object({name: 'command', optional: false}), //TODO address, method, body
  parameters.string({name: 'time'}),
  parameters.string({name: 'created'}),
  parameters.choice({name: 'status', validValues: ['enabled', 'disabled'], defaultValue: 'enabled'}),
  parameters.boolean({name: 'autodelete', defaultValue: true}),
  // parameters.string({name: 'localtime'}), //TODO need to use a time based object on this, need to define the parameters
  parameters.boolean({name: 'recycle', defaultValue: false}),
];


module.exports = class Schedule extends BridgeObject {

  constructor(data, id) {
    super(ATTRIBUTES, data, id);

    //TODO turn this into a parameter
    if (data && data['localtime']) {
      this._localtime = dateTime.create(data['localtime']);
    } else {
      this._localtime = null;
    }
  }

  get description() {
    return this.getAttributeValue('description');
  }

  set description(value) {
    return this.setAttributeValue('description', value);
  }

  get command() {
    //TODO this is complex object, address, method, body
    return this.getAttributeValue('command');
  }

  set command(value) {
    return this.setAttributeValue('command', value);
  }

  get localtime() {
    return this._localtime;
  }

  set localtime(time) {
    if (time instanceof BridgeTime) {
      this._localtime = time;
    } else {
      //TODO may need to properly cater for javascript Date
      this._localtime = dateTime.create(time.toString());
    }

    return this;
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
    return this.setAttributeValue('recylce', value);
  }

  get created() {
    return this.getAttributeValue('created');
  }

  get payload() {
    const self = this
      , payload = {}
    ;

    // Mandatory values
    ['command'].forEach(key => {
      const value = self.getRawDataValue(key);
      if (!value) {
        throw new ApiError(`Mandatory Schedule parameter ${key} is missing.`);
      }
      payload[key] = value;
    });

    // Mandatory localtime value
    payload.localtime = this._localtime.toString();

    // Optional values
    ['name', 'description', 'autodelete', 'status', 'recycle'].forEach(key => {
      const value = self.getRawDataValue(key);
      if (value) {
        payload[key] = value;
      }
    });

    return payload;
  }
};