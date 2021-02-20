'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// The Schedule name to retrieve from the bridge
const SCHEDULE_NAME = 'Bedroom Switch';

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.schedules.getScheduleByName(SCHEDULE_NAME);
  })
  .then(schedules => {
    // Display the details of the schedules we got back
    console.log(`Schedules from the Bridge that match the name: "${SCHEDULE_NAME}"\n`);
    schedules.forEach(schedule => {
      console.log(schedule.toStringDetailed());
    });
  })
  .catch(err => {
    console.error(`Unexpected error: ${err.message}`);
  })
;
