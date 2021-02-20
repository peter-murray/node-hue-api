'use strict';

const discovery = require('../../dist/cjs').discovery
// If using this code outside of the examples directory, you will want to use the line below and remove the
// const discovery = require('node-hue-api').discovery
;

// For this to work properly you need to be connected to the same network that the Hue Bridge is running on.
// It will not function across VLANs or different network ranges.

async function getBridge() {
  try {
    const results = await discovery.nupnpSearch();

    // Results will be an array of bridges that were found
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.log(`Failure with n-UPnP search: ${err.message}`)
  }
}

getBridge();