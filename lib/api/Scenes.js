'use strict';

const scenesApi = require('./http/endpoints/scenes')
  , ApiDefinition = require('./http/ApiDefinition')
  , GroupLightState = require('../model/lightstate/GroupState')
;

module.exports = class Scenes extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll() {
    return this.execute(scenesApi.getAll);
  }

  getByName(name) {
    return this.getAll().then(allScenes => {
      return allScenes.filter(scene => scene.name === name);
    });
  }

  createScene(scene) {
    const self = this;

    return this.execute(scenesApi.createScene, {scene: scene})
      .then(data => {
        return self.get(data.id);
      });
  }

  get(id) {
    return this.execute(scenesApi.getScene, {id: id});
  }

  update(id, scene) {
    return this.execute(scenesApi.updateScene, {id: id, scene: scene});
  }

  updateLightState(id, lightId, sceneLightState) {
    return this.execute(scenesApi.updateSceneLightState, {id: id, lightStateId: lightId, lightState: sceneLightState});
  }

  deleteScene(id) {
    return this.execute(scenesApi.deleteScene, {id: id});
  }

  activateScene(id) {
    // Scene activation is done as an intersection of setting a group light state to a scene id, the intersection of the
    // scene light ids and that of the group is the lights that are targeted to change.
    //
    // We target the all lights group here, so that all the lights in the scene are targeted.
    return this.hueApi.groups.setGroupState(0, new GroupLightState().scene(id));
  }
};