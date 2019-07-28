'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// Replace with the desired sensor ID that you want to rename
const SENSOR_ID = 1000;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.create(host, USERNAME);
  })
  .then(api => {
    // The Hue Daylight software sensor is identified as id 1
    return api.sensors.updateName(SENSOR_ID, 'updated-sensor-name');
  })
  .then(result => {
    console.log(`Updated sensor name? ${result}`);
  })
  .catch(err => {
    if (err.getHueErrorType() === 3) {
      console.error(`Failed to locate a sensor with id ${SENSOR_ID}`)
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  })
;
