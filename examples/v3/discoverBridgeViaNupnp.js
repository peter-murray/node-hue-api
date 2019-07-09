'use strict';

const v3 = require('../../index').v3
;

// For this to work properly you need to be connected to the same network that the Hue Bridge is running on.
// It will not function across VLANs or different network ranges.

async function getBridge() {
  const results = await v3.discovery.nupnpSearch();

  // Results will be an array of bridges that were found
  console.log(JSON.stringify(results, null, 2));
}

getBridge();