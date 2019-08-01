'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;

// Flag indicating whether or not to clean up, i.e. delete the group we create as part of this example
const CLEANUP = true;

// The Id of the group that we will create
let createGroupId = null;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.create(host, USERNAME);
  })
  .then(api => {

    // Create a new group that we can modify the attributes on
    return api.groups.createZone('Testing Group Update Attributes')
      .then(group => {
        // Display the new group
        console.log(group.toStringDetailed());

        // Store the ID so we can later remove it
        createGroupId = group.id;

        // Update the name on the group (can also do 'class' for the room class and 'lights' to update the lights associated with the group)
        return api.groups.updateAttributes(group.id, {name: 'A new name'});
      })
      .then(result => {
        // Display the result of the
        console.log(`Update group attributes? ${result}`);
      })
      .then(() => {
        if (CLEANUP && createGroupId) {
          console.log('Cleaning up and removing group that was created');
          return api.groups.deleteGroup(createGroupId);
        }
      });
  })
  .catch(err => {
    console.error(err);
  })
;