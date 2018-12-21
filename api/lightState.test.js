'use strict';

const expect = require('chai').expect
    , HueApi = require('.')
    , lightState = require('./lightState')
;

describe('Hue API #lightState', () => {

  describe('#create()', () => {

    it('should create an empty state', () => {
      const state = lightState.create();

      expect(state).to.exist;
    });


    it('should create a state with on', () => {
      const state = lightState.create().on()
          , result = state.build()
      ;

      expect(result).to.have.property('on', true)
    });
  });
});