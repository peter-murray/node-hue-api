'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// Set this to the id of the scene to remove from the bridge
const SCENE_ID_TO_DELETE = 'abc100';

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.scenes.deleteScene(SCENE_ID_TO_DELETE);
  })
  .then(result => {
    console.log(`Scene was successfully deleted? ${result}`);
  })
  .catch(err => {
    if (err.getHueErrorType() === 3) {
      console.log(`Scene with id:${SCENE_ID_TO_DELETE} was not found`);
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  })
;
