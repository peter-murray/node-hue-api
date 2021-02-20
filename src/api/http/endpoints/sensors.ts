import { model } from '@peter-murray/hue-bridge-model';
import { SensorIdPlaceholder } from '../../placeholders/SensorIdPlaceholder';
import { ApiBodyPayload, ApiEndpoint } from './ApiEndpoint';
import { ApiError } from '../../../ApiError';
import { KeyValueType } from '../../../commonTypes';
import { extractUpdatedAttributes, parseErrors, wasSuccessful } from '../../../util';


const SENSOR_ID_PLACEHOLDER = new SensorIdPlaceholder();
const instanceChecks = model.instanceChecks;

type Sensor = model.Sensor

type AnySensor = model.Sensor
  | model.CLIPGenericFlag
  | model.CLIPGenericStatus
  | model.CLIPHumidity
  | model.CLIPLightlevel
  | model.CLIPOpenClose
  | model.CLIPPresence
  | model.CLIPTemperature
  | model.CLIPSwitch

type NewSensorsResponse = {
  lastscan: string,
  sensors: AnySensor[]
}

export type SensorIdResult = {
  id: number
}

const sensorsApi = {

  getAllSensors: new ApiEndpoint()
    .get()
    .uri('/<username>/sensors')
    .acceptJson()
    .pureJson()
    .postProcess(buildAllSensorsResult),

  createSensor: new ApiEndpoint()
    .post()
    .uri('/<username>/sensors')
    .payload(buildSensorPayload)
    .acceptJson()
    .pureJson()
    .postProcess(buildCreateSensorResult),

  findNewSensors: new ApiEndpoint()
    .post()
    .uri('/<username>/sensors')
    .acceptJson()
    .pureJson()
    .postProcess(wasSuccessful),

  getNewSensors: new ApiEndpoint()
    .get()
    .uri('/<username>/sensors/new')
    .acceptJson()
    .pureJson()
    .postProcess(createNewSensorResponse),

  getSensor: new ApiEndpoint()
    .get()
    .uri('/<username>/sensors/<id>')
    .placeholder(SENSOR_ID_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .postProcess(createSensorResponse),

  updateSensor: new ApiEndpoint()
    .put()
    .uri('/<username>/sensors/<id>')
    .placeholder(SENSOR_ID_PLACEHOLDER)
    .payload(createUpdateSensorPayload)
    .acceptJson()
    .pureJson()
    .postProcess(wasSuccessful),

  deleteSensor: new ApiEndpoint()
    .delete()
    .uri('/<username>/sensors/<id>')
    .placeholder(SENSOR_ID_PLACEHOLDER)
    .acceptJson()
    .pureJson()
    .postProcess(wasSuccessful),

  changeSensorConfig: new ApiEndpoint()
    .put()
    .uri('/<username>/sensors/<id>/config')
    .placeholder(SENSOR_ID_PLACEHOLDER)
    .payload(buildSensorConfigPayload)
    .acceptJson()
    .pureJson()
    .postProcess(wasSuccessful),

  changeSensorState: new ApiEndpoint()
    .put()
    .uri('/<username>/sensors/<id>/state')
    .placeholder(SENSOR_ID_PLACEHOLDER)
    .payload(buildSensorStatePayload)
    .acceptJson()
    .pureJson()
    .postProcess(extractUpdatedAttributes),
};
export {sensorsApi};


function buildSensorPayload(parameters: KeyValueType): ApiBodyPayload {
  let sensor = parameters.sensor;

  if (!sensor) {
    throw new ApiError('Sensor to create must be provided');
  } else if (!instanceChecks.isSensorInstance(sensor)) {
    throw new ApiError('You must provide a valid instance of a Sensor to be created');
  }

  const payload = sensor.getHuePayload();
  delete payload.id;

  return {
    type: 'application/json',
    body: payload
  };
}

function buildAllSensorsResult(data: KeyValueType): Sensor[] {
  const result: Sensor[] = [];

  if (data) {
    Object.keys(data).forEach(id => {
      const sensorData = data[id]
        , type = sensorData.type.toLowerCase();

      try {
        const sensor = model.createFromBridge(type, id, sensorData);
        result.push(sensor);
      } catch (err) {
        //TODO need better handling error reporting for this, but this stops us breaking when Hue invents new
        // undocumented sensors.
        console.error(`Failed to create sensor from bridge model: ${err}; payload: ${JSON.stringify(sensorData)}`);
      }
    });
  }

  return result;
}

function createSensorResponse(data: KeyValueType, requestParameters: KeyValueType): AnySensor {
  const id = SENSOR_ID_PLACEHOLDER.getValue(requestParameters)
    , type = data.type.toLowerCase()
  ;
  return model.createFromBridge(type, id, data);
}

function createNewSensorResponse(data: KeyValueType): NewSensorsResponse {
  const result: NewSensorsResponse = {
    lastscan: '',
    sensors: []
  };

  if (data) {
    Object.keys(data).forEach(key => {
      if (key === 'lastscan') {
        result.lastscan = data.lastscan;
      } else {
        const type = data.type.toLowerCase()
          , sensor = model.createFromBridge(type, key, data[key])
        ;
        result.sensors.push(sensor);
      }
    });
  }

  return result;
}

function createUpdateSensorPayload(data: KeyValueType): ApiBodyPayload {
  if (!data || !data.name) {
    throw new ApiError('A name must be provided');
  }

  return {
    type: 'application/json',
    body: {
      name: data.name
    }
  };
}

function buildCreateSensorResult(result: any): SensorIdResult {
  const hueErrors = parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating group: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: Number(result[0].success.id)};
}

function buildSensorConfigPayload(parameters: KeyValueType): ApiBodyPayload {
  if (!parameters || !parameters.sensor) {
    throw new ApiError('A sensor must be provided');
  }

  if (!instanceChecks.isSensorInstance(parameters.sensor)) {
    throw new ApiError('Sensor parameter is not a valid type, must be a Sensor');
  }

  const sensor = parameters.sensor.getHuePayload()
    , body = sensor.config
  ;

  // Remove any parameters that we are not able to set, at least from experience at the time of writing
  delete body.reachable;

  return {
    type: 'application/json',
    body: body
  };
}

function buildSensorStatePayload(parameters: KeyValueType): ApiBodyPayload {
  if (!parameters || !parameters.sensor) {
    throw new ApiError('A sensor must be provided');
  }

  if (!instanceChecks.isSensorInstance(parameters.sensor)) {
    throw new ApiError('Sensor parameter is not a valid type, must be a Sensor');
  }

  let body: KeyValueType;
  if (parameters.filterStateNames) {
    body = {};

    // Limit the updates to the specified stateNames
    parameters.filterStateNames.forEach((stateName: string) => {
      body.stateName = parameters.sensor.state[stateName];
    });
  } else {
    // Just copy all the state values, as these have not been filtered
    body = parameters.sensor.getHuePayload().state;
  }

  // Remove any parameters that we are not able to set, at least from experience at the time of writing
  delete body.lastupdated;

  return {
    type: 'application/json',
    body: body
  };
}