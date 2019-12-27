'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , model = require('../model')
  , testValues = require('../../test/support/testValues.js')
  , ApiError = require('../ApiError')
;

describe('Hue API #schedule', () => {

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
      const results = await hue.schedules.getAll();

      expect(results).to.be.instanceOf(Array);
      expect(results).to.have.length.to.be.at.least(1);

      const schedule = results[0];
      expect(model.isScheduleInstance(schedule)).to.be.true;
    });
  });


  describe('#get()', () => {

    let targetSchedule;

    before(async () => {
      const schedules = await hue.schedules.getAll();
      targetSchedule = schedules[0];
    });

    describe('using id', () => {

      it('should get a specific schedule', async () => {
        const schedule = await hue.schedules.getSchedule(targetSchedule.id);

        expect(model.isScheduleInstance(schedule)).to.be.true;
        expect(schedule).to.have.property('id').to.equal(targetSchedule.id);
        expect(schedule).to.have.property('description').to.equal(targetSchedule.description);
        expect(schedule).to.have.property('localtime').to.equal(targetSchedule.localtime);
        expect(schedule).to.have.property('status').to.equal(targetSchedule.status);
        expect(schedule).to.have.property('recycle').to.equal(targetSchedule.recycle);
      });

      it('should fail for invalid schedule id', async () => {
        try {
          await hue.schedules.getSchedule('65535');
          expect.fail('should not get here');
        } catch (err) {
          expect(err).to.be.instanceof(ApiError);
          expect(err.getHueErrorType()).to.equal(3);
          expect(err.message).to.contain('not available');
        }
      });

    });


    describe('using Schedule Object', () => {

      it('should get a specific schedule', async () => {
        const schedule = await hue.schedules.getSchedule(targetSchedule);

        expect(model.isScheduleInstance(schedule)).to.be.true;
        expect(schedule).to.have.property('id').to.equal(targetSchedule.id);
        expect(schedule).to.have.property('description').to.equal(targetSchedule.description);
        expect(schedule).to.have.property('localtime').to.equal(targetSchedule.localtime);
        expect(schedule).to.have.property('status').to.equal(targetSchedule.status);
        expect(schedule).to.have.property('recycle').to.equal(targetSchedule.recycle);
      });
    });
  });


  describe('#createSchedule()', function () {

    // We need a longer wait time here as we have to pause for the schedules to trigger and remove themselves from the bridge
    this.timeout(30 * 1000);

    let created;

    beforeEach(() => {
      created = null;
    });

    afterEach(async () => {
      if (created) {
        try {
          await hue.schedules.deleteSchedule(created);
        } catch (err) {
          console.log(`Failed to delete created schedule: ${created.id}, ${err.message}`);
        }
      }
    });


    it('should create a schedule', async () => {
      const schedule = model.createSchedule();
      schedule.name = 'Test Schedule Recurring';
      schedule.description = 'A node-hue-api test schedule that can be removed';
      schedule.localtime = model.timePatterns.createRecurringTime('W124/T12:00:00');
      schedule.recycle = true;
      schedule.command = model.actions.light(0).withState({on: true});

      const result = await hue.schedules.createSchedule(schedule);
      created = result;

      expect(result).to.have.property('name').to.equal(schedule.name);
      expect(result).to.have.property('description').to.equal(schedule.description);

      expect(result).to.have.property('command');
      expect(result.command).to.have.property('method').to.equal('PUT');
      expect(result.command).to.have.property('address').to.contain('/lights/0/state');
      expect(result.command).to.have.property('body').to.deep.equal({on: true});
    });

    //TODO should try all the different time patterns for schedules


    it('should create a schedule that will autodelete', async () => {
      const schedule = model.createSchedule();

      schedule.name = 'Test Schedule AutoDelete';
      schedule.description = 'A node-hue-api test schedule should autodelete itself';
      schedule.localtime = model.timePatterns.createTimer().seconds(2);
      schedule.recycle = true;
      schedule.autodelete = true;
      schedule.command = model.actions.light(40).withState(new model.lightStates.LightState().alertShort());

      const result = await hue.schedules.createSchedule(schedule);
      expect(result).to.have.property('name').to.equal(schedule.name);
      expect(result).to.have.property('autodelete').to.be.true;

      // Verify it has auto deleted
      await waitFor(8 * 1000);
      try {
        await hue.schedules.getSchedule(result);
        expect.fail('should have auto deleted from schedules');
      } catch (err) {
        // console.error(err);
        expect(err.getHueErrorType()).to.equal(3);
      }
    });


    it('should create a schedule with a repeat timer that repeats 2 times', async () => {
      const schedule = model.createSchedule();

      schedule.name = 'Reoccurring Schedule from Timer';
      schedule.description = 'A node-hue-api test schedule should autodelete itself';
      schedule.localtime = model.timePatterns.createRecurringTimer().seconds(5).reoccurs(2);
      schedule.recycle = true;
      schedule.command = model.actions.light(40).withState(new model.lightStates.LightState().alertShort());

      const result = await hue.schedules.createSchedule(schedule);

      await waitFor(15 * 1000);
      try {
        await hue.schedules.getSchedule(result);
        expect.fail('should have auto deleted from schedules');
      } catch (err) {
        expect(err.getHueErrorType()).to.equal(3);
      }
    });


    it('should create a schedule with a repeats forever', async () => {
      const schedule = model.createSchedule();

      schedule.name = 'Reoccurring Schedule from Timer';
      schedule.description = 'A node-hue-api test schedule should autodelete itself';
      schedule.localtime = model.timePatterns.createRecurringTimer().seconds(3);
      schedule.recycle = true;
      schedule.command = model.actions.light(40).withState(new model.lightStates.LightState().alertShort());

      const result = await hue.schedules.createSchedule(schedule);
      created = result;

      // Let the schedule run at least three times
      await waitFor(12 * 1000);

      // Stop it as it is annoying
      const runningSchedule = await hue.schedules.getSchedule(result);
      runningSchedule.status = 'disabled';
      await hue.schedules.updateSchedule(runningSchedule);
    });


  });

  describe('#updateSchedule()', () => {

    let schedule;

    beforeEach(async () => {
      const createSchedule = model.createSchedule();
      createSchedule.name = 'Test Schedule For Updates';
      createSchedule.description = 'A node-hue-api test schedule that can be removed';
      createSchedule.localtime = model.timePatterns.createAbsoluteTime(new Date(Date.now() + (1000 * 60 * 60)));
      createSchedule.recycle = true;
      createSchedule.command = model.actions.light(0).withState({on: true});

      schedule = await hue.schedules.createSchedule(createSchedule);
    });

    afterEach(async () => {
      if (schedule) {
        try {
          await hue.schedules.deleteSchedule(schedule);
        } catch (err) {
          console.log(`Failed to delete created schedule: ${schedule.id}, ${err.message}`);
        }
      }
    });


    it('should update the name', async () => {
      const newName = 'Updated Schedule Name';
      schedule.name = newName;

      const result = await hue.schedules.updateSchedule(schedule)
        , updatedSchedule = await hue.schedules.getSchedule(schedule)
      ;

      expect(result).to.have.property('name').to.be.true;
      expect(updatedSchedule).to.have.property('name').to.equal(newName);
    });


    it('should update the description', async () => {
      const original = schedule.getHuePayload()
        , newDescription = original.description + Date.now();

      schedule.description = newDescription;

      const result = await hue.schedules.updateSchedule(schedule)
        , updatedSchedule = await hue.schedules.getSchedule(schedule)
      ;

      expect(result).to.have.property('description').to.be.true;
      expect(updatedSchedule).to.have.property('description').to.equal(newDescription);
    });


    it('should update the command', async () => {
      const newCommand = model.actions.light(1).withState(new model.lightStates.LightState().off());
      schedule.command = newCommand;

      const result = await hue.schedules.updateSchedule(schedule)
        , updatedSchedule = await hue.schedules.getSchedule(schedule)
      ;

      expect(result).to.have.property('command').to.be.true;
      expect(updatedSchedule).to.have.property('command').to.have.property('address').to.contain('/lights/1');
      expect(updatedSchedule).to.have.property('command').to.have.property('body').to.deep.equal({on: false});
    });

    it('should update the localtime', async () => {
      const newTime = model.timePatterns.createAbsoluteTime(new Date(Date.now() + (10 * 1000 * 60 * 60)));
      schedule.localtime = newTime;

      const result = await hue.schedules.updateSchedule(schedule)
        , updatedSchedule = await hue.schedules.getSchedule(schedule)
      ;

      expect(result).to.have.property('localtime').to.be.true;
      expect(updatedSchedule).to.have.property('localtime').to.equal(newTime.toString());
    });

    it('should update the status', async () => {
      expect(schedule.status).to.equal('enabled');
      schedule.status = 'disabled';

      const result = await hue.schedules.updateSchedule(schedule)
        , updatedSchedule = await hue.schedules.getSchedule(schedule)
      ;

      expect(result).to.have.property('status').to.be.true;
      expect(updatedSchedule).to.have.property('status').to.equal('disabled');
    });

    it('should update autodelete', async () => {
      expect(schedule).to.have.property('autodelete').to.be.true;
      schedule.autodelete = false;

      const result = await hue.schedules.updateSchedule(schedule)
        , updatedSchedule = await hue.schedules.getSchedule(schedule)
      ;

      expect(result).to.have.property('autodelete').to.be.true;
      expect(updatedSchedule).to.have.property('autodelete').to.be.false;
    });
  });


  describe('#deleteSchedule()', () => {

    let schedule;

    beforeEach(async () => {
      const createSchedule = model.createSchedule();
      createSchedule.name = 'Test Schedule For Deletes';
      createSchedule.description = 'A node-hue-api test schedule that can be removed';
      createSchedule.localtime = model.timePatterns.createAbsoluteTime(new Date(Date.now() + (1000 * 60 * 60)));
      createSchedule.recycle = true;
      createSchedule.command = model.actions.light(0).withState({on: false});

      schedule = await hue.schedules.createSchedule(createSchedule);
    });

    afterEach(async () => {
      if (schedule) {
        try {
          const exists = await hue.schedules.getSchedule(schedule);
          await hue.schedules.deleteSchedule(exists);
        } catch (err) {
          if (err.getHueErrorType() !== 3) {
            console.log(`Failed to delete created schedule: ${schedule.id}, ${err.message}`);
          }
        }
      }
    });


    it('should delete an existing schedule', async () => {
      const result = await hue.schedules.deleteSchedule(schedule);
      expect(result).to.be.true;
    });

    it('should error when deleting a schedule that does not exist', async () => {
      const allSchedules = await hue.schedules.getAll()
        , nextId = getNextScheduleId(allSchedules)
      ;

      try {
        await hue.schedules.deleteSchedule(nextId);
        expect.fail('Should not get here');
      } catch (err) {
        expect(err.message).to.contain('not available');
        expect(err.getHueErrorType()).to.equal(3);
      }
    });
  });
});


//TODO make part of utils
function waitFor(milliseconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, milliseconds);
  })
}

// Common with Rules tests
function getNextScheduleId(allSchedules) {
  const ids = allSchedules.map(schedule => schedule.id);

  let id = 1
    , nextId = null
  ;
  while (!nextId) {
    id++;

    if (ids.indexOf(id) === -1) {
      nextId = id;
    }
  }

  return nextId;
}