'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// Set this to an existing scene id
const SCENE_ID = 'yNNiOoRP51G8js5';

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.scenes.getScene(SCENE_ID)
      .then(scene => {
        // Update the desired values of the scene

        // Update the name
        scene.name = 'my-cool-scene';
        // Set update the target lights for an existing LightScene
        scene.lights = [1, 2];
        return api.scenes.updateScene(scene);
      })
  })
  .then(result => {
    console.log(`Updated Scene Attributes? ${JSON.stringify(result)}`);
  })
  .catch(err => {
    if (err.getHueErrorType && err.getHueErrorType() === 3) {
      console.error(`Failed to resolve an existing scene with id:${SCENE_ID}`);
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  })
;
