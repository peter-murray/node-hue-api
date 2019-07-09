'use strict';

const v3 = require('../../index').v3
  , testConfig = require('../../test/support/testValues')
;

// Load the Hue Bridge API for the desired bridge and username
async function getApi() {
  const searchResults = await v3.discovery.nupnpSearch()
    , host = searchResults[0].ipaddress
    , username = testConfig.username
  ;

  return await v3.hue.create(host, username);
}

// Load all the lights from the bridge
async function getAllLights() {
  const api = await getApi();

  // Obtain the light using the name provided
  const lights = await api.lights.getAll();

  // Display the details of the lights we got back
  console.log(JSON.stringify(lights, null, 2));
}

// Obtain all the lights in the bridge
getAllLights();