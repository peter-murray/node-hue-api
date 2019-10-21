'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {

    const promises = [];

    // Get and display Light Groups
    promises.push(
      api.groups.getLightGroups()
        .then(displayGroups('LightGroups'))
    );

    // Get and display Luminaires
    promises.push(
      api.groups.getLuminaires()
        .then(displayGroups('LightGroups'))
    );

    // Get and display LightSources
    promises.push(
      api.groups.getLightSources()
        .then(displayGroups('LightSources'))
    );

    // Get and display Rooms
    promises.push(
      api.groups.getRooms()
        .then(displayGroups('Rooms'))
    );

    // Get and display Zones
    promises.push(
      api.groups.getZones()
        .then(displayGroups('Zones'))
    );

    // Get and display Entertainment
    promises.push(
      api.groups.getEntertainment()
        .then(displayGroups('Entertainment'))
    );

    return Promise.all(promises);
  })
;


function displayGroups(type) {
  return function (groups) {
    console.log('*************************************************************');
    console.log(`Group Type: ${type}`);
    if (groups && groups.length > 0) {
      groups.forEach(group => {
        console.log(group.toStringDetailed());
      });
    } else {
      console.log('No matching groups in Hue Bridge');
    }
    console.log('*************************************************************');
  };
}