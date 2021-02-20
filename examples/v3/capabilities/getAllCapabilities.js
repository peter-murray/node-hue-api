'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

hueApi.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return hueApi.v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.capabilities.getAll();
  })
  .then(capabilities => {
    // Display the Capabilities Object Details
    console.log(capabilities.toStringDetailed());
  })
;
