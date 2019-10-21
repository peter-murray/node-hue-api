'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// The user to remove from the bridge
const USER_TO_DELETE = '40000493-d94d-45f3-b122-aa865ae3a5a0';

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.users.deleteUser(USER_TO_DELETE);
  })
  .then(deleted => {
    // Display the details of the deletion attempt
    console.log(JSON.stringify(deleted, null, 2));
  })
  .catch(err => {
    console.error(err);
  })
;
