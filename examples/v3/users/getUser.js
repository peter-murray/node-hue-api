'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Obtain the user account identified by the specified username
    return api.users.get(USERNAME);
  })
  .then(user => {
    // Display the details of the user we got back
    console.log(JSON.stringify(user, null, 2));
  })
;
