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

//TODO need to deprecate this part of the API in favour of using createLocal and .connect()
module.exports.create = function (host, username, clientkey, timeout, port) {
  console.error('create() is deprecated, use createRemote(), createLocal() or createInsecureLocal() instead.');

  return module.exports.createLocal(host, port).connect(username, timeout);
};