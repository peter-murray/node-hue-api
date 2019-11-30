'use strict';

const v3 = require('../../../index').v3
  , model = v3.model
;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3
//  , model = v3.model
// ;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    const scene = model.createLightScene();
    // Set the name for the Scene
    scene.name = 'my-cool-scene';

    // Set the target lights for the scene, effectively making this LightScene
    scene.lights = [2, 3];

    // Some custom application data for the scene (only relevant to our application)
    scene.appdata = {
      version: 1,
      data: 'my-custom-data'
    };

    return api.scenes.createScene(scene)
      .then(scene => {
        console.log(`Created LightScene\n${scene.toStringDetailed()}`);

        // Now remove the scene we just created
        return api.scenes.deleteScene(scene);
      });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
