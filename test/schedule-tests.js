var expect = require("chai").expect,
    assert = require("chai").assert,
    hueApi = require("../index").hue,
    scheduledEvent = require("../index").scheduledEvent,
    ApiError = require("../index").ApiError,
    testValues = require("./support/testValues.js");

describe("Hue API", function () {

    var hue = new hueApi.HueApi(testValues.host, testValues.username),
        validCommand = {
            "address": "/api/" + testValues.username + "/lights/5/state",
            "method" : "PUT",
            "body"   : {
                "on": true
            }
        };


    describe("#scheduleEvent()", function () {

        it("should schedule valid event", function (finished) {

            var checkResults = function (results) {
                    expect(results).to.exist;
                    expect(results).to.have.property("id").to.be.not.null;

                    //TODO use lookup to find the schedule and check it matches what we passed in
                    return results.id;
                },

                removeSchedule = function (id) {
                    return hue.deleteSchedule(id).then(function (result) {
                        expect(result).to.be.true;
                        finished();
                    });
                },

                event = scheduledEvent.create()
                    .withName("createTest")
                    .withCommand(validCommand)
                    .at((new Date()).getTime() + 5000);

            hue.scheduleEvent(event)
                .then(checkResults)
                .then(removeSchedule)
                .done();
        });
    });


    describe("#deleteScheduledEvent()", function () {

        it("should delete an existing scheduled event", function (finished) {
            var event,
                checkScheduleCreation,
                deleteScheduledEvent,
                validateDeletion;

            event = scheduledEvent.create()
                .withName("deleteTest")
                .withCommand(validCommand)
                .at((new Date()).getTime() + 5000);

            checkScheduleCreation = function (result) {
                var validateSchedule = function (schedule) {
                    expect(schedule).to.have.property("name").to.equal("deleteTest");
//                    console.log(schedule);
                    return schedule.id;
                };

                expect(result).to.have.property("id");
                return hue.getSchedule(result.id).then(validateSchedule);
            };

            deleteScheduledEvent = function (id) {
                var checkDeletion = function (result) {
                    expect(result).to.be.true;
                };

                return hue.deleteSchedule(id)
                    .then(checkDeletion)
                    .then(function () {
                              return id;
                          });
            };

            validateDeletion = function (id) {
                var checkForDeletedSchedule = function (schedules) {
//                        console.log(schedules);

                    schedules.forEach(function (schedule) {
                        expect(schedule.id).to.not.equal(id);
                    });

                    finished();
                };

                return hue.schedules().then(checkForDeletedSchedule);
            };

            hue.scheduleEvent(event)
                .then(checkScheduleCreation)
                .then(deleteScheduledEvent)
                .then(validateDeletion)
                .done();
        });
    });


    describe("#updateSchedule()", function () {

        var scheduleId,
            validateUpdate = function (finished, keys) {
                return function (result) {
                    keys.forEach(function (key) {
                        expect(result).to.have.property(key).to.be.true;
                    });

                    finished();
                };
            };

        beforeEach(function (finished) {
            // Create the schedule that will be used for these test cases
            var schedule = scheduledEvent.create()
                .withName("TEST SCHEDULE")
                .withDescription("A DESCRIPTION")
                .withCommand(validCommand)
                .at("January 1, 2014 12:00:00");

            hue.createSchedule(schedule)
                .then(function (result) {
                          scheduleId = result.id;
                          finished();
                      })
                .done();
        });

        afterEach(function (finished) {
            // Remove the schedule we created for testing
            hue.deleteSchedule(scheduleId).then(function () {
                finished();
            }).done();
        });


        it("should update an existing schedule name", function (finished) {
            hue.updateSchedule(scheduleId, {"name": "xxxxxxxxxxxxxxx"})
                .then(validateUpdate(finished, ["name"]))
                .done();
        });


        it("should update an existing schedule description", function (finished) {
            hue.updateSchedule(scheduleId,
                               {"description": "A new description value for an existing schedule on the Bridge"})
                .then(validateUpdate(finished, ["description"]))
                .done();
        });


        it("should update an existing schedule time", function (finished) {
            hue.updateSchedule(scheduleId, {"time": "December 12, 2015, 12:01:33"})
                .then(validateUpdate(finished, ["time"]))
                .done();
        });


        it("should update an existing schedule command", function (finished) {
            var command = {
                "address": "/api/0/lights/1/state",
                "method" : "PUT",
                "body"   : {
                    "on": false
                }
            };

            hue.updateSchedule(scheduleId, {"command": command})
                .then(validateUpdate(finished, ["command"]))
                .done();
        });


        it("should update multiple values in an existing schedule", function (finished) {
            var updates = {
                "name"       : "New Name",
                "description": "Does Something",
                "time"       : "February 18, 2016 00:00:31",
                "command"    : {
                    "address": "/api/0/lights/invalid",
                    "method" : "GET",
                    "body"   : {
                    }
                }
            };

            hue.updateSchedule(scheduleId, updates)
                .then(validateUpdate(finished, Object.keys(updates)))
                .done();
        });


        it("should error when not updating any valid fields", function (finished) {
            hue.updateSchedule(scheduleId, {"notName": "", "desc": ""})
                .fail(function (error) {
                          expect(error.message).to.contain("A valid property");
                          expect(error.message).to.contain("was not found");
                          finished();
                      })
                .done();
        });
    });
});