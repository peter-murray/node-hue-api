'use strict';

const RemoteBootstrap = require('./http/RemoteBootstrap')
  , LocalBootstrap = require('./http/LocalBootstrap')
  , LocalInsecureBootstrap = require('./http/LocalInsecureBootstrap')
;

module.exports.createRemote = function(clientId, clientSecret) {
  return new RemoteBootstrap(clientId, clientSecret);
};

module.exports.createLocal = function(host, port) {
  return new LocalBootstrap(host, port);
};

module.exports.createInsecureLocal = function(host, port) {
  return new LocalInsecureBootstrap(host, port);
};