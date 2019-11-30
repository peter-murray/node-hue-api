'use strict';

const BridgeAction = require('./BridgeAction')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
  , SceneIdPlaceholder = require('../../placeholders/SceneIdPlaceholder')
;


const SCENE_ID = new SceneIdPlaceholder();

const ATTRIBUTES = [
  types.string({name: 'scene'}),
  types.object({name: 'body'}),
  types.object({name: 'state'}),
];


module.exports = class SceneAction extends BridgeAction {

  constructor(scene) {
    super(ATTRIBUTES, 'PUT');

    this.scene = scene;
  }

  get address() {
    return `/scenes/${this.scene}`;
  }

  get scene() {
    return this.getAttributeValue('scene');
  }

  set scene(value) {
    const sceneId = SCENE_ID.getValue({id: value});
    this.setAttributeValue('scene', sceneId);
  }

  withState(data) {
    // Sensor state varies wildly, so just take data here, maybe consider building payloads later on...
    this.setAttributeValue('state', data);
    return this;
  }

  get body() {
    const state = this.getAttributeValue('state');
    if (state) {
      return state;
    }
    throw new ApiError('No state has been set on the SceneAction');
  }
};
