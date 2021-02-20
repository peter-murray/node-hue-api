'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

// Set this to the desired name of the scenes to get
const SCENE_NAME = 'Concentrate';

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.scenes.getSceneByName(SCENE_NAME);
  })
  .then(scenes => {
    // Do something useful with the Scenes
    console.log(`Matched ${scenes.length} scenes with name '${SCENE_NAME}'`);
    scenes.forEach(scene => {
      console.log(scene.toStringDetailed());
    });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
