'use strict';

const discovery = require('../../index').discovery
;

async function getBridge() {
  const results = await discovery.upnpSearch();

  // Results will be an array of bridges that were found
  console.log(JSON.stringify(results, null, 2));
}

getBridge();