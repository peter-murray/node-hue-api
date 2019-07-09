'use strict';

const v3 = require('../../index').v3
;

async function getBridge() {
  const results = await v3.discovery.upnpSearch();

  // Results will be an array of bridges that were found
  console.log(JSON.stringify(results, null, 2));
}

getBridge();