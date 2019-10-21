'use strict';

const v3 = require('../../../index').v3
  , Scene = v3.Scene
  , SceneLightState = v3.lightStates.SceneLightState
;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3
//  , Scene = v3.Scene
//  , SceneLightState = v3.lightstates.SceneLightState
// ;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// This example will getOperator a new scene and then update the LightState for one of the lights.
// You may need to remove this scene later depending on whether or not you wish to have it remain.

v3.discovery.nupnpSearch()
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
  const scene = new Scene();
  scene.name = 'node-hut-api-test-scene';
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
      lightState.on().brightness(100).saturation(100);

      // Now update the light state for one of the lights in the scene
      return api.scenes.updateLightState(sceneId, lightId, lightState);
    });
}