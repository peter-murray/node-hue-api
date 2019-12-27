'use strict';

const v3 = require('../../../index').v3
  , model = v3.model
;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3
//  , model = v3.model
// ;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    const schedule = model.createSchedule();

    // Set the attributes of the Schedule
    schedule.name = 'Test Schedule';
    schedule.description = 'A test schedule from the node-hue-api examples';
    schedule.recycle = true;
    // trigger the schedule in 1 hour from now
    schedule.localtime = model.timePatterns.createTimer().hours(1);
    // Turn all the lights off (using light group 0 for all lights)
    schedule.command = model.actions.group(0).withState(new model.lightStates.GroupLightState().off());

    return api.schedules.createSchedule(schedule)
      .then(created => {
        console.log(`Created schedule in the bridge: ${created.id}`);
        console.log(created.toStringDetailed());

        // Now remove the scene we just created
        return api.schedules.deleteSchedule(created);
      });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
