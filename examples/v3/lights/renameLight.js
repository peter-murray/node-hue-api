'use strict';

const v3 = require('../../../lib').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username
  // The name of the light we wish to retrieve by name
  , LIGHT_ID = 1
;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.lights.getLight(LIGHT_ID)
      .then(light => {
        if (light) {
          light.name = 'my new neme';
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
