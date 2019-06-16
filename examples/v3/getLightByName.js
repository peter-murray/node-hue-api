'use strict';

const hue = require('../../index').hue
  , testConfig = require('../../test/support/testValues')
;

// Load the Hue Bridge API for the desired bridge and username
async function getApi() {
  const host = testConfig.host
    , username = testConfig.username
  ;

  return await hue.create(host, username);
}

async function getLight(name) {
  const api = await getApi();

  // Obtain the light using the name provided
  const light = await api.lights.getLightByName(name);

  // Display the details of the light object we got back
  console.log(light.toStringDetailed());

  const allLights = await api.lights.getAll();
  console.log(JSON.stringify(allLights, null, 2));
}

// Get a specific light
getLight('Office Desk Right');