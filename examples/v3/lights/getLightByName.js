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
  , LIGHT_NAME = 'Bench corner'
;

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.lights.getLightByName(LIGHT_NAME);
  })
  .then(light => {
    if (light && light.length > 0) {
      // Display the details of the light
      console.log(light[0].toStringDetailed());
    } else {
      console.log(`Failed to find a light with name '${LIGHT_NAME}'`);
    }
  })
;
