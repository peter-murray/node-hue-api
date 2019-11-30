'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// Replace this with your desired name for the ResourceLinks you want to retrieve
const RESOURCE_LINK_NAME = 'Meditation lights';

//
// This code will obtain the specified ResourceLink identified by the RESOURCE_LINK_NAME above and display it on the console

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.resourceLinks.getResourceLinkByName(RESOURCE_LINK_NAME);
  })
  .then(resourceLinks => {
    resourceLinks.forEach(resourceLink => {
      console.log(`${resourceLink.toStringDetailed()}`);
    });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
