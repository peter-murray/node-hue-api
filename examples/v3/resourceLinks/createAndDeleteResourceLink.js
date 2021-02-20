'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

const model = v3.model;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

//
// This code will create a new ResourceLink on the bridge associated with the group 0 (all lights group)

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    const resourceLink = model.createResourceLink();
    resourceLink.name = 'API Created ResourceLink';
    resourceLink.description = 'A test resource link for node-hue-api';
    resourceLink.recycle = true;
    resourceLink.classid = 100;
    resourceLink.addLink('groups', 0);

    return api.resourceLinks.createResourceLink(resourceLink)
      .then(createdResourceLink => {
        console.log(`${createdResourceLink.toStringDetailed()}`);

        // Delete the created resource link
        return api.resourceLinks.deleteResourceLink(createdResourceLink);
      });
  })
  .then(deleteResult => {
    console.log(`\ndeleted created ResourceLink? ${deleteResult}`);
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
