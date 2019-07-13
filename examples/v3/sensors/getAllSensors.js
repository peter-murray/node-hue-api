'use strict';

const v3 = require('../../../index').v3
  , testConfig = require('../../../test/support/testValues')
;

const USERNAME = testConfig.username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.create(host, USERNAME);
  })
  .then(api => {
    return api.sensors.getAll();
  })
  .then(allSensors => {
    // Display the details of the sensors we got back
    console.log(JSON.stringify(allSensors, null, 2));
  })
;
