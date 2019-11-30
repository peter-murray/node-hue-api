'use strict';

const BridgeAction = require('./BridgeAction')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
  , SensorIdPlaceholder = require('../../placeholders/SensorIdPlaceholder')
;

const SENSOR_ID = new SensorIdPlaceholder();

const ATTRIBUTES = [
  types.uint8({name: 'sensor'}),
  types.object({name: 'body'}),
  types.object({name: 'state'}),
];


module.exports = class SensorStateAction extends BridgeAction {

  constructor(sensor) {
    super(ATTRIBUTES, 'PUT');
    this.sensor = sensor;
  }

  get address() {
    return `/sensors/${this.sensor}/state`;
  }

  get sensor() {
    return this.getAttributeValue('sensor');
  }

  set sensor(value) {
    const sensorId = SENSOR_ID.getValue({id: value});
    this.setAttributeValue('sensor', sensorId);
  }

  withState(value) {
    // Sensor state varies wildly, so just take data here, maybe consider building payloads later on...
    this.setAttributeValue('state', value);
    return this;
  }

  get body() {
    const state = this.getAttributeValue('state');
    if (state) {
      return state;
    }
    throw new ApiError('No state has been set on the SensorStateAction');
  }
};
