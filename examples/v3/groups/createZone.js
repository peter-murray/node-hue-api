'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const model = v3.model;

// Replace this with your Bridge User name
const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    const newZone = model.createZone();
    // The name of the new zone we are creating
    newZone.name =  'Testing Zone Creation';
    // The array of light ids that will be in the zone
    newZone.lights = [2, 3, 4, 5];
    // The class for the zone, this has to be selected from the valid value, consult the documentation for details
    newZone.class = 'Toilet';

    return api.groups.createGroup(newZone)
      .then(zone => {
        console.log(zone.toStringDetailed());

        // Delete the new Zone
        return api.groups.deleteGroup(zone);
      });
  })
  .catch(err => {
    console.error(err);
  })
;