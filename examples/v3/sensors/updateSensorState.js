'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const CLIPOpenCloseSensor = v3.sensors.clip.OpenClose;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

//
// This code will create a CLIP Sensor that we can interact with, setting it's state attributes and will then clean up
// after itself and remove the Sensor it created.
//
// We will create a CLIPOpenClose sensor and then toggle the "open" state of the sensor in the Hue Bridge.
//

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Build a new sensor object to save to the bridge
    const myOpenCloseSensor = new CLIPOpenCloseSensor({
      modelid: 'node-hue-api software sensor',
      swversion: '1.0',
      uniqueid: '00:00:00:01',
      manufacturername: 'node-hue-api',
    });
    // Set a name
    myOpenCloseSensor.name = 'Test Open/Close Sensor';
    // Set an initial open state of false
    myOpenCloseSensor.open = false;

    let sensorId = null;

    // Create the new sensor on the bridge
    return api.sensors.createSensor(myOpenCloseSensor)
      .then(result => {
        console.log(`Created new sensor with id:  ${result.id}`);
        sensorId = result.id;

        // Get the new sensor from the bridge
        return api.sensors.get(sensorId);
      })
      .then(sensor => {
        console.log(sensor.toStringDetailed());
        return sensor;
      })
      .then(sensor => {
        // Update the open state to true
        sensor.open = true;

        // Send the update to the bridge
        return api.sensors.updateSensorState(sensor);
      })
      .then(result => {
        console.log(`Updated the Sensor, ${sensorId}, state values updated: ${JSON.stringify(result)}`);

        // Get the updated sensor object from the Bridge again, it should have a lastupdated attribute for the change now
        return api.sensors.get(sensorId);
      })
      .then(sensor => {
        // Display the sensor details again after the state change
        console.log(sensor.toStringDetailed());
      })
      .then(() => {
        // Delete the sensor from the bridge
        return api.sensors.deleteSensor(sensorId);
      });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
