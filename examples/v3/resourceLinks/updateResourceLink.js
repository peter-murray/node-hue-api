'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const model = v3.model;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

//
// This code will create a new ResourceLink on the bridge associated with the group 0 (all lights group) and then
// modify it before finally removing it from the bridge.
//

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    const resourceLink = model.createResourceLink();
    resourceLink.name = 'API Created ResourceLink';
    resourceLink.description = 'A test resource link for node-hue-api';
    resourceLink.recycle = true;
    resourceLink.classid = 100;
    resourceLink.addLink('groups', 0);

    return api.resourceLinks.createResourceLink(resourceLink)
      .then(createdResourceLink => {
        // Show details of the created ResourceLink
        console.log(`Created ResourceLink:\n${createdResourceLink.toStringDetailed()}`);

        // Modify the name and description on the ResourceLink
        createdResourceLink.name = 'Updated name';
        createdResourceLink.description = 'This ResourceLink has been updated after creation';

        return api.resourceLinks.updateResourceLink(createdResourceLink)
          .then(updateResults => {
            console.log(`\nUpdated ResourceLink id: ${createdResourceLink.id}\nFields updated:\n${JSON.stringify(updateResults, null, 2)}`);

            // Delete the created/updated resource link
            return api.resourceLinks.deleteResourceLink(createdResourceLink);
          });
      });
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
