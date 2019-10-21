'use strict';

const ApiEndpoint = require('./endpoint')
  , Sensor = require('../../../bridge-model/devices/sensors/Sensor')
  , SensorIdPlaceholder = require('../placeholders/SensorIdPlaceholder')
  , sensorBuilder = require('../../../bridge-model/devices/sensors')
  , ApiError = require('../../../ApiError')
  , util = require('../util')
;

module.exports = {

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
    .postProcess(util.wasSuccessful),

  getNewSensors: new ApiEndpoint()
    .get()
    .uri('/<username>/sensors/new')
    .acceptJson()
    .pureJson()
    .postProcess(createNewSensorResponse),

  getSensor: new ApiEndpoint()
    .get()
    .uri('/<username>/sensors/<id>')
    .placeholder(new SensorIdPlaceholder())
    .acceptJson()
    .pureJson()
    .postProcess(createSensorResponse),

  updateSensor: new ApiEndpoint()
    .put()
    .uri('/<username>/sensors/<id>')
    .placeholder(new SensorIdPlaceholder())
    .payload(createUpdateSensorPayload)
    .acceptJson()
    .pureJson()
    .postProcess(util.wasSuccessful),

  deleteSensor: new ApiEndpoint()
    .delete()
    .uri('/<username>/sensors/<id>')
    .placeholder(new SensorIdPlaceholder())
    .acceptJson()
    .pureJson()
    .postProcess(util.wasSuccessful),

  changeSensorConfig: new ApiEndpoint()
    .put()
    .uri('/<username>/sensors/<id>/config')
    .placeholder(new SensorIdPlaceholder())
    .payload(buildSensorConfigPayload)
    .acceptJson()
    .pureJson()
    .postProcess(util.wasSuccessful),

  changeSensorState: new ApiEndpoint()
    .put()
    .uri('/<username>/sensors/<id>/state')
    .placeholder(new SensorIdPlaceholder())
    .payload(buildSensorStatePayload)
    .acceptJson()
    .pureJson()
    .postProcess(util.wasSuccessful),
};


function buildSensorPayload(parameters) {
  let sensor = parameters.sensor;

  if (!sensor) {
    throw new ApiError('Sensor to create must be provided');
  } else if (!(sensor instanceof Sensor)) {
    throw new ApiError('You must provide a valid instance of a Sensor to be created');
  }

  return {
    type: 'application/json',
    body: sensor.payload
  };
}

function buildAllSensorsResult(data) {
  const result = [];

  if (data) {
    Object.keys(data).forEach(id => {
      result.push(sensorBuilder.build(data[id], id));
    });
  }

  return result;
}

function createSensorResponse(data, requestParameters) {
  return sensorBuilder.build(data, requestParameters.id);
}

function createNewSensorResponse(data) {
  const result = {
    lastscan: null,
    sensors: []
  };

  if (data) {
    Object.keys(data).forEach(key => {

      if (key === 'lastscan') {
        result.lastscan = data.lastscan;
      } else {
        result.sensors.push(new Sensor(data[key], key));
      }
    });
  }

  return result;
}

function createUpdateSensorPayload(data) {
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

function buildCreateSensorResult(result) {
  const hueErrors = util.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating group: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: Number(result[0].success.id)};
}

function buildSensorConfigPayload(parameters) {
  if (!parameters || !parameters.sensor) {
    throw new ApiError('A sensor must be provided');
  }

  if (!(parameters.sensor instanceof Sensor)) {
    throw new ApiError('Sensor parameter is not a valid type, must be a Sensor');
  }

  const body = parameters.sensor.config;

  // Remove any parameters that we are not able to set, at least from experience at the time of writing
  delete body.reachable;

  return {
    type: 'application/json',
    body: body
  };
}

function buildSensorStatePayload(parameters) {
  if (!parameters || !parameters.sensor) {
    throw new ApiError('A sensor must be provided');
  }

  if (!(parameters.sensor instanceof Sensor)) {
    throw new ApiError('Sensor parameter is not a valid type, must be a Sensor');
  }

  let body;
  if (parameters.filterStateNames) {
    body = {};

    // Limit the updates to the specified stateNames
    parameters.filterStateNames.forEach(stateName => {
      const value = parameters.sensor.state[stateName];
      body.stateName = value;
    })
  } else {
    // Just copy all the state values, as these have not been filtered
    body = parameters.sensor.state;
  }

  // Remove any parameters that we are not able to set, at least from experience at the time of writing
  delete body.lastupdated;

  return {
    type: 'application/json',
    body: body
  };
}