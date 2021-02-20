'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.sensors.getNew();
  })
  .then(result => {
    // Show the time of the last scan
    console.log(`Last Scan Performed: ${result.lastscan}`);
    // Display the new sensors
    console.log(`Sensors found:\n${JSON.stringify(result.sensors, null, 2)}`);
  })
;
