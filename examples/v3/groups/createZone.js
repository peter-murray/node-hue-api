'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.create(host, USERNAME);
  })
  .then(api => {

    // The name of the new zone we are creating
    const zoneName = 'Testing Zone Creation'
      // The array of light ids that will be in the zone
      , zoneLights = [1, 2, 3, 4, 5]
      ;

    return api.groups.createZone(zoneName, zoneLights);
  })
  .then(zone => {
    console.log(zone.toStringDetailed());
  })
;