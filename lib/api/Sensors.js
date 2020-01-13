'use strict';

const sensorsApi = require('./http/endpoints/sensors')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , util = require('../util')
;

/**
 * @typedef {import('../model/sensors/Sensor')} Sensor
 *
 * @type {Sensors}
 */
module.exports = class Sensors extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  /**
   * Gets all the sesnors from the bridge
   * @returns {Promise<Sensor[]>}
   */
  getAll() {
    return this.execute(sensorsApi.getAllSensors);
  }

  /**
   * @deprecated use getSensor(id) instead
   * @param id {string | Sensor}
   * @returns {Promise<Sensor>}
   */
  get(id) {
    util.deprecatedFunction('5.x', 'sensors.get(id)', 'Use sensors.getSensor(id) instead.');
    return this.getSensor(id);
  }

  /**
   * @param id {string | Sensor}
   * @returns {Promise<Sensor>}
   */
  getSensor(id) {
    return this.execute(sensorsApi.getSensor, {id: id});
  }

  /**
   * Starts a search for new ZigBee sensors
   * @returns {Promise<boolean>}
   */
  searchForNew() {
    return this.execute(sensorsApi.findNewSensors);
  }

  /**
   * Obtains the new sesnors that were found from the previous search for new sensors
   * @returns {Promise<Sensor>}.
   */
  getNew() {
    return this.execute(sensorsApi.getNewSensors);
  }

  /**
   * Will update the name attribute of the Sensor on the Bridge.
   * @param sensor { Sensor } The Sensor with the update to the name applied
   * @returns {Promise<Boolean>}
   */
  renameSensor(sensor) {
    return this.execute(sensorsApi.updateSensor, {id: sensor, name: sensor.name});
  }

  /**
   * @deprecated use renameSensor(sensor) instead
   * @param id {String | Sensor} The id or the Sensor instance to update
   * @returns {Promise<Boolean>}
   */
  updateName(id, name) {
    util.deprecatedFunction('5.x', 'sensors.updateName(id, name)', 'Use sensors.rename(sensor) instead.');
    return this.execute(sensorsApi.updateSensor, {id: id, name: name});
  }

  /**
   * Creates a new Sensor (CLIP based)
   * @param sensor {Sensor} The CLIP Sensor that you wish to create.
   * @returns {Promise<Sensor>}
   */
  createSensor(sensor) {
    const self = this;

    return self.execute(sensorsApi.createSensor, {sensor: sensor})
      .then(data => {
        return self.getSensor(data.id);
      });
  }

  /**
   * Deletes a sensor from the Bridge
   * @param id {string | Sensor} The id or Sensor instance to remove from the bridge
   * @returns {Promise<Boolean>}
   */
  deleteSensor(id) {
    return this.execute(sensorsApi.deleteSensor, {id: id});
  }

  /**
   * Will update the configuration attributes of the Sensor in the bridge.
   * @param sensor {Sensor}
   * @returns {Promise<Object>}
   */
  updateSensorConfig(sensor) {
    return this.execute(sensorsApi.changeSensorConfig, {id: sensor.id, sensor: sensor});
  }

  /**
   * Will update the state attributes of the Sensor in the bridge.
   * @param sensor {Sensor}
   * @param limitToStateNames {String[]} optional list of state attributes to limit the update to (should not be needed in practice, was added to get around a bug).
   * @returns {Promise<Object>}
   */
  updateSensorState(sensor, limitToStateNames) {
    return this.execute(sensorsApi.changeSensorState, {id: sensor.id, sensor: sensor, filterStateNames: limitToStateNames});
  }
};