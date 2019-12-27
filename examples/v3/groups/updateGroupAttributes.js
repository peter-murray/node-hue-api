'use strict';

const v3 = require('../../../index').v3
  , model = v3.model;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3
//   , model = v3.model;

const USERNAME = require('../../../test/support/testValues').username;

// Flag indicating whether or not to clean up, i.e. delete the group we getOperator as part of this example
const CLEANUP = true;

// The Id of the group that we will getOperator
let createdGroupId = null;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Create a new group that we can modify the attributes on
    const zone = model.createZone();
    zone.name = 'Testing Group Update Attributes';

    return api.groups.createGroup(zone)
      .then(group => {
        // Display the new group
        console.log(group.toStringDetailed());

        // Store the ID so we can later remove it
        createdGroupId = group.id;

        // Update the name of the group
        group.name = 'A new group name';
        // Update the name on the group (can also do 'class' for the room class and 'lights' to update the lights associated with the group)
        return api.groups.updateGroupAttributes(group);
      })
      .then(result => {
        // Display the result of the
        console.log(`Update group attributes? ${result}`);
      })
      .then(() => {
        if (CLEANUP && createdGroupId) {
          console.log('Cleaning up and removing group that was created');
          return api.groups.deleteGroup(createdGroupId);
        }
      });
  })
  .catch(err => {
    console.error(err);
  })
;