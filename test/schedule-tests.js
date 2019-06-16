'use strict';

const expect = require('chai').expect
  , hue = require('..')
  , HueApi = hue.api
  , scheduledEventBuilder = hue.scheduledEvent
  , testValues = require('./support/testValues.js')
  , AbsoluteTime = require('../lib/bridge-model/datetime/AbsoluteTime')
;

describe('Hue API', function () {

  const hue = new HueApi(testValues.host, testValues.username)
    , validCommand = {
      'address': `/api/${testValues.username}/lights/1/state`,
      'method': 'PUT',
      'body': {
        'on': true
      }
    }
  ;

  function generateTestScheduleEvent() {
    const time = new AbsoluteTime();
    time.fromDate(new Date(Date.now() + (1 * 60 * 1000)));

    return scheduledEventBuilder.create()
      .withName('createTest')
      .withCommand(validCommand)
      .at(time)
      .getSchedule();
  }


  describe('scheduleTests', function () {

    describe('#getSchedules()', function () {

      describe('should list all scheduled events', function () {

        function validateSchedules(schedules) {
          expect(schedules).to.be.an.instanceof(Array);
          expect(schedules).to.have.length.at.least(1);

          expect(schedules[0]).to.have.property('id');
          expect(schedules[0]).to.have.property('name');
          expect(schedules[0]).to.have.property('localtime');
          expect(schedules[0]).to.have.property('command');
          expect(schedules[0]).to.have.property('created');
        }

        it('using #promise', async () => {
          const schedules = await hue.getSchedules();
          validateSchedules(schedules);
        });

        it('using #callback', function (done) {
          hue.getSchedules(function (err, res) {
            expect(err).to.be.null;
            validateSchedules(res);
            done();
          });
        });
      });
    });


    describe('#scheduleEvent', function () {

      describe('should schedule a valid event', function () {

        let id = null
          , event
        ;

        beforeEach(() => {
          event = generateTestScheduleEvent();
        });

        afterEach(async () => {
          if (id !== null) {
            await hue.deleteSchedule(id);
          }
        });

        it('using #promise', async () => {
          const result = await hue.scheduleEvent(event);
          expect(result).to.have.property('id');
        });

        it('using #callback', function (done) {
          hue.scheduleEvent(event, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.have.property('id');
            done();
          });
        });
      });
    });


    describe('#deleteSchedule', function () {

      let existingScheduleId;

      beforeEach(async () => {
        const schedule = await hue.createSchedule(generateTestScheduleEvent());
        existingScheduleId = schedule.id;
      });

      afterEach(async () => {
        if (existingScheduleId) {
          // In case the test failed in some weird way
          try {
            await hue.deleteSchedule(existingScheduleId);
          } catch (err) {
            // Ignore
          }
        }
      });

      describe('should remove existing schedule', function () {

        it('using #promise', async () => {
          const result = await hue.deleteSchedule(existingScheduleId);
          expect(result).to.be.true;
        });


        it('using #callback', function (done) {
          hue.deleteSchedule(existingScheduleId, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.be.true;
            done();
          });
        });
      });
    });


    describe('#updateSchedule', function () {

      let scheduleId;

      function validateUpdate(keys) {
        return function (result) {
          keys.forEach(function (key) {
            expect(result).to.have.property(key).to.be.true;
          });
        };
      }

      function validAlternativeCommand() {
        return {
          'address': '/api/0/lights/1/state',
          'method': 'PUT',
          'body': {
            'on': false
          }
        };
      }

      beforeEach(async () => {
        const schedule = await hue.createSchedule(generateTestScheduleEvent());
        scheduleId = schedule.id;
      });

      afterEach(async () => {
        await hue.deleteSchedule(scheduleId);
      });


      describe('using #promise', function () {

        it('should update an existing schedule name', async () => {
          const result = await hue.updateSchedule(scheduleId, {'name': 'xxxxxxxxxxxxxxx'});
          validateUpdate(['name'])(result);
        });

        it('should update an existing schedule description', async () => {
          const result = await hue.updateSchedule(scheduleId,
            {'description': 'A new description value for an existing schedule on the Bridge'});
          validateUpdate(['description'])(result);
        });

        it('should update an existing schedule time', async () => {
          const result = await hue.updateSchedule(scheduleId, {'localtime': '2020-04-10T07:42:13'});
          validateUpdate(['localtime'])(result);
        });

        it('should update an existing schedule command', async () => {
          const result = await hue.updateSchedule(scheduleId, {'command': validAlternativeCommand()});
          validateUpdate(['command'])(result);
        });

        it('should update multiple values in an existing schedule', async () => {
          const updates = {
              'name': 'New Name',
              'description': 'Does Something',
              'command': {
                'address': '/api/0/lights/invalid',
                'method': 'GET',
                'body': {}
              }
            }
            , time = new AbsoluteTime()
          ;

          time.value = new Date(Date.now() + (60 * 60 * 1000) + (5 * 60 * 1000));
          updates.localtime = time.toString();

          const result = await hue.updateSchedule(scheduleId, updates);
          validateUpdate(Object.keys(updates))(result);
        });

        it('should error when not updating any valid fields', async () => {
          try {
            await hue.updateSchedule(scheduleId, {'notName': '', 'desc': ''});
            expect.fail('Should have thrown an error');
          } catch (error) {
            expect(error.message).to.contain('parameter, notName, not available');
          }
        });
      })
      ;


      // describe('using #callback', function () {
      //
      //   this.timeout(5000);
      //
      //   it('should update an existing schedule name', function (finished) {
      //
      //     hue.updateSchedule(scheduleId, {'name': 'xxxxxxxxxxxxxxx'}, function (err, results) {
      //       expect(err).to.be.null;
      //       validateUpdate(['name'])(results);
      //       finished();
      //     });
      //   });
      //
      //   it('should update an existing schedule description', function (finished) {
      //     hue.updateSchedule(scheduleId,
      //       {'description': 'A new description value for an existing schedule on the Bridge'},
      //       function (err, results) {
      //         expect(err).to.be.null;
      //         validateUpdate(['description'])(results);
      //         finished();
      //       });
      //   });
      //
      //   it('should update an existing schedule time', function (finished) {
      //     hue.updateSchedule(scheduleId, {'localtime': 'December 12, 2020, 12:01:33'}, function (err, results) {
      //       expect(err).to.be.null;
      //       validateUpdate(['localtime'])(results);
      //       finished();
      //     });
      //   });
      //
      //   it('should update an existing schedule command', function (finished) {
      //     hue.updateSchedule(scheduleId, {'command': validAlternativeCommand()}, function (err, results) {
      //       expect(err).to.be.null;
      //       validateUpdate(['command'])(results);
      //       finished();
      //     });
      //   });
      //
      //   it('should update multiple values in an existing schedule', function (finished) {
      //     var updates = {
      //       'name': 'New Name',
      //       'description': 'Does Something',
      //       'localtime': Date.now() + (60 * 60 * 1000) + (5 * 60 * 1000),
      //       'command': {
      //         'address': '/api/0/lights/invalid',
      //         'method': 'GET',
      //         'body': {}
      //       }
      //     };
      //
      //     hue.updateSchedule(scheduleId, updates, function (err, results) {
      //       expect(err).to.be.null;
      //       validateUpdate(Object.keys(updates))(results);
      //       finished();
      //     });
      //   });
      //
      //   it('should error when not updating any valid fields', function (finished) {
      //     hue.updateSchedule(scheduleId, {'notName': '', 'desc': ''}, function (err, results) {
      //       expect(err.message).to.contain('No valid values for updating the schedule');
      //       expect(results).to.be.null;
      //       finished();
      //     });
      //   });
      // });
    });
  });
});