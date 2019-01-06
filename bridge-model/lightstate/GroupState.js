'use strict';

const CommonStates = require('./CommonStates');

module.exports = class GroupState extends CommonStates {

  constructor() {
    super('scene');
  }

  scene(name) {
    return this._setStateValue('scene', name);
  }
};