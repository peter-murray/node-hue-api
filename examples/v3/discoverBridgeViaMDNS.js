'use strict';

const discovery = require('../../dist/cjs').discovery
// If using this code outside of the examples directory, you will want to use the line below and remove the
// const discovery = require('node-hue-api').discovery
;

async function getBridge() {
  const results = await discovery.mdnsSearch();

  // Results will be an array of bridges that were found
  console.log(JSON.stringify(results, null, 2));
}

getBridge();