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

                removeSchedule = function(id) {
                    return hue.deleteSchedule(id).then(function(result) {
                        expect(result).to.be.true;
                        finished();
                    });
                },

                event = scheduledEvent.create()
                    .withName("createTest")
                    .withCommand(validCommand)
                    .at(new Date());

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
                .at(new Date());

            checkScheduleCreation = function (result) {
                var validateSchedule = function(schedule) {
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

                        schedules.forEach(function(schedule) {
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
});