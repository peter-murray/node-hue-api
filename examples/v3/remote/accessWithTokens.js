'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Values for the ClientId, ClientSecret and AppId from the Hue Remote Application you create in your developer account.
const CLIENT_ID = 'yikTOwdJ6jXHeWeQqXpK0G5GJJPCp5ut'
  , CLIENT_SECRET = 'IzoKWdUTPvJAZxo6'
  ;

// You would retrieve these from where ever you chose to securely store them
const ACCESS_TOKEN = '7L5GSjTGf09TLw2CUGyFXebIAS2G'
  , REFRESH_TOKEN = 'NDd9KanOBkGRRzAnzdNyedpOXFiuG9yG'
  , USERNAME = 'JMyULqPXEo1GSwRqHkStFKNMaPj6d6p7hQdonmpz'
;

const remoteBootstrap = v3.api.createRemote(CLIENT_ID, CLIENT_SECRET);

// The username value is optional, one will be create upon connection if one is not passed in, but this example is
// pretending to be something close to what you would expect to operate like upon a reconnection using previously
// obtained tokens and username.
remoteBootstrap.connectWithTokens(ACCESS_TOKEN, REFRESH_TOKEN, USERNAME)
  .catch(err => {
    console.error('Failed to get a remote connection using existing tokens.');
    console.error(err);
    process.exit(1);
  })
  .then(api => {
    console.log('Successfully connected using the existing OAuth tokens.');

    // Do something on the remote API, like list the lights in the bridge
    return api.lights.getAll()
      .then(lights => {
        console.log('Retrieved the following lights for the bridge over the Remote Hue API:');
        lights.forEach(light => {
          console.log(light.toStringDetailed());
        });
      });
  });

