'use strict';

const expect = require('chai').expect
  , HueApi = require('../v3').api
  , discovery = require('../v3').discovery
  , ApiError = require('../../index').ApiError
  , testValues = require('../../test/support/testValues.js') //TODO move these
  , GroupState = require('../bridge-model/lightstate/GroupState')
;

describe('Hue API #configuration', () => {

  let hue;

  describe('unauthenticated access', () => {

    before(() => {
      return discovery.nupnpSearch()
        .then(searchResults => {
          return HueApi.create(searchResults[0].ipaddress)
            .then(api => {
              hue = api;
            });
        });
    });

    describe('#createUser()', () => {

      it('should create a user when the link button has been pressed', async() => {
        const user = await hue.configuration.createUser('node-hue-api', 'node-hue-api-tests', true);
        console.log(`Created user: ${user}`);
        expect(user).to.have.length.greaterThan(39);
      });


      it('should not create a new user when link button not pressed', async () => {
        try {
          const user = await hue.configuration.createUser('node-hue-api', 'node-hue-api-tests', true);
          console.log(`Created user: ${user}`);
          expect.fail('should not ger here unless the link button was pressed');
        } catch (err) {
          expect(err).to.be.instanceof(ApiError);
          expect(err.getHueErrorType()).to.equal(101);
        }
      });
    });
  });


  describe('authenticated access', () => {

    //TODO all other API endpoints

    before(() => {
      return discovery.nupnpSearch()
        .then(searchResults => {
          return HueApi.create(searchResults[0].ipaddress)
            .then(api => {
              hue = api;
            });
        });
    });
  });
});