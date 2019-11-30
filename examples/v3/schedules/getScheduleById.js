'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// The Schedule id to get from the bridge
const SCHEDULE_ID = 1;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.schedules.get(SCHEDULE_ID);
  })
  .then(schedule => {
    // Display the details of the schedules we got back
    console.log(schedule.toStringDetailed());
  })
  .catch(err => {
    console.error(`Unexpected error: ${err.message}`);
  })
;
