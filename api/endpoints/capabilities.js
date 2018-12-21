'use strict';

const ApiEndpoint = require('./endpoint')
;

function getAllCapabilities() {
  return new ApiEndpoint()
      .get()
      .acceptJson()
      .uri('/api/<username>/capabilities')
      .pureJson()
      ;
}

module.exports = {
  getAll: getAllCapabilities()
};