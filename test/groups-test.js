'use strict';

const expect = require('chai').expect
  , HueApi = require('../').api
  , testValues = require('./support/testValues.js')
  , lightState = require('../').lightState
;


describe('Hue API', function () {

  // Set a maximum timeout for all the tests
  this.timeout(5000);

  var hue = new HueApi(testValues.host, testValues.username);

  describe('group tests', function () {

    describe('#groups', function () {

      function validateAllGroups(results) {
        expect(results).to.be.instanceOf(Array);
        expect(results).to.have.length.greaterThan(0);

        // The first result should always be that of the all lights group
        expect(results[0]).to.have.property('id', 0);
        expect(results[0]).to.have.property('name', 'Lightset 0');
        expect(results[0]).to.have.property('type', 'LightGroup');

        expect(results[1]).to.have.property('id');
        expect(results[1]).to.have.property('type');
        expect(results[1]).to.have.property('name');
        expect(results[1]).to.have.property('lights');
        expect(results[1]).to.have.property('action');
      }

      it('using #promise should retrieve all groups', async () => {
        const allGroups = await hue.groups();
        validateAllGroups(allGroups);
      });

      it('using #callback should retrieve all groups', function (finished) {
        hue.groups(function (err, results) {
          expect(err).to.be.null;
          validateAllGroups(results);
          finished();
        });
      });
    });

    describe('#luminaires', function () {

      it('using #promise', function (done) {
        hue.luminaires()
          .then(function (data) {
            expect(data).to.be.an.instanceOf(Array);
            expect(data).to.be.empty;
            done();
          })
          .done();
      });

      it('using #callback', function (done) {
        hue.luminaires(function (err, data) {
          expect(err).to.be.null;
          expect(data).to.be.an.instanceOf(Array);
          expect(data).to.be.empty;
          done();
        });
      });
    });

    describe('#lightSources', function () {

      it('using #promise', function (done) {
        hue.lightSources()
          .then(function (data) {
            expect(data).to.be.an.instanceOf(Array);
            expect(data).to.be.empty;
            done();
          })
          .done();
      });

      it('using #callback', function (done) {
        hue.lightSources(function (err, data) {
          expect(err).to.be.null;
          expect(data).to.be.an.instanceOf(Array);
          expect(data).to.be.empty;
          done();
        });
      });
    });

    describe('#lightGroups', function () {

      it('using #promise', function (done) {
        hue.lightGroups()
          .then(function (data) {
            expect(data).to.be.an.instanceOf(Array);
            expect(data.length).to.be.at.least(1);

            expect(data[0]).to.have.property('id', 0);
            expect(data[0]).to.have.property('name', 'Lightset 0');
            done();
          })
          .done();
      });

      it('using #callback', function (done) {
        hue.lightGroups(function (err, data) {
          expect(err).to.be.null;

          expect(data).to.be.an.instanceOf(Array);
          expect(data.length).to.be.at.least(1);

          expect(data[0]).to.have.property('id', 0);
          expect(data[0]).to.have.property('name', 'Lightset 0');
          done();
        });
      });
    });


    describe('#getGroup', function () {

      function validateAllLightsResult(groupDetails) {
        expect(groupDetails).to.have.property('id', 0);
        expect(groupDetails).to.have.property('name', 'Lightset 0');

        expect(groupDetails).to.have.property('lights').to.be.instanceOf(Array);
        expect(groupDetails.lights).to.have.length.greaterThan(20);
      }

      function failTest() {
        throw new Error('Should not be called');
      }

      function validateGroupNotExist(id, finished) {
        return function (err) {
          const hueError = err.getHueError();
          expect(hueError).to.not.be.null;

          expect(hueError).to.have.property('type').to.equal(3);
          expect(hueError).to.have.property('message').to.contain('resource');
          expect(hueError).to.have.property('message').to.contain('not available');
          expect(hueError).to.have.property('message').to.contain(id);

          if (finished) {
            finished();
          }
        };
      }

      describe('using #promise', function () {

        it('should obtain \'All Lights\' group details', function (finished) {
          function validate(results) {
            validateAllLightsResult(results);
            finished();
          }

          hue.getGroup(0).then(validate).done();
        });

        it('should fail for a group id that does not exist', function (finished) {
          hue.getGroup(99)
            .then(failTest)
            .catch(validateGroupNotExist(99, finished))
            .done();
        });

        it('should fail for group Id 999', function (finished) {
          hue.getGroup(999)
            .then(failTest)
            .fail(validateGroupNotExist(999, finished))
            .done();
        });
      });

      describe('using #callback', function () {

        it('should obtain \'All Lights\' group details', function (finished) {
          hue.getGroup(0, function (err, results) {
            expect(err).to.be.null;
            validateAllLightsResult(results);
            finished();
          });
        });

        it('should fail for a group id that does not exist', function (finished) {
          hue.getGroup(99, function (err, result) {
            expect(result).to.be.null;
            validateGroupNotExist(99, finished)(err);
          });
        });

        it('should fail for group Id 999', function (finished) {
          hue.getGroup(999, function (err, result) {
            expect(result).to.be.null;
            validateGroupNotExist(999, finished)(err);
          });
        });
      });
    });


    describe('#createGroup #deleteGroup', function () {

      describe('should createGroup a group and then delete it', function () {

        const groupName = 'NodejsApiTest'
          , lightIds = [1, 2, 3]
        ;

        function validateMissingGroup(err, createdGroupId) {
          expect(err.message).to.contain('resource, /groups/' + createdGroupId);
          expect(err.message).to.contain('not available');
        }

        it('using #promise', async () => {

          function deleteGroup(id) {
            return hue.deleteGroup(id)
              .then(deleted => {
                expect(deleted).to.be.true;

                return hue.getGroup(id)
                  .then(function () {
                    throw new Error('Should not be called');
                  })
                  .fail(function (err) {
                    validateMissingGroup(err, id);
                  });
              });
          }


          // A Round Robin trip through creating a group, validating it and then deleting it and checking for
          // removal. This covers createGroup and delete API functions.
          await hue.createGroup(groupName, lightIds)
            .then(newGroup => {
              expect(newGroup).to.have.property('id');
              const createdGroupId = newGroup.id;

              return hue.getGroup(newGroup.id)
                .then(group => {
                  expect(group).to.have.property('id').to.equal(createdGroupId);

                  // if a duplicate is found a " x" will be appended hence why this check is not equals
                  expect(group).to.have.property('name').to.have.string(groupName);

                  expect(group).to.have.property('lights').to.be.instanceOf(Array);
                  expect(group.lights).to.have.members(lightIds);

                  return group.id;
                });
            })
            .then(deleteGroup)
            .done();
        });

        it('using #callback', function (done) {
          hue.createGroup(groupName, lightIds, function (err, result) {
            expect(err).to.be.null;
            const createdGroupId = result.id;

            hue.deleteGroup(createdGroupId, function (err, result) {
              expect(err).to.be.null;
              expect(result).to.be.true;

              hue.getGroup(createdGroupId, function (err, res) {
                validateMissingGroup(err, createdGroupId);
                expect(res).to.be.null;
                done();
              });
            });
          });
        });
      });
    });


    describe('#updateGroup', function () {

      const origName = 'UpdateTests'
        , origLights = [1, 2]
        , updateName = 'renamedGroupName'
        , updateLights = [3, 4, 5]
      ;

      let groupId
      ;

      // Create a group to test on
      beforeEach(async () => {
        await hue.createGroup(origName, origLights)
          .then(function (result) {
            groupId = result.id;
          });
      });

      // Remove the created group after each test
      afterEach(async () => {
        await hue.deleteGroup(groupId);
      });

      function getGroup() {
        return hue.getGroup(groupId);
      }

      function validateGroup(expectedName, expectedLights) {
        return function (details) {
          // Name
          expect(details).to.have.property('name', expectedName);

          // Lights
          expect(details.lights).to.have.length(expectedLights.length);
          expect(details.lights).to.have.members(expectedLights);
        };
      }

      describe('using #promise', function () {

        it('should update only the name of a group', function (finished) {
          hue.updateGroup(groupId, updateName)
            .then(getGroup)
            .then(validateGroup(updateName, origLights))
            .then(finished)
            .done();
        });

        it('should update only the lights in a group', function (finished) {
          hue.updateGroup(groupId, updateLights)
            .then(getGroup)
            .then(validateGroup(origName, updateLights))
            .then(finished)
            .done();
        });

        it('should update name and lights in a group', function (finished) {
          hue.updateGroup(groupId, updateName, updateLights)
            .then(getGroup)
            .then(validateGroup(updateName, updateLights))
            .then(finished)
            .done();
        });
      });


      describe('using #callback', function () {

        it('should update only the name of a group', function (finished) {
          hue.updateGroup(groupId, updateName,
            function (err, result) {
              expect(err).to.be.null;
              expect(result).to.be.true;

              getGroup()
                .then(validateGroup(updateName, origLights))
                .then(finished);
            });
        });

        it('should update only the lights in a group', function (finished) {
          hue.updateGroup(groupId, updateLights,
            function (err, result) {
              expect(err).to.be.null;
              expect(result).to.be.true;

              getGroup()
                .then(validateGroup(origName, updateLights))
                .then(finished);
            });
        });

        it('should update name and lights in a group', function (finished) {
          hue.updateGroup(groupId, updateName, updateLights,
            function (err, result) {
              expect(err).to.be.null;
              expect(result).to.be.true;

              getGroup()
                .then(validateGroup(updateName, updateLights))
                .then(finished);
            });
        });

        it('should update the name if the lights are null', function (finished) {
          hue.updateGroup(groupId, updateName, null,
            function (err, result) {
              expect(err).to.be.null;
              expect(result).to.be.true;

              getGroup()
                .then(validateGroup(updateName, origLights))
                .then(finished)
            });
        });
      });
    });

    //TODO these tests need better validation around the body that is generated to be sent to the bridge
    describe('#setGroupLightState', function () {

      it('using #promise', function (finished) {
        hue.setGroupLightState(0, lightState.create().off())
          .then(function (result) {
            expect(result).to.be.true;
            finished();
          })
          .done();
      });

      it('using #callback', function (finished) {
        hue.setGroupLightState(0, lightState.create().off(), function (err, result) {
          expect(err).to.be.null;
          expect(result).to.be.true;
          finished();
        });
      });
    });

    describe('#updateGroup', function () {

      it('should fail on invalid group id', function (finished) {
        const failIfCalled = function () {
            throw new Error('The function call should have produced an error for invalid group id');
          },
          checkError = function (err) {
            const hueError = err.getHueError();
            expect(hueError).to.have.property('type', 3);
            expect(hueError.message).to.contain('not available');
            finished();
          };

        hue.updateGroup(99, 'a name')
          .then(failIfCalled)
          .fail(checkError)
          .done();
      });
    });

    // describe('#_getGroupLightsByType', function () {
    //
    //   it('should work for group 0', function (done) {
    //     hue._getGroupLightsByType(0)
    //       .then(function (map) {
    //
    //         //TODO sort this test
    //         console.log(JSON.stringify(map, null, 2));
    //
    //         done();
    //       })
    //       .done();
    //   });
    // });
  });
});