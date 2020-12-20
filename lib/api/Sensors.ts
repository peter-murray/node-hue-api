import { ApiDefinition } from './http/ApiDefinition';
import { model } from '@peter-murray/hue-bridge-model';
import { KeyValueType } from '../commonTypes';

import { SensorIdResult, sensorsApi } from './http/endpoints/sensors';

type Sensor = model.Sensor
type SensorId = string | Sensor

type CLIPSensor =
  model.CLIPGenericFlag
  | model.CLIPGenericStatus
  | model.CLIPHumidity
  | model.CLIPLightlevel
  | model.CLIPOpenClose
  | model.CLIPPresence
  | model.CLIPTemperature
  | model.CLIPSwitch

export class Sensors extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll(): Promise<Sensor[]> {
    return this.execute(sensorsApi.getAllSensors);
  }

  // /**
  //  * @deprecated use getSensor(id) instead
  //  * @param id {string | Sensor}
  //  * @returns {Promise<Sensor>}
  //  */
  // get(id) {
  //   util.deprecatedFunction('5.x', 'sensors.get(id)', 'Use sensors.getSensor(id) instead.');
  //   return this.getSensor(id);
  // }

  getSensor(id: SensorId): Promise<Sensor> {
    return this.execute(sensorsApi.getSensor, {id: id});
  }

  searchForNew(): Promise<boolean> {
    return this.execute(sensorsApi.findNewSensors);
  }

  getNew(): Promise<Sensor[]> {
    return this.execute(sensorsApi.getNewSensors);
  }

  renameSensor(sensor: Sensor): Promise<boolean> {
    return this.execute(sensorsApi.updateSensor, {id: sensor, name: sensor.name});
  }

  // /**
  //  * @deprecated use renameSensor(sensor) instead
  //  * @param id {String | Sensor} The id or the Sensor instance to update
  //  * @returns {Promise<Boolean>}
  //  */
  // updateName(id, name) {
  //   util.deprecatedFunction('5.x', 'sensors.updateName(id, name)', 'Use sensors.rename(sensor) instead.');
  //   return this.execute(sensorsApi.updateSensor, {id: id, name: name});
  // }

  /** Creates a new Sensor (CLIP based) */
  createSensor(sensor: CLIPSensor): Promise<CLIPSensor> {
    const self = this;

    return self.execute(sensorsApi.createSensor, {sensor: sensor})
      .then((data: SensorIdResult) => {
        // @ts-ignore
        return self.getSensor(data.id) as CLIPSensor;
      });
  }

  deleteSensor(id: SensorId): Promise<boolean> {
    return this.execute(sensorsApi.deleteSensor, {id: id});
  }

  /** Will update the configuration attributes of the Sensor in the bridge. */
  updateSensorConfig(sensor: Sensor): Promise<KeyValueType> {
    return this.execute(sensorsApi.changeSensorConfig, {id: sensor.id, sensor: sensor});
  }

  /**
   * Will update the state attributes of the Sensor in the bridge.
   * @param limitToStateNames list of state attributes to limit the update to (should not be needed in practice, was added to get around a bug).
   */
  updateSensorState(sensor: Sensor, limitToStateNames?: string[]): Promise<KeyValueType> {
    return this.execute(sensorsApi.changeSensorState, {
      id: sensor.id,
      sensor: sensor,
      filterStateNames: limitToStateNames
    });
  }
}