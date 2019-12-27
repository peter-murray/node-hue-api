'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username
  // The name of the light we wish to retrieve by id
  , LIGHT_ID = 10
;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.lights.get(LIGHT_ID);
  })
  .then(light => {
    // Display the details of the light
    console.log(light.toStringDetailed());
  })
;
