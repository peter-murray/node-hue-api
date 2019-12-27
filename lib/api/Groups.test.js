'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , testValues = require('../../test/support/testValues.js')
  , model = require('../model')
  , util = require('../util')
;

const NEW_GROUP_NAME = 'd4b3af3ab4df72d10666726d';


describe('Hue API #groups', function () {

  this.timeout(5000);

  const GROUP_LIGHTS = [2, 3]
    , ZONE_LIGHTS = [2, 3, 4]
  ;

  let hue;

  before(async () => {
    const searchResults = await discovery.nupnpSearch();
    expect(searchResults).to.have.length.at.least(1);
    const localApi = v3Api.createLocal(searchResults[0].ipaddress);
    hue = await localApi.connect(testValues.username);
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


  describe('#getGroup()', () => {

    let existingGroup;

    before(async () => {
      const allGroups = await hue.groups.getAll();

      // Use the last group as the group to test on
      existingGroup = allGroups[allGroups.length - 1];
    });

    it('should get the All Lights Group', async () => {
      const result = await hue.groups.getGroup(0);

      expect(result.name).to.equal('Lightset 0');
      expect(result.id).to.equal(0);
    });


    it('should get a room group', async () => {
      const result = await hue.groups.getGroup(existingGroup.id);

      expect(result).to.have.property('id').to.equal(existingGroup.id);
      expect(result).to.have.property('name').to.equal(existingGroup.name);
      //TODO could do more checks here
    });


    it('should fail to resolve a group for an invalid id number', async () => {
      try {
        await hue.groups.getGroup(65534);
        expect.fail('should not get here');
      } catch (err) {
        expect(err.message).to.contain('not available');
      }
    });


    it('should fail to resolve a group for an invalid id as a string', async () => {
      try {
        await hue.groups.getGroup('ab62c6');
        expect.fail('should not get here');
      } catch (err) {
        expect(err.message).to.contain('not a parsable number');
      }
    });
  });


  describe('#getGroupByName()', () => {

    it('should get an existing group', async () => {
      const allGroups = await hue.groups.getAll()
        , targetGroupName = allGroups[1].name
        , groups = await hue.groups.getGroupByName(targetGroupName)
      ;

      expect(groups).to.be.instanceof(Array);
      expect(groups).to.have.length.greaterThan(0);
      expect(groups[0]).to.have.property('name').to.equal(targetGroupName);
    });
  });


  describe('creating groups', () => {

    function deleteExistingGroups(name) {
      return hue.groups.getGroupByName(name)
        .then(matchedGroups => {
          if (matchedGroups && matchedGroups.length > 0) {
            const promises = [];

            matchedGroups.forEach(group => {
              promises.push(hue.groups.deleteGroup(group.id));
            });

            return Promise.all(promises);
          } else {
            return true;
          }
        });
    }

    beforeEach('remove group before creation', async () => {
      await deleteExistingGroups(NEW_GROUP_NAME);
    });

    afterEach('cleanup created group', async () => {
      await deleteExistingGroups(NEW_GROUP_NAME);
    });

    describe('#createRoom()', () => {

      it('should work on deprecated function', async () => {
        const name = NEW_GROUP_NAME
          , lights = []
        ;

        const result = await hue.groups.createRoom(name, lights);
        expect(result).to.have.property('name').to.equal(name);
        expect(result).to.have.property('lights').to.have.members(util.toStringArray(lights));
      });
    });

    describe('#createZone()', () => {

      it('should work on deprecated function', async () => {
        const name = NEW_GROUP_NAME
          , lights = GROUP_LIGHTS
        ;

        const result = await hue.groups.createZone(name, lights);
        expect(result).to.have.property('name').to.equal(name);
        expect(result).to.have.property('lights').to.have.members(util.toStringArray(lights));
      });
    });

    describe('#createGroup()', () => {

      describe('old deprecated parameters', () => {

        it('should create a new group', async () => {
          const name = NEW_GROUP_NAME
            , lights = GROUP_LIGHTS
          ;

          const result = await hue.groups.createGroup(name, lights);
          expect(result).to.have.property('name').to.equal(name);
          expect(result).to.have.property('lights').to.have.members(util.toStringArray(lights));
        });
      });

      describe('LightGroup', () => {

        it('should create a new group', async () => {
          const group = model.createLightGroup();
          group.name = NEW_GROUP_NAME;
          group.lights = GROUP_LIGHTS;

          const result = await hue.groups.createGroup(group);
          expect(model.isGroupInstance(result)).to.be.true;
          expect(result).to.have.property('id').to.be.greaterThan(0);
          expect(result).to.have.property('name').to.equal(NEW_GROUP_NAME);
          expect(result).to.have.property('lights').to.have.members(util.toStringArray(GROUP_LIGHTS));
          expect(result).to.have.property('recycle').to.be.false;
        });
      });
    });


    describe('Room', () => {

      it('should create a new room', async () => {
        const name = NEW_GROUP_NAME
          , roomClass = 'Gym'
        ;

        const room = model.createRoom();
        room.name = NEW_GROUP_NAME;
        room.class = roomClass;

        const result = await hue.groups.createGroup(room);
        expect(model.isGroupInstance(result)).to.be.true;
        expect(result).to.have.property('id').to.be.greaterThan(0);
        expect(result).to.have.property('name').to.equal(name);
        expect(result).to.have.property('type').to.equal('Room');
        expect(result).to.have.property('class').to.equal(roomClass);
        expect(result).to.have.property('lights').to.be.empty;
      });


      it('should create a room when only providing a name', async () => {
        const room = model.createRoom();
        room.name = NEW_GROUP_NAME;

        const result = await hue.groups.createGroup(room);
        expect(model.isGroupInstance(result)).to.be.true;
        expect(result).to.have.property('id').to.be.greaterThan(0);
        expect(result).to.have.property('name').to.equal(NEW_GROUP_NAME);
        expect(result).to.have.property('type').to.equal('Room');
        expect(result).to.have.property('class').to.equal('Other');
      });
    });


    describe('Zone', () => {

      it('should create a new zone', async () => {
        const zone = model.createZone();
        zone.name = NEW_GROUP_NAME;
        zone.lights = ZONE_LIGHTS;

        const result = await hue.groups.createGroup(zone);
        expect(model.isGroupInstance(result)).to.be.true;
        expect(result).to.have.property('id').to.be.greaterThan(0);
        expect(result).to.have.property('name').to.equal(NEW_GROUP_NAME);
        expect(result).to.have.property('lights').to.have.members(util.toStringArray(ZONE_LIGHTS));
        expect(result).to.have.property('type').to.equal('Zone');
      });
    });


    describe('Entertainment', () => {

      it('should create a new entertainment group', async () => {
        const entertainment = model.createEntertainment();
        entertainment.name = NEW_GROUP_NAME;
        // entertainment.lights = [];

        const result = await hue.groups.createGroup(entertainment);
        expect(model.isGroupInstance(result)).to.be.true;
        expect(result).to.have.property('id').to.be.greaterThan(0);
        expect(result).to.have.property('name').to.equal(NEW_GROUP_NAME);
        expect(result).to.have.property('lights').to.be.empty;
        expect(result).to.have.property('type').to.equal('Entertainment');
      });
    });
  });


  describe('#deleteGroup()', () => {

    const DELETE_GROUP_NAME = 'TestGroupToBeDeleted';

    let groupToBeDeleted;


    afterEach(async() => {
      if (groupToBeDeleted) {
        const groups = await hue.groups.getGroupByName(DELETE_GROUP_NAME);

        let promises;
        if (groups && groups.length > 0) {
          promises = groups.map(group => hue.groups.deleteGroup(group));
        }

        if (promises) {
          await Promise.all(promises);
        }
      }
    });


    describe('LightGroup', () => {

      beforeEach('create LightGroup', async () => {
        const group = model.createLightGroup();
        group.name = DELETE_GROUP_NAME;
        group.lights = GROUP_LIGHTS;

        groupToBeDeleted = await hue.groups.createGroup(group);
      });


      it('should delete using a group object', async () => {
        const result = await hue.groups.deleteGroup(groupToBeDeleted);
        expect(result).to.be.true;
      });

      it('should delete using a group id', async () => {
        const result = await hue.groups.deleteGroup(groupToBeDeleted.id);
        expect(result).to.be.true;
      });
    });


    describe('Zone', () => {

      beforeEach('create Zone', async () => {
        const group = model.createZone();
        group.name = DELETE_GROUP_NAME;
        group.lights = ZONE_LIGHTS;

        groupToBeDeleted = await hue.groups.createGroup(group);
      });


      it('should delete using a group object', async () => {
        const result = await hue.groups.deleteGroup(groupToBeDeleted);
        expect(result).to.be.true;
      });

      it('should delete using a group id', async () => {
        const result = await hue.groups.deleteGroup(groupToBeDeleted.id);
        expect(result).to.be.true;
      });
    });


    describe('Room', () => {

      beforeEach('create Room', async () => {
        const group = model.createRoom();
        group.name = DELETE_GROUP_NAME;

        groupToBeDeleted = await hue.groups.createGroup(group);
      });


      it('should delete using a group object', async () => {
        const result = await hue.groups.deleteGroup(groupToBeDeleted);
        expect(result).to.be.true;
      });

      it('should delete using a group id', async () => {
        const result = await hue.groups.deleteGroup(groupToBeDeleted.id);
        expect(result).to.be.true;
      });

    });

    describe('Entertainment', () => {

      beforeEach('create Entertainment Group', async () => {
        const group = model.createEntertainment();
        group.name = DELETE_GROUP_NAME;

        groupToBeDeleted = await hue.groups.createGroup(group);
      });


      it('should delete using a group object', async () => {
        const result = await hue.groups.deleteGroup(groupToBeDeleted);
        expect(result).to.be.true;
      });

      it('should delete using a group id', async () => {
        const result = await hue.groups.deleteGroup(groupToBeDeleted.id);
        expect(result).to.be.true;
      });
    });
  });


  describe('#updateAttributes()', () => {

    let group = null;

    afterEach('delete updated group', async () => {
      if (group) {
        await hue.groups.deleteGroup(group);
      }
    });


    describe('LightGroup', () => {

      beforeEach('createGroup group for update', async () => {
        const newGroup = model.createLightGroup();
        newGroup.name = 'LightGroup Updates';
        newGroup.lights = [2];

        group = await hue.groups.createGroup(newGroup);
      });


      it('should update the name', async () => {
        const newName = `renamed-new ${Date.now()}`;
        group.name = newName;

        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('name').to.equal(newName);
        expect(updatedGroup).to.have.property('lights').to.have.members(group.lights);
      });

      it('should update the lights', async () => {
        const newLights = [2, 3, 4];
        group.lights = newLights;

        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('name').to.equal(group.name);
        expect(updatedGroup).to.have.property('lights').to.have.members(util.toStringArray(newLights));
      });

      it('should update the name and lights', async () => {
        const newLights = [4, 5]
          , newName = `renamed-${Date.now()}`
          ;
        group.name = newName;
        group.lights = newLights;

        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('name').to.equal(newName);
        expect(updatedGroup).to.have.property('lights').to.have.members(util.toStringArray(newLights));
      });
    });


    describe('Room', () => {

      beforeEach('create room for update', async () => {
        const newGroup = model.createRoom();
        newGroup.name = 'Custom Room';
        newGroup.class = 'Gym';

        group = await hue.groups.createGroup(newGroup);
      });


      it('should update the name', async () => {
        const name = 'Custom Room Updated';

        group.name = name;

        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('name').to.equal(name);
      });

      // lights can only be assigned to a single room and all mine are assigned
      it.skip('should update the lights', async () => {
        const lights = [4];

        group.lights = lights;

        const result = await hue.groups.updateAttributes(group)
          , updatedGroup = await hue.groups.get(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('lights').to.equal(util.toStringArray(lights));
      });

      it('should change the class', async () => {
        group.class = 'Other';
        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('class').to.equal('Other');
      });
    });


    describe('Zone', () => {

      beforeEach('create zone for update', async () => {
        const newGroup = model.createZone();
        newGroup.name = 'Custom Zone';
        newGroup.class = 'Lounge';

        group = await hue.groups.createGroup(newGroup);
      });


      it('should update the name', async () => {
        const name = 'Custom Zone Updated';

        group.name = name;

        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('name').to.equal(name);
      });

      it('should update the lights', async () => {
        const lights = [4];

        group.lights = lights;

        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('lights').to.have.members(util.toStringArray(lights));
      });

      it('should change the class', async () => {
        group.class = 'Nursery';
        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('class').to.equal('Nursery');
      });
    });


    describe('Entertainment', () => {

      beforeEach('create entertainment for update', async () => {
        const newGroup = model.createEntertainment();
        newGroup.name = 'Custom Entertainment';

        group = await hue.groups.createGroup(newGroup);
      });


      it('should update the name', async () => {
        const name = 'Custom Name';

        group.name = name;

        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('name').to.equal(name);
      });

      it('should update the lights', async () => {
        const lights = [4];

        group.lights = lights;

        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('lights').to.have.members(util.toStringArray(lights));
      });

      it('should change the class', async () => {
        group.class = 'Other';
        const result = await hue.groups.updateGroupAttributes(group)
          , updatedGroup = await hue.groups.getGroup(group)
        ;

        expect(result).to.be.true;
        expect(updatedGroup).to.have.property('id').to.equal(group.id);
        expect(updatedGroup).to.have.property('class').to.equal('Other');
      });
    });
  });


  describe('#setGroupState()', () => {

    let group;

    beforeEach('create LightGroup for setState', async () => {
      const groupToCreate = model.createLightGroup();
      groupToCreate.name = 'setGroupState Tests';
      groupToCreate.lights = 43;

      group = await hue.groups.createGroup(groupToCreate);
    });

    afterEach('delete test group for setState', async () => {
      if (group) {
        await hue.groups.deleteGroup(group);
      }
    });

    it('should set on state to true', async () => {
      const lightState = {on: true}
        , result = await hue.groups.setGroupState(group, lightState)
        , groupStatus = await hue.groups.getGroup(group)
      ;

      expect(result).to.be.true;
      expect(groupStatus).to.have.property('action');
      expect(groupStatus.action).to.have.property('on').to.be.true;
    });

    it('should set on state to false using GroupState', async () => {
      const lightState = new model.lightStates.GroupLightState().off()
        , result = await hue.groups.setGroupState(group, lightState)
        , groupStatus = await hue.groups.getGroup(group)
      ;

      expect(result).to.be.true;
      expect(groupStatus).to.have.property('action');
      expect(groupStatus.action).to.have.property('on').to.be.false;
    });

    //TODO could expand tests to rooms, zone and entertainment, but if it works for one should work for all
  });

});