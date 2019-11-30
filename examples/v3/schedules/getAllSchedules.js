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
    return api.schedules.getAll();
  })
  .then(allSchedules => {
    // Display the details of the schedules we got back
    allSchedules.forEach(schedule => {
      console.log(schedule.toStringDetailed());
    });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
