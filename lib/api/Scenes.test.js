'use strict';

const expect = require('chai').expect
  , HueApi = require('../v3').api
  , discovery = require('../v3').discovery
  , Scene = require('../bridge-model/Scene')
  , SceneLightState = require('../bridge-model/lightstate/SceneLightState')
  , testValues = require('../../test/support/testValues.js')
  , ApiError = require('../ApiError')
;

describe('Hue API #scenes', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        return HueApi.create(searchResults[0].ipaddress, testValues.username)
          .then(api => {
            hue = api;
          });
      });
  });


  describe('#getAll()', () => {

    it('should find some', async () => {
      const results = await hue.scenes.getAll();

      expect(results).to.be.instanceOf(Array);
      expect(results).to.have.length.greaterThan(10);

      expect(results[0]).to.be.instanceOf(Scene);
      expect(results[0]).to.have.property('id');
      expect(results[0]).to.have.property('locked');
      expect(results[0]).to.have.property('name');
      expect(results[0]).to.have.property('owner');
      expect(results[0]).to.have.property('appdata');
    });
  });


  describe('#get()', () => {

    let validSceneId;

    before(async () => {
      const scenes = await hue.scenes.getAll();
      validSceneId = scenes[0].id;
    });

    it('should get a specific scene', async () => {
      const scene = await hue.scenes.get(validSceneId);
      expect(scene).to.be.instanceof(Scene);
    });

    it('should fail for invalid scene id', async () => {
      try {
        await hue.scenes.get('1000001');
        expect.fail('should not get here');
      } catch (err) {
        expect(err).to.be.instanceof(ApiError);
        expect(err.getHueErrorType()).to.equal(3);
      }
    });
  });


  // describe('cleanup', () => {
  //
  //   it('should remove', async () => {
  //     const all = await hue.scenes.getAll()
  //       , toRemove = []
  //     ;
  //
  //     all.forEach(scene => {
  //       // if (!scene.locked && scene.name === 'node-hue-scene-with-transition') {
  //       if (!scene.locked) {
  //         toRemove.push(scene);
  //       }
  //     });
  //
  //     console.log(JSON.stringify(toRemove, null, 2));
  //
  //     // const promises = [];
  //     // toRemove.forEach(scene => {
  //     //   promises.push(hue.scenes.deleteScene(scene.id).then(result => {
  //     //     console.log(`Deleted: ${scene.id}: ${result}`);
  //     //   }));
  //     // });
  //     //
  //     // await Promise.all(promises);
  //   });
  // });


  describe('#deleteScene()', () => {

    let id;

    beforeEach(async () => {
      const scene = new Scene();
      scene.name = 'test-delete';
      scene.lights = [1, 2];

      const result = await hue.scenes.createScene(scene);
      id = result.id;
    });

    it('should remove a scene', async () => {
      const result = await hue.scenes.deleteScene(id);
      expect(result).to.be.true;
    });
  });


  describe('update tests', () => {

    const SCENE_LIGHT_IDS = [1];

    let scene;

    beforeEach(async () => {
      const newScene = new Scene();
      newScene.name = 'testing-update';
      newScene.lights = SCENE_LIGHT_IDS;

      scene = await hue.scenes.createScene(newScene);

    });

    afterEach(async () => {
      if (scene) {
        await hue.scenes.deleteScene(scene.id);
      }
    });


    describe('#updateScene()', () => {

      it('should update an existing scene name', async () => {
        const updatedName = 'testing-update-name'
          , update = new Scene()
        ;
        update.name = updatedName;

        const result = await hue.scenes.update(scene.id, update);
        expect(result).to.have.property('name').to.be.true;

        const updatedScene = await hue.scenes.get(scene.id);
        expect(updatedScene).to.have.property('id').to.equal(scene.id);
        expect(updatedScene).to.have.property('name').to.equal(updatedName);
      });
    });


    describe('#updateLightState()', () => {

      it('should update the lightstate of a light in an existing scene', async () => {
        const state = new SceneLightState().hue(100);

        const result = await hue.scenes.updateLightState(scene.id, SCENE_LIGHT_IDS[0], state);
        expect(result).to.have.property('hue').to.be.true;
      });
    });

  });
});