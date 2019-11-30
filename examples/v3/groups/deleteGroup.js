'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = require('../../../test/support/testValues').username;


v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {

    //TODO remove
    // return api.groups.getByName('Custom group for $lights')
    //   .then(groups => {
    //     const promises = [];
    //
    //     groups.forEach(group => {
    //       promises.push(api.groups.deleteGroup(group.id));
    //     });
    //     return  Promise.all(promises);
    //   })

    // Create a new group that we can then delete
    return api.groups.createZone('Testing Group Deletion')
      .then(group => {
        // Display the new group
        console.log(group.toStringDetailed());

        // Delete the group we just created
        return api.groups.deleteGroup(group.id);
      });
  })
  .then(result => {
    console.log(`Deleted group? ${result}`);
  })
  .catch(err => {
    console.error(err);
  })
;