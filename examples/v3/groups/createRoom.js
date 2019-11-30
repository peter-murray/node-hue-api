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
    const newRoom = model.createRoom();
    // The name of the new room we are creating
    newRoom.name = 'Testing Room Creation';
    // The class of the room we are creating, these are specified in the Group documentation under class attribute
    newRoom.class = 'Gym';

    return api.groups.createGroup(newRoom)
      .then(room => {
        console.log(room.toStringDetailed());

        // Delete the new Room
        return api.groups.deleteGroup(room);
      });
  })
  .catch(err => {
    console.error(err);
  })
;