'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.create(host, USERNAME);
  })
  .then(api => {

    // The name of the new room we are creating
    const roomName = 'Testing Room Creation'

      // The array of light ids that will be in the group
      , roomLights = []

      // The class of the room we are creating, these are specified in the Group documentation under class attribute
      , roomClass = 'Gym'
      ;

    return api.groups.createRoom(roomName, roomLights, roomClass);
  })
  .then(room => {
    console.log(room.toStringDetailed());
  })
;