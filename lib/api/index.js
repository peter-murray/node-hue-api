'use strict';

const RemoteBootstrap = require('./http/RemoteBootstrap')
  , LocalBootstrap = require('./http/LocalBootstrap')
  , LocalInsecureBootstrap = require('./http/LocalInsecureBootstrap')
;


/**
 * Creates a remote bootstrap to connect with a Hue bridge remotely
 * @param {String} clientId The OAuth client id for your application.
 * @param {String} clientSecret The OAuth client secret for your application.
 * @returns {RemoteBootstrap}
 */
module.exports.createRemote = function(clientId, clientSecret) {
  return new RemoteBootstrap(clientId, clientSecret);
};

/**
 * Creates a local network bootstrap to connect with Hue bridge on a local network.
 * @param {String} host The IP Address or FQDN of the he bridge you are connecting to.
 * @param {number=} port The port number to connect to, optional.
 * @returns {LocalBootstrap}
 */
module.exports.createLocal = function(host, port) {
  return new LocalBootstrap(host, port);
};

/**
 * Creates a local network bootstrap over an insecure HTTP connection.
 * @param {String} host The IP Address or FQDN of the he bridge you are connecting to.
 * @param {number=} port The port number to connect to, optional.
 * @returns {LocalInsecureBootstrap}
 */
module.exports.createInsecureLocal = function(host, port) {
  return new LocalInsecureBootstrap(host, port);
};