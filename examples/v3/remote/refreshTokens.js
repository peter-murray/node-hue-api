'use strict';

const v3 = require('../../../dist/cjs/v3').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Values for the ClientId, ClientSecret and AppId from the Hue Remote Application you create in your developer account.
const APP_ID = 'node-hue-api';

const REMOTE_ACCESS_CREDENTIALS = {
  clientId: "iiY946HrYrrAz0JdW9RLjtLG5ZB1yeIW",
  clientSecret: "OSaOkbM8fVFaZXUx",
  username: "9Xwl2i8KkEk9Qp2yjYsJIGPDNihQqXBZXOC60MYa",
  tokens: {
    access: {
      value: "DAGDLjhx4BEPvrbUjXEBvtlpcMUD",
      expiresAt: 1627897738389
    },
    refresh: {
      value: "4mEPZpc2s5q0xAOjpzoweOl2VULRvTfl",
      expiresAt: 1636969738389
    }
  }
}

const remoteBootstrap = v3.api.createRemote(REMOTE_ACCESS_CREDENTIALS.clientId, REMOTE_ACCESS_CREDENTIALS.clientSecret);

remoteBootstrap.connectWithTokens(
    REMOTE_ACCESS_CREDENTIALS.tokens.access.value,
    REMOTE_ACCESS_CREDENTIALS.tokens.refresh.value
  )
  .catch(err => {
    console.error('Failed to get a remote connection using authorization code.');
    console.error(err);
    process.exit(1);
  })
  .then(api => {
    // Do something on the remote API, like list the lights
    return api.lights.getAll()
      .then(lights => {
        console.log(`Retrieved ${lights.length} lights`);
        return api;
      });
  })
  .then(api => {
    api.remote.refreshTokens()
      .then(refreshedTokens => {
        console.log(`Refreshed Tokens: ${JSON.stringify(refreshedTokens)}`);
      })
  });
