'use strict';

const CommonStates = require('./CommonStates');

module.exports = class GroupState extends CommonStates {

  constructor() {
    super('scene');
  }

  scene(value) {
    return this._setStateValue('scene', value);
  }
};