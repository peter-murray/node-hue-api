'use strict';

const Light = require('./Light');


class OnOffLight extends Light {

  constructor(data, id) {
    super(data, id);
  }
}
module.exports = OnOffLight;