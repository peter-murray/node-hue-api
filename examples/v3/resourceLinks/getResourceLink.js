'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// Replace this with your desired ID for the ResourceLink you want to retrieve
const RESOURCE_LINK_ID = 62738;

//
// This code will obtain the specified ResourceLink identified by the RESOURCE_LINK_ID above and display it on the console

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.resourceLinks.getResourceLink(RESOURCE_LINK_ID);
  })
  .then(resourceLink => {
    console.log(`${resourceLink.toStringDetailed()}`);
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
