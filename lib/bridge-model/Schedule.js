'use strict';

const ApiError = require('../ApiError')
  , BridgeObjectWithNumberId = require('./BridgeObjectWithNumberId')
  , BridgeTime = require('./datetime/BridgeTime')
  , dateTime = require('./datetime')
;

module.exports = class Schedule extends BridgeObjectWithNumberId {

  constructor(data, id) {
    super(data, id);

    if (data && data['localtime']) {
      this._localtime = dateTime.create(data['localtime']);
    } else {
      this._localtime = null;
    }
  }

  get description() {
    return this.getRawDataValue('description');
  }

  set description(value) {
    return this._updateRawDataValue('description', value);
  }

  get command() {
    //TODO this is complex object, address, method, body
    return this.getRawDataValue('command');
  }

  set command(value) {
    return this._updateRawDataValue('command', value);
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
    return this.getRawDataValue('status');
  }

  set status(value) {
    if (['enabled', 'disabled'].indexOf(value) === -1) {
      throw new ApiError(`Invalid status value: ${value}`);
    }
    return this._updateRawDataValue('status', value);
  }

  get autodelete() {
    return this.getRawDataValue('autodelete');
  }

  set autodelete(value) {
    return this._updateRawDataValue('autodelete', !!value);
  }

  get recycle() {
    return this.getRawDataValue('recycle');
  }

  set recycle(value) {
    return this._updateRawDataValue('recylce', !!value);
  }

  get created() {
    return this.getRawDataValue('created');
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