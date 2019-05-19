'use strict';

const expect = require('chai').expect
  , HueApi = require('.')
  , Scene = require('../bridge-model/Scene')
  , testValues = require('../test/support/testValues.js') //TODO move these
;

describe('Hue API #scenes', () => {

  let hue;

  before(() => {
    return HueApi.create(testValues.host, testValues.username)
      .then(api => {
        hue = api;
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

    it('should remove a scene', async() => {
      const result = await hue.scenes.deleteScene(id);
      expect(result).to.be.true;
    });
  });
});