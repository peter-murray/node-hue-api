'use strict';

const v3 = require('../../../dist/cjs/v3').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Values for the ClientId, ClientSecret and AppId from the Hue Remote Application you create in your developer account.
const CLIENT_ID = 'iiY946HrYrrAz0JdW9RLjtLG5ZB1yeIW'
  , CLIENT_SECRET = 'OSaOkbM8fVFaZXUx'
  , APP_ID = 'node-hue-api'
  ;

// A state value you can use to validate the Callback URL results with, it should not really be hardcoded, but should
// be dynamically generated.
const STATE = '1209fwefwi33-1293r203rwe8h';


// Replace this with your authorization code that you get from the Callback URL for your Hue Remote API Application.
// If you do not fill this value in, the code will give you the URL to start the process for generating this value.
const authorizationCode = undefined;

const remoteBootstrap = v3.api.createRemote(CLIENT_ID, CLIENT_SECRET);

if (! authorizationCode) {
  console.log('***********************************************************************************************');
  console.log(`You need to generate an authorization code for your application using this URL:`);
  console.log(`${remoteBootstrap.getAuthCodeUrl('node-hue-api-remote', APP_ID, STATE)}`);
  console.log('***********************************************************************************************');
} else {
  // Exchange the code for tokens and connect to the Remote Hue API
  remoteBootstrap.connectWithCode(authorizationCode)
    .catch(err => {
      console.error('Failed to get a remote connection using authorization code.');
      console.error(err);
      process.exit(1);
    })
    .then(api => {
      console.log('Successfully validated authorization code and exchanged for tokens');

      const remoteCredentials = api.remote.getRemoteAccessCredentials();

      // Display the tokens and username that we now have from using the authorization code. These need to be stored
      // for future use.
      console.log(`Remote API Access Credentials:\n ${JSON.stringify(remoteCredentials, null, 2)}\n`);
      console.log(`The Access Token is valid until:  ${new Date(remoteCredentials.tokens.access.expiresAt)}`);
      console.log(`The Refresh Token is valid until: ${new Date(remoteCredentials.tokens.refresh.expiresAt)}`);
      console.log('\nNote: You should securely store the tokens and username from above as you can use them to connect\n'
        + 'in the future.');

      // Do something on the remote API, like list the lights
      return api.lights.getAll()
        .then(lights => {
          console.log('Retrieved the following lights for the bridge over the Remote Hue API');
          lights.forEach(light => {
            console.log(light.toStringDetailed());
          })
        });
    });
}
