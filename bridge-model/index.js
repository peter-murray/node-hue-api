'use strict';

const lightBuilder = require('./devices');


function buildLight(id, data) {
  return lightBuilder.create(data, id);
}

module.exports.buildLight = buildLight;