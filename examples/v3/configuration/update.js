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
    // The JSON payload of the configuration value(s) to update
    const valuesToUpdate = {
      'proxyport': 8080
    };

    return api.configuration.update(valuesToUpdate);
  })
  .then(result => {
    // Display the configuration for the Bridge
    console.log(`Updated the bridge configuration? ${result}`);
  })
  .catch(err => {
    // If you attempt to update a value that is not modifiable, an ApiError will be generated
    // the message will indicate that the parameter is not modifiable.
    console.error(err.message)
  })
;
