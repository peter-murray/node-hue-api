'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
  , SceneLightState = v3.lightStates.SceneLightState
;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// This example will getOperator a new scene and then update the LightState for one of the lights.
// You may need to remove this scene later depending on whether or not you wish to have it remain.

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return createSceneThenUpdateLightState(api);
  })
  .then(result => {
    console.log(`Updated Scene LightState?\n${JSON.stringify(result, null, 2)}`);
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;


function createSceneThenUpdateLightState(api) {
  const scene = v3.model.createLightScene();
  scene.name = 'node-hue-api-test-scene';
  scene.lights = [1];
  // Allow the Bridge to delete this scene
  scene.recycle = true;

  // Create the new scene we are going to update the light state on
  return api.scenes.createScene(scene)
    .then(result => {
      console.log(`Created new scene with id: ${result.id}`);

      const lightId = 1
        , sceneId = result.id
        , lightState = new SceneLightState()
      ;

      // Craft the parameters of the desired light state for the scene
      lightState.on().brightness(100);

      // Now update the light state for one of the lights in the scene
      return api.scenes.updateLightState(sceneId, lightId, lightState);
    });
}