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
    //
    // Create a new Schedule that we will then update in a subsequent call (so that we do not mess with any existing
    // schedules in the bridge).
    // Finally once finished, we will remove the schedule from the bridge
    //

    const schedule = model.createSchedule();
    schedule.name = 'Test Schedule';
    schedule.description = 'A test schedule from the node-hue-api examples';
    schedule.recycle = true;
    schedule.localtime = model.timePatterns.createTimer().hours(1);
    schedule.command = model.actions.group(0).withState(new model.lightStates.GroupLightState().off());

    return api.schedules.createSchedule(schedule)
      .then(created => {
        console.log(`\nCreated schedule in the bridge: ${created.id}`);
        console.log(created.toStringDetailed());
        return created;
      })
      .then(created => {
        // Now update the localtime of the schedule to trigger in 2 hours and 30 minutes
        created.localtime = model.timePatterns.createTimer().hours(2).minutes(30);

        return api.schedules.updateSchedule(created)
          .then(updatedAttributes => {
            console.log('\nUpdated Schedule Attributes:');
            console.log(JSON.stringify(updatedAttributes, null, 2));

            // Get the details of the updated schedule
            return api.schedules.get(created);
          });
      })
      .then(updatedSchedule => {
        // Displaying the details of the updated schedule

        console.log(`\nAttributes of the Updated Schedule:`);
        console.log(updatedSchedule.toStringDetailed());

        return updatedSchedule;
      })
      .then(scheduleToRemove => {
        // Now remove the scene we just created
        return api.schedules.deleteSchedule(scheduleToRemove);
      });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
