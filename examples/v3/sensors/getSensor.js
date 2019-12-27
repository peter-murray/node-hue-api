'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // The Hue Daylight software sensor is identified as id 1
    return api.sensors.getSensor(1);
  })
  .then(sensor => {
    // Display the details of the sensors we got back
    console.log(sensor.toStringDetailed());
  })
;
