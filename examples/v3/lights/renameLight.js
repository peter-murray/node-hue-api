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
  , LIGHT_NAME = 'Bath Head'
;

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.lights.getLight(LIGHT_ID)
      .then(light => {
        if (light) {
          light.name = LIGHT_NAME;
          return api.lights.renameLight(light);
        } else {
          throw new Error(`Failed to get light with id '${LIGHT_ID}`)
        }
      })
      .then(result => {
        // Display the state of the light
        console.log(`Successfully renamed light? ${result}`);
      })
  })
;
