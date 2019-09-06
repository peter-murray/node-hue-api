'use strict';

const scenesApi = require('./http/endpoints/scenes')
  , ApiDefinition = require('./http/ApiDefinition')
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
      return allScenes.filter(scene => {return scene.name === name;});
    });
  }

  createScene(scene) {
    return this.execute(scenesApi.createScene, {scene: scene});
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
};