'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

const USERNAME = require('../../../test/support/testValues').username;

// Set this to the desired Rule name to retrieve from the bridge
const RULE_NAME = 'Tap 2.1 Default';

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.rules.getRuleByName(RULE_NAME);
  })
  .then(rules => {
    // Print the details for the Rules found

    if (rules && rules.length > 0) {
      rules.forEach(rule => {
        console.log(rule.toStringDetailed());
      });
    } else {
      console.log(`Failed to find any rules for name '${RULE_NAME}'.`);
    }
  })
;