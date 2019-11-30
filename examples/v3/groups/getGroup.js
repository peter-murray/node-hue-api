'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;

// THe id of the group to retrieve
const GROUP_ID = 1;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.groups.getGroup(GROUP_ID);
  })
  .then(group => {
    // Display the details for the group
    console.log(group.toStringDetailed());
  })
;