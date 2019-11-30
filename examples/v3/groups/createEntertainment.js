'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const model = v3.model;

// Replace this with your Bridge User name
const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    const entertainment = model.createEntertainment();
    // The name of the new zone we are creating
    entertainment.name =  'Testing Entertainment Creation';
    // The array of light ids that will be in the entertainment group, not all lights can be added, they have to support streaming
    entertainment.lights = [44, 43];
    // The class for the entertainment group, this has to be selected from the valid values, consult the documentation for details
    entertainment.class = 'TV';

    return api.groups.createGroup(entertainment)
      .then(group => {
        console.log(group.toStringDetailed());

        // Delete the new Entertainment Group
        return api.groups.deleteGroup(group);
      });
  })
  .catch(err => {
    console.error(err);
  })
;