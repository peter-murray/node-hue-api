'use strict';

const request = require('./http/request')
  , Api = require('./Api')
;

module.exports.create = function (host, username, timeout, port) {
  const config = {
    protocol: 'https',
    hostname: host,
    username: username,
    timeout: timeout || 10000,
    port: port || 443
  };

  return request.create(config)
    .then(request => {
      return new Api(config, request);
    });
};