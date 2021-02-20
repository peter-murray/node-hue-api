import { ApiDefinition } from './http/ApiDefinition';
import { scenesApi } from './http/endpoints/scenes';
import { SceneIdPlaceholder } from './placeholders/SceneIdPlaceholder';
import { model } from '@peter-murray/hue-bridge-model';
import { KeyValueType } from '../commonTypes';
import { Api } from './Api';

type LightScene = model.LightScene
type GroupScene = model.GroupScene
type SceneState = model.SceneLightState
type Light = model.Light
type SceneType = LightScene | GroupScene;
type SceneId = string | LightScene | GroupScene;
type LightId = number | Light

const SCENE_ID_PLACEHOLDER = new SceneIdPlaceholder();

export class Scenes extends ApiDefinition {

  constructor(hueApi: Api) {
    super(hueApi);
  }

  getAll(): Promise<SceneType[]> {
    return this.execute(scenesApi.getAll);
  }

  // /**
  //  * @deprecated since 4.x use getScene(id) instead.
  //  */
  // get(id) {
  //   util.deprecatedFunction('5.x', 'scenes.get(id)', 'Use scenes.getScene(id) instead.');
  //   return this.getScene(id);
  // }

  getScene(id: SceneId): Promise<SceneType> {
    return this.execute(scenesApi.getScene, {id: id});
  }

  // /**
  //  * @deprecated since 4.x use getSceneByName(name) instead.
  //  */
  // getByName(name) {
  //   util.deprecatedFunction('5.x', 'scenes.getByName(name)', 'Use scenes.getSceneByName(name) instead.');
  //   return this.getSceneByName(name);
  // }

  getSceneByName(name: string): Promise<SceneType[]> {
    return this.getAll().then((allScenes: SceneType[]) => {
      return allScenes.filter(scene => scene.name === name);
    });
  }

  createScene(scene: SceneType): Promise<SceneType> {
    const self = this;

    return this.execute(scenesApi.createScene, {scene: scene})
      .then(data => {
        return self.getScene(data.id);
      });
  }

  // /**
  //  * @deprecated since 4.x use updateScene(scene) instead.
  //  */
  // update(id, scene) {
  //   util.deprecatedFunction('5.x', 'scenes.update(id, scene)', 'Use scenes.updateScene(scene) instead.');
  //   return this.execute(scenesApi.updateScene, {id: id, scene: scene});
  // }

  updateScene(scene: SceneType): Promise<KeyValueType> {
    return this.execute(scenesApi.updateScene, {id: scene, scene: scene});
  }

  /**
   * Updates the light state for a specific light in the scene
   */
  updateLightState(id: SceneId, lightId: LightId, sceneLightState: SceneState): Promise<KeyValueType> {
    return this.execute(scenesApi.updateSceneLightState, {id: id, lightStateId: lightId, lightState: sceneLightState});
  }

  deleteScene(id: SceneId): Promise<boolean> {
    return this.execute(scenesApi.deleteScene, {id: id});
  }

  activateScene(id: SceneId): Promise<boolean> {
    // Scene activation is done as an intersection of setting a group light state to a scene id, the intersection of the
    // scene light ids and that of the group is the lights that are targeted to change.

    const sceneId = SCENE_ID_PLACEHOLDER.getValue({id: id});

    // We target the all lights group here, so that all the lights in the scene are targeted.
    return this.hueApi.groups.setGroupState(0, new model.GroupState().scene(sceneId));
  }
}