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
    return Promise.all([
      // Obtain the user account identified by the specified name, in this case 'Echo'
      api.users.getByName('Echo'),

      // Obtain the user account identified by the specified appName and deviceName
      api.users.getByName('node-hue-api', 'node-hue-api-tests')
    ]);
  })
  .then(users => {
    // Display the details of the users we got back
    console.log(JSON.stringify(users, null, 2));
  })
;
