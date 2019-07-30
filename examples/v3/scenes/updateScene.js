'use strict';

const v3 = require('../../../index').v3
  , Scene = v3.Scene
;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3
//  , Scene = v3.Scene
// ;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// Set this to an existing scene id
const SCENE_ID = 'BW0qV8ys7otEdex';

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.create(host, USERNAME);
  })
  .then(api => {
    // Create a scene with the desired updates
    const updatedScene = new Scene();
    // Update the name
    updatedScene.name = 'my-cool-scene';
    // Set update the target lights for an existing LightScene
    updatedScene.lights = [1, 2];

    return api.scenes.update(SCENE_ID, updatedScene);
  })
  .then(result => {
    console.log(`Updated Scene Attributes? ${JSON.stringify(result)}`);
  })
  .catch(err => {
    if (err.getHueErrorType() === 3) {
      console.error(`Failed to resolve an existing scene with id:${SCENE_ID}`);
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  })
;
