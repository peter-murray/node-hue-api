'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , model = require('../model')
  , SceneLightState = require('../model/lightstate/SceneLightState')
  , testValues = require('../../test/support/testValues.js')
  , ApiError = require('../ApiError')
;

describe('Hue API #scenes', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        const localApi = v3Api.createLocal(searchResults[0].ipaddress);
        return localApi.connect(testValues.username)
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

      const scene = results[0];
      expect(model.isSceneInstance(scene)).to.be.true;
    });
  });


  describe('#getScene()', () => {

    let targetScene;

    before(async () => {
      const scenes = await hue.scenes.getAll();
      targetScene = scenes[0];
    });

    it('should get a specific scene', async () => {
      const scene = await hue.scenes.getScene(targetScene);

      expect(model.isSceneInstance(scene)).to.be.true;
      expect(scene).to.have.property('id').to.equal(targetScene.id);
      expect(scene).to.have.property('type').to.equal(targetScene.type);
    });

    it('should fail for invalid scene id', async () => {
      try {
        await hue.scenes.getScene('1000001');
        expect.fail('should not get here');
      } catch (err) {
        expect(err).to.be.instanceof(ApiError);
        expect(err.getHueErrorType()).to.equal(3);
      }
    });
  });


  describe('getByName / getSceneByName', () => {

    let validSceneName;

    before(async () => {
      const scenes = await hue.scenes.getAll();
      validSceneName = scenes[0].name;
    });

    describe('#getByName()', () => {

      it('should get a specific scene', async () => {
        const results = await hue.scenes.getByName(validSceneName);

        expect(results).to.be.instanceof(Array);
        expect(results).to.have.length(1);
        expect(results[0]).to.have.property('name').to.equal(validSceneName);
      });
    });

    describe('#getSceneByName()', () => {

      it('should get a specific scene', async () => {
        const results = await hue.scenes.getSceneByName(validSceneName);

        expect(results).to.be.instanceof(Array);
        expect(results).to.have.length(1);
        expect(results[0]).to.have.property('name').to.equal(validSceneName);
      });

      it('should fail to find for invalid scene name', async () => {
        const result = await hue.scenes.getSceneByName('saldkfnlesfh');
        expect(result).to.be.instanceof(Array);
        expect(result).to.have.length(0);
      });
    });
  });


  describe('#deleteScene()', () => {

    let scene;

    beforeEach(async () => {
      const newScene = model.createLightScene();
      newScene.name = 'test-delete';
      newScene.lights = [2];

      scene = await hue.scenes.createScene(newScene);
    });

    afterEach(async () => {
      if (scene) {
        try {
          const existing = await hue.scenes.getScene(scene);
          await hue.scenes.deleteScene(existing);
        } catch (err) {
          // Do nothing
        }
      }
    });

    it('should remove a scene using id', async () => {
      const result = await hue.scenes.deleteScene(scene.id);
      expect(result).to.be.true;
    });

    it('should remove a scene using Scene object', async () => {
      const result = await hue.scenes.deleteScene(scene);
      expect(result).to.be.true;
    });
  });


  describe('update tests', () => {

    const SCENE_LIGHT_IDS = [2];

    let scene;

    beforeEach(async () => {
      const newScene = model.createLightScene();
      newScene.name = 'testing-update';
      newScene.lights = SCENE_LIGHT_IDS;

      scene = await hue.scenes.createScene(newScene);
    });

    afterEach(async () => {
      if (scene) {
        await hue.scenes.deleteScene(scene);
      }
    });


    describe('#update()', () => {

      it('should update an existing scene name', async () => {
        const updatedName = 'testing-update-name';
        scene.name = updatedName;

        const result = await hue.scenes.update(scene.id, scene);
        expect(result).to.have.property('name').to.be.true;

        const updatedScene = await hue.scenes.getScene(scene.id);
        expect(updatedScene).to.have.property('id').to.equal(scene.id);
        expect(updatedScene).to.have.property('name').to.equal(updatedName);
      });
    });

    describe('#updateScene()', () => {

      it('should update an existing scene name', async () => {
        const updatedName = 'testing-update-name';
        scene.name = updatedName;

        const result = await hue.scenes.updateScene(scene);
        expect(result).to.have.property('name').to.be.true;

        const updatedScene = await hue.scenes.getScene(scene.id);
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


  describe('#activateScene()', () => {

    const SCENE_LIGHT_IDS = [2];

    let scene;

    beforeEach(async () => {
      const newScene = model.createLightScene();
      newScene.name = 'testing-update';
      newScene.lights = SCENE_LIGHT_IDS;

      scene = await hue.scenes.createScene(newScene);
    });

    afterEach(async () => {
      if (scene) {
        await hue.scenes.deleteScene(scene.id);
      }
    });


    it('should activate an existing scene using id', async () => {
      const result = await hue.scenes.activateScene(scene.id);
      expect(result).to.be.true;
    });

    it('should activate an existing scene using scene', async () => {
      const result = await hue.scenes.activateScene(scene);
      expect(result).to.be.true;
    });

  });
});