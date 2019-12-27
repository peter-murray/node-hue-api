'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// Set this to the id of the sensor to remove from the bridge
const SENSOR_ID_TO_DELETE = 1000;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.sensors.getSensor(SENSOR_ID_TO_DELETE);
  })
  .then(result => {
    console.log(`Sensor was successfully deleted? ${result}`);
  })
  .catch(err => {
    if (err.getHueErrorType() === 3) {
      console.log(`Sensor with id:${SENSOR_ID_TO_DELETE} was not found`);
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  })
;
