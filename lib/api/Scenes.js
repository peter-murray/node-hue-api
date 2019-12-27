'use strict';

const scenesApi = require('./http/endpoints/scenes')
  , ApiDefinition = require('./http/ApiDefinition')
  , GroupLightState = require('../model/lightstate/GroupState')
  , model = require('../model')
  , util = require('../util')
;
/**
 * @typedef {import('../model/scenes/LightScene')} LightScene
 * @typedef {import('../model/scenes/GroupScene')} GroupScene
 *
 * @type {Scenes}
 */
module.exports = class Scenes extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  /**
   * @returns {Promise<(LightScene | GroupScene)[]>}
   */
  getAll() {
    return this.execute(scenesApi.getAll);
  }

  /**
   * @deprecated since 4.x use getScene(id) instead.
   */
  get(id) {
    util.deprecatedFunction('5.x', 'scenes.get(id)', 'Use scenes.getScene(id) instead.');
    return this.getScene(id);
  }

  /**
   * @param id {string | LightScene | GroupScene}
   * @returns {Promise<LightScene | GroupScene>}
   */
  getScene(id) {
    return this.execute(scenesApi.getScene, {id: id});
  }

  /**
   * @deprecated since 4.x use getSceneByName(name) instead.
   */
  getByName(name) {
    util.deprecatedFunction('5.x', 'scenes.getByName(name)', 'Use scenes.getSceneByName(name) instead.');
    return this.getSceneByName(name);
  }

  /**
   * Obtains the scenes that have the specified name from the bridge.
   * @param name {string}
   * @returns {Promise<(LightScene | GroupScene)[]>}
   */
  getSceneByName(name) {
    return this.getAll().then(allScenes => {
      return allScenes.filter(scene => scene.name === name);
    });
  }

  /**
   * @param scene {LightScene | GroupScene}
   * @returns {Promise<(LightScene | GroupScene)>}
   */
  createScene(scene) {
    const self = this;

    return this.execute(scenesApi.createScene, {scene: scene})
      .then(data => {
        return self.getScene(data.id);
      });
  }

  /**
   * @deprecated since 4.x use updateScene(scene) instead.
   */
  update(id, scene) {
    util.deprecatedFunction('5.x', 'scenes.update(id, scene)', 'Use scenes.updateScene(scene) instead.');
    return this.execute(scenesApi.updateScene, {id: id, scene: scene});
  }

  /**
   * @param scene {LightScene | GroupScene}
   * @returns {Promise<Object>}
   */
  updateScene(scene) {
    return this.execute(scenesApi.updateScene, {id: scene, scene: scene});
  }

  /**
   * Updates the light state for a specific light in the scene
   * @param id {string | LightScene | GroupScene}
   * @param lightId {int | Light}
   * @param sceneLightState {SceneLightState}
   * @returns {Promise<object>}
   */
  updateLightState(id, lightId, sceneLightState) {
    return this.execute(scenesApi.updateSceneLightState, {id: id, lightStateId: lightId, lightState: sceneLightState});
  }

  /**
   * @param id {string | Scene}
   * @returns {Promise<boolean>}
   */
  deleteScene(id) {
    return this.execute(scenesApi.deleteScene, {id: id});
  }

  /**
   * @param id {string | LightScene | GroupScene}
   * @returns {Promise<boolean>}
   */
  activateScene(id) {
    // Scene activation is done as an intersection of setting a group light state to a scene id, the intersection of the
    // scene light ids and that of the group is the lights that are targeted to change.

    let sceneId = id;
    if (model.isSceneInstance(id)) {
      sceneId = id.id;
    }

    // We target the all lights group here, so that all the lights in the scene are targeted.
    return this.hueApi.groups.setGroupState(0, new GroupLightState().scene(sceneId));
  }
};