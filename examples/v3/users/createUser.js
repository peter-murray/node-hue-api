'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const APPLICATION_NAME = 'node-hue-api'
  , DEVICE_NAME = 'my-device'
;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host);
  })
  .then(api => {
    return api.users.createUser(APPLICATION_NAME, DEVICE_NAME);
  })
  .then(createdUser => {
    // Display the details of user we just created (username and clientkey)
    console.log(JSON.stringify(createdUser, null, 2));
  })
  .catch(err => {
    if (err.getHueErrorType() === 101) {
      console.error('You need to press the Link Button on the bridge first');
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  })
;
