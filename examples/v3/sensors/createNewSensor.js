'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const model = v3.model;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

//
// This code will create a CLIP Sensor and then remove it so as to not pollute the Hur Bridge with useless sensors.
//

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Build a new sensor object to save to the bridge
    const myOpenCloseSensor = model.createCLIPOpenCloseSensor();
    myOpenCloseSensor.modelid = 'node-hue-api software sensor';
    myOpenCloseSensor.swversion = '1.0';
    myOpenCloseSensor.uniqueid = '00:00:00:01';
    myOpenCloseSensor.manufacturername = 'node-hue-api';

    myOpenCloseSensor.name = 'Test Open/Close Sensor';
    // Set an initial open state of false
    myOpenCloseSensor.open = false;

    // Create the new sensor on the bridge
    return api.sensors.createSensor(myOpenCloseSensor)
      .then(sensor => {
        console.log(`Created a Sensor\n${sensor.toStringDetailed()}`);

        // Delete the sensor from the bridge
        return api.sensors.deleteSensor(sensor);
      });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
