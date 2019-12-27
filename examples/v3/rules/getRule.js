'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;

// Set this to the desired Rule ID to retrieve from the bridge
const RULE_ID = 1;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.rules.getRule(RULE_ID);
  })
  .then(rule => {
    // Print the details for the Rule
    console.log(rule.toStringDetailed());
  })
;