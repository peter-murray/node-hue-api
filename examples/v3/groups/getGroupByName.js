'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;

// The nameof the group(s) to retrieve
const GROUP_NAME = 'VRC 1';


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.groups.getGroupByName(GROUP_NAME);
  })
  .then(matchedGroups => {
    if (matchedGroups && matchedGroups.length > 0) {
      // Iterate over the light objects showing details
      matchedGroups.forEach(group => {
        console.log(group.toStringDetailed());
      });
    } else {
     console.log(`No groups found with names that match: '${GROUP_NAME}'`);
    }
  })
;