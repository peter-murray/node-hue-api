'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

const USERNAME = require('../../../test/support/testValues').username;

// The name of the group(s) to retrieve
const GROUP_NAME = 'VRC 1';


discovery.nupnpSearch()
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