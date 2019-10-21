'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.lights.getAll();
  })
  .then(allLights => {
    // Display the details of the lights we got back
    console.log(JSON.stringify(allLights, null, 2));

    // Iterate over the light objects showing details
    allLights.forEach(light => {
      console.log(light.toStringDetailed());
    });
  })
;