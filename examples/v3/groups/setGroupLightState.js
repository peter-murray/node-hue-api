'use strict';

const v3 = require('../../../index').v3
  , GroupLightState = v3.lightStates.GroupLightState
;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;

// The target Group id that we will set the light state on. Using the all groups group here as that will always be present.
const GROUP_ID = 0;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Build a desired light state for the group
    const groupState = new GroupLightState()
      .on()
      .brightness(20)
      .saturation(50)
    ;

    return api.groups.setGroupState(GROUP_ID, groupState);
  })
  .then(result => {
    console.log(`Successfully set group light state? ${result}`);
  })
  .catch(err => {
    console.error(err);
  })
;