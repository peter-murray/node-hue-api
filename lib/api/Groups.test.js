'use strict';

const expect = require('chai').expect
  , HueApi = require('../v3').api
  , discovery = require('../v3').discovery
  , testValues = require('../../test/support/testValues.js') //TODO move these
  , GroupState = require('../bridge-model/lightstate/GroupState')
;

const TEST_GROUP_NAME = 'd4b3af3ab4df72d10666726d';


describe('Hue API #groups', () => {

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

    it('should return all groups', async () => {
      const result = await hue.groups.getAll();

      expect(result).to.be.instanceof(Array);

      // The injected all lights special group
      expect(result[0]).to.have.property('name', 'Lightset 0');
      expect(result[0]).to.have.property('id', 0);

      // TODO this is now a Group object test the values
      expect(result[1]).to.have.property('name');
      expect(result[1]).to.have.property('lights');
      expect(result[1]).to.have.property('type');
      expect(result[1]).to.have.property('state');
      expect(result[1]).to.have.property('recycle');
      expect(result[1]).to.have.property('action');
    });
  });


  describe('#get()', () => {

    it('should get the All Lights Group', async () => {
      const result = await hue.groups.get(0);

      expect(result.name).to.equal('Lightset 0');
      expect(result.id).to.equal(0);
    });


    it('should get a room group', async () => {
      const existingGroup = testValues.groups.existingGroup
        , result = await hue.groups.get(existingGroup.id)
      ;

      expect(result).to.have.property('id').to.equal(existingGroup.id);
      expect(result).to.have.property('name').to.equal(existingGroup.name);
      //TODO could do more checks here
    });


    it('should fail to resolve a group for an invalid id number', async () => {
      try{
        const result = await hue.groups.get(99999);
        expect.fail('should not get here');
      } catch (err) {
        expect(err.message).to.contain('not available');
      }
    });


    it('should fail to resolve a group for an invalid id as a string', async () => {
      try{
        await hue.groups.get('ab62c6');
        expect.fail('should not get here');
      } catch (err) {
        expect(err.message).to.contain('is not an integer');
      }
    });
  });


  describe('#createGroup()', () => {


    describe('simple group creation', () => {

      function deleteExistingGroup(name) {
        return hue.groups.getAll().then(groups => {
          let groupId = null;

          groups.forEach(group => {
            if (group.name === name) {
              groupId = group.id;
            }
          });

          if (groupId == null) {
            return true;
          } else {
            return hue.groups.deleteGroup(groupId);
          }
        });
      }

      beforeEach('remove group before creation', async () => {
        await deleteExistingGroup(TEST_GROUP_NAME);
      });

      afterEach('cleanup created group', async () => {
        await deleteExistingGroup(TEST_GROUP_NAME);
      });

      it('should createGroup a new group', async () => {
        const lights = [1, 2]
          , result = await hue.groups.createGroup(TEST_GROUP_NAME, lights)
          , fullGroup = await hue.groups.get(result.id)
        ;

        expect(result).to.have.property('id').to.be.greaterThan(0);

        expect(fullGroup).to.have.property('name').to.equal(TEST_GROUP_NAME);
        expect(fullGroup).to.have.property('lights').to.have.members(lights);
      });
    });


    // describe('room creation', () => {
    //   //TODO remove the previous room before creating a new one of the same type, also clean up afterwards
    //
    //   it('should createGroup a new room', async () => {
    //     const name = 'Testing Room Creation'
    //       , lights = ['1', '2']//TODO does not respond well to integers here, validate, also deal with single value
    //       , result = await hue.groups.createRoom(name, lights, 'Gym')
    //     ;
    //
    //     console.log(JSON.stringify(result, null, 2));
    //   });
    // });

  });


  describe('#deleteGroup()', () => {

    const groupName = 'TestGroupToBeDeleted';

    let groupToBeDeleted;

    beforeEach('createGroup group to be deleted', async () => {
      const result = await hue.groups.createGroup(groupName, [1]);
      groupToBeDeleted = result.id;
    });

    // it('should delete all testing groups', async () => {
    //   await hue.groups.getAll().then(groups => {
    //     groups.forEach(group => {
    //       let promises = [];
    //
    //       console.log(group.name);
    //
    //       if (group.name === 'NodejsApiTest' || group.name === 'UpdateTests' || group.name === 'Custom group for $lights' || group.name === 'renamedGroupName') {
    //         promises.push(hue.groups.deleteGroup(group.id));
    //       }
    //
    //       return Promise.all(promises);
    //     });
    //   });
    // });

    it('should delete test group', async () => {
      const result = await hue.groups.deleteGroup(groupToBeDeleted);
      expect(result).to.be.true;
    });

    //TODO test deletion of room
  });


  describe('#update()', () => {


    describe('groups', () => {

      const initialGroupName = 'updateGroupTest'
        , initialGroupLights = [1]
      ;

      let groupId;

      beforeEach('createGroup group for update', async () => {
        const result = await hue.groups.createGroup(initialGroupName, initialGroupLights);
        groupId = result.id;
      });

      afterEach('delete test group for update', async () => {
        if (groupId) {
          await hue.groups.deleteGroup(groupId);
        }
      });


      it('should update the name', async () => {
        const newName = `renamed-new ${Date.now()}`
          , result = await hue.groups.update(groupId, {name: newName})
          , group = await hue.groups.get(groupId)
        ;

        expect(result).to.be.true;
        expect(group).to.have.property('id').to.equal(groupId);
        expect(group).to.have.property('name').to.equal(newName);
        expect(group).to.have.property('lights').to.have.members(initialGroupLights);
      });

      it('should update the lights', async () => {
        const newLights = [2, 3, 4]
          , result = await hue.groups.update(groupId, {lights: newLights})
          , group = await hue.groups.get(groupId)
        ;

        expect(result).to.be.true;
        expect(group).to.have.property('id').to.equal(groupId);
        expect(group).to.have.property('name').to.equal(initialGroupName);
        expect(group).to.have.property('lights').to.have.members(newLights);
      });

      it('should update the name and lights', async () => {
        const newLights = [4, 5]
          , newName = `renamed-${Date.now()}`
          , result = await hue.groups.update(groupId, {name: newName, lights: newLights})
          , group = await hue.groups.get(groupId)
        ;

        expect(result).to.be.true;
        expect(group).to.have.property('id').to.equal(groupId);
        expect(group).to.have.property('name').to.equal(newName);
        expect(group).to.have.property('lights').to.have.members(newLights);
      });
    });


    describe('rooms', () => {
      //TODO need to complete this, need to createGroup a room that does not exist and then update it, including updating the class
    });
  });


  describe('#setGroupState()', () => {

    let groupId;

    beforeEach('createGroup group for setState', async () => {
      const result = await hue.groups.createGroup('groupStateTest', [1, 39, 40]);
      groupId = result.id;
    });

    afterEach('delete test group for setState', async () => {
      if (groupId) {
        await hue.groups.deleteGroup(groupId);
      }
    });


    it('should set on state to true', async () => {
      const lightState = {on: true}
        , result = await hue.groups.setGroupState(groupId, lightState)
        , groupStatus = await hue.groups.get(groupId)
      ;

      expect(result).to.be.true;
      expect(groupStatus).to.have.property('action');
      expect(groupStatus.action).to.have.property('on').to.be.true;
    });

    it('should set on state to false using GroupState', async () => {
      const lightState = new GroupState().off()
        , result = await hue.groups.setGroupState(groupId, lightState)
        , groupStatus = await hue.groups.get(groupId)
      ;

      expect(result).to.be.true;
      expect(groupStatus).to.have.property('action');
      expect(groupStatus.action).to.have.property('on').to.be.false;
    });
  });
});