'use strict';

const expect = require('chai').expect
  , Scene = require('./Scene')
;

//TODO these tests need to be broken up to LightScene and GroupScene

describe.skip('Scene', () => {

  describe.skip('#create()', () => {

    it('should create a simple scene', () => {
      const scene = new Scene({name: 'hello'});

      expect(scene).to.have.property('name').to.equal('hello');
    });


    it('should create a simple scene with an id', () => {
      const scene = new Scene({name: 'hello'}, 0);

      expect(scene).to.have.property('name').to.equal('hello');
      expect(scene).to.have.property('id').to.equal('0');
    });
  });


  describe('set appdata', () => {


    it('should set the application data in a scene', () => {
      const scene = new Scene()
        , appdata = {
          version: 1,
          data: 'a secret value'
        }
      ;
      scene.appdata = appdata;

      expect(scene).to.have.property('appdata').to.deep.equal(appdata);
    });
  });

  //TODO complete coverage of the Scene object
});
