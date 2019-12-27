'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;

// Set this to the desired Rule name to retrieve from the bridge
const RULE_NAME = 'Tap 2.1 Default';

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.rules.getRuleByName(RULE_NAME);
  })
  .then(rules => {
    // Print the details for the Rules found
    rules.forEach(rule => {
      console.log(rule.toStringDetailed());
    });
  })
;