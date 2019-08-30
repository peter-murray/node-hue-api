'use strict';

const Hue = require('../').api
  , testValues = require('./support/testValues.js')
  , expect = require('chai').expect
;


describe('Hue API', function () {

  // Set a maximum timeout for all the tests
  this.timeout(5000);

  const hue = new Hue(testValues.host, testValues.username)
    , disconnectedHue = new Hue(testValues.host);

  describe('#registerUser', function () {

    let createdUser = null;

    // Press the Link Button before running the tests to add the user
    beforeEach('Press Bridge Link Button', async () => {
      await hue.pressLinkButton();
    });

    afterEach('Remove Existing User', async () => {
      if (createdUser) {
        console.log('Removing user: ' + createdUser);
        await hue.deleteUser(createdUser);
        createdUser = null;
      }
    });


    describe('should register a new user', function () {

      it('using #promise', function (finished) {
        disconnectedHue.createUser('test_device')
          .then(function (result) {
            expect(result).to.exist;
            createdUser = result;
            finished();
          })
          .done();
      });

      it('using #callback', function (finished) {
        disconnectedHue.createUser('simple_user', function (err, result) {
          expect(err).to.be.null;

          expect(result).to.exist;
          createdUser = result;
          finished();
        });
      });
    });


    describe('should register a user with no values provided', function () {

      it('using #promise', function (finished) {
        disconnectedHue.createUser()
          .then(function (result) {
            expect(result).to.exist;
            createdUser = result;
            finished();
          })
          .done();
      });

      it('using #callback', function (finished) {
        disconnectedHue.registerUser(function (err, result) {
          expect(err).to.be.null;

          expect(result).to.exist;
          createdUser = result;
          finished();
        });
      });
    });
  });
});