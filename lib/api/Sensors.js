'use strict';

const sensorsApi = require('./http/endpoints/sensors')
  , ApiDefinition = require('./http/ApiDefinition.js')
;


module.exports = class Sensors extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return this.execute(sensorsApi.getAllSensors);
  }

  get(id) {
    return this.execute(sensorsApi.getSensor, {id: id});
  }

  searchForNew() {
    return this.execute(sensorsApi.findNewSensors);
  }

  getNew() {
    return this.execute(sensorsApi.getNewSensors);
  }

  updateName(id, name) {
    return this.execute(sensorsApi.updateSensor, {id: id, name: name});
  }

  createSensor(sensor) {
    return this.execute(sensorsApi.createSensor, {sensor: sensor});
  }

  deleteSensor(id) {
    return this.execute(sensorsApi.deleteSensor, {id: id});
  }

  updateSensorConfig(sensor) {
    return this.execute(sensorsApi.changeSensorConfig, {id: sensor.id, sensor: sensor});
  }

  updateSensorState(sensor) {
    return this.execute(sensorsApi.changeSensorState, {id: sensor.id, sensor: sensor});
  }
};