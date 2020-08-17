'use strict';

const Sensor = require('./Sensor')
  , types = require('../../types')
;

const CONFIG_ATTRIBUTES = [
    types.boolean({name: 'reachable'}),
  ]
  , STATE_ATTRIBUTES = [
    types.boolean({name: 'presence'})
  ]
;

module.exports = class Daylight extends Sensor {

  constructor(id) {
    super( CONFIG_ATTRIBUTES, STATE_ATTRIBUTES, id);
  }

  get presence() {
    return this.getStateAttributeValue('presence');
  }
};