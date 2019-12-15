'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const model = v3.model;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Will create a new Sensor, then rename it and finally remove it from the Bridge.
    return api.sensors.createSensor(getNewSensor())
      .then(sensor => {
        // Display the new Sensor we created
        console.log(sensor.toStringDetailed());

        // Update the name of the sensor
        sensor.name = 'Updated Name Value';

        return api.sensors.renameSensor(sensor)
          .then(result => {
            console.log(`\nUpdated sensor name? ${result}\n`);

            // Obtain the updated sensor from the bridge
            return api.sensors.getSensor(sensor);
          })
          .then(sensor => {
            // Display the updated sensor (should be just the name that has changed)
            console.log(sensor.toStringDetailed());

            // Now delete it from the bridge
            return api.sensors.deleteSensor(sensor);
          });
      });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;

function getNewSensor() {
  const sensor = model.createCLIPOpenCloseSensor();

  sensor.modelid = 'software';
  sensor.swversion = '1.0';
  sensor.uniqueid = '00:00:00:01';
  sensor.manufacturername = 'node-hue-api';
  sensor.name = 'my-generic-status-sensor';

  return sensor;
}