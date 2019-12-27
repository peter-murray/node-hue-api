'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const model = v3.model;

// Replace this with your Bridge User name
const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    const newGroup = model.createLightGroup();
    // The name of the new group to create
    newGroup.name = 'My New Group';
    // The array of light ids that will be in the group
    newGroup.lights = [2];

    return api.groups.createGroup(newGroup)
      .then(group => {
        console.log(group.toStringDetailed());

        // Delete the new Group
        return api.groups.deleteGroup(group);
      });
  })
  .catch(err => {
    console.error(err);
  })
;