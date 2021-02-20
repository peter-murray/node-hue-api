'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username
  // The name of the light we wish to retrieve by name
  , LIGHT_ID = 1
;

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Using a basic object to set the state
    return api.lights.setLightState(LIGHT_ID, {on: true});
  })
  .then(result => {
    console.log(`Light state change was successful? ${result}`);
  })
;
