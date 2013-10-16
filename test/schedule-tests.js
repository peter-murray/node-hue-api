"use strict";

var expect = require("chai").expect,
    assert = require("chai").assert,
    HueApi = require("../hue-api"),
    scheduledEvent = require("../hue-api/scheduledEvent"),
    ApiError = require("../index").ApiError,
    testValues = require("./support/testValues.js");

describe("Hue API", function () {

    var hue = new HueApi(testValues.host, testValues.username),

        validCommand = {
            "address": "/api/" + testValues.username + "/lights/5/state",
            "method" : "PUT",
            "body"   : {
                "on": true
            }
        };

    function testComplete(finished) {
        return function () {
            finished();
        };
    }

    function removeSchedule(id) {
        return hue.deleteSchedule(id).then(function (result) {
            expect(result).to.be.true;
        });
    }

    function generateTestScheduleEvent() {
        var now = Date.now(),
            time = new Date(now);

        // Take into account local time zones and daylight savings
        time = now + (-1 * time.getTimezoneOffset() * 60 * 60 * 100) + 10000;

        return scheduledEvent.create()
            .withName("createTest")
            .withCommand(validCommand)
            .at(time);
    }


    describe("scheduleTests", function () {

        //TODO need a test for get all schedules

        describe("#scheduleEvent", function () {

            function checkResults(result) {
                expect(result).to.exist;
                expect(result).to.have.property("id").to.not.be.null;

                return result.id;
            }

            describe("using #promise", function () {

                it("should schedule a valid event", function (finished) {
                    hue.scheduleEvent(generateTestScheduleEvent())
                        .then(checkResults)
                        .then(removeSchedule)
                        .then(testComplete(finished))
                        .done();
                });
            });

            describe("using #callback", function () {

                it("should schedule a valid event", function (finished) {

                    hue.scheduleEvent(generateTestScheduleEvent(), function (err, result) {
                        expect(err).to.be.null;
                        checkResults(result);

                        // Clean up the created schedule
                        removeSchedule(result.id).then(function () {
                            finished();
                        }).done();
                    });
                });
            });
        });


        describe("#deleteSchedule", function () {

            var scheduleId;

            beforeEach(function (finished) {
                hue.createSchedule(generateTestScheduleEvent())
                    .then(function (result) {
                              scheduleId = result.id;
                          })
                    .then(testComplete(finished))
                    .done();
            });

            describe("using #promise", function () {

                it("should remove existing schedule", function (finished) {
                    hue.deleteSchedule(scheduleId)
                        .then(function (result) {
                                  expect(result).to.be.true;
                              })
                        .then(testComplete(finished))
                        .done();
                });
            });


            describe("using #callback", function () {

                it("should remove existing schedule", function (finished) {
                    hue.deleteSchedule(scheduleId, function (err, result) {
                        expect(err).to.be.null;
                        expect(result).to.be.true;
                        finished();
                    });
                });
            });
        });


        describe("#updateSchedule", function () {

            var scheduleId;

            function validateUpdate(keys) {
                return function (result) {
                    keys.forEach(function (key) {
                        expect(result).to.have.property(key).to.be.true;
                    });
                };
            }

            function validAlternativeCommand() {
                return {
                    "address": "/api/0/lights/1/state",
                    "method" : "PUT",
                    "body"   : {
                        "on": false
                    }
                };
            }

            beforeEach(function (finished) {
                hue.createSchedule(generateTestScheduleEvent())
                    .then(function (result) {
                              scheduleId = result.id;
                              finished();
                          })
                    .done();
            });

            afterEach(function (finished) {
                hue.deleteSchedule(scheduleId)
                    .then(function (result) {
                              expect(result).to.be.true;
                              finished();
                          })
                    .done();
            });

            describe("using #promise", function () {

                it("should update an existing schedule name", function (finished) {

                    hue.updateSchedule(scheduleId, {"name": "xxxxxxxxxxxxxxx"})
                        .then(validateUpdate(["name"]))
                        .then(testComplete(finished))
                        .done();
                });

                it("should update an existing schedule description", function (finished) {
                    hue.updateSchedule(scheduleId,
                                       {"description": "A new description value for an existing schedule on the Bridge"})
                        .then(validateUpdate(["description"]))
                        .then(testComplete(finished))
                        .done();
                });

                it("should update an existing schedule time", function (finished) {
                    hue.updateSchedule(scheduleId, {"time": "December 12, 2015, 12:01:33"})
                        .then(validateUpdate(["time"]))
                        .then(testComplete(finished))
                        .done();
                });

                it("should update an existing schedule command", function (finished) {
                    hue.updateSchedule(scheduleId, {"command": validAlternativeCommand()})
                        .then(validateUpdate(["command"]))
                        .then(testComplete(finished))
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
                        .then(validateUpdate(Object.keys(updates)))
                        .then(testComplete(finished))
                        .done();
                });

                it("should error when not updating any valid fields", function (finished) {
                    hue.updateSchedule(scheduleId, {"notName": "", "desc": ""})
                        .fail(function (error) {
                                  expect(error.message).to.contain("No valid values for updating the schedule");
                                  finished();
                              })
                        .done();
                });
            });

            describe("using #callback", function () {

                it("should update an existing schedule name", function (finished) {

                    hue.updateSchedule(scheduleId, {"name": "xxxxxxxxxxxxxxx"}, function (err, results) {
                        expect(err).to.be.null;
                        validateUpdate(["name"])(results);
                        finished();
                    });
                });

                it("should update an existing schedule description", function (finished) {
                    hue.updateSchedule(scheduleId,
                                       {"description": "A new description value for an existing schedule on the Bridge"},
                                       function (err, results) {
                                            expect(err).to.be.null;
                                           validateUpdate(["description"])(results);
                                           finished();
                                       });
                });

                it("should update an existing schedule time", function (finished) {
                    hue.updateSchedule(scheduleId, {"time": "December 12, 2015, 12:01:33"}, function(err, results) {
                        expect(err).to.be.null;
                        validateUpdate(["time"])(results);
                        finished();
                    });
                });

                it("should update an existing schedule command", function (finished) {
                    hue.updateSchedule(scheduleId, {"command": validAlternativeCommand()}, function(err, results) {
                        expect(err).to.be.null;
                        validateUpdate(["command"])(results);
                        finished();
                    })
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

                    hue.updateSchedule(scheduleId, updates, function(err, results) {
                        expect(err).to.be.null;
                        validateUpdate(Object.keys(updates))(results);
                        finished();
                    });
                });

                it("should error when not updating any valid fields", function (finished) {
                    hue.updateSchedule(scheduleId, {"notName": "", "desc": ""}, function(err, results) {
                        expect(err.message).to.contain("No valid values for updating the schedule");
                        expect(results).to.be.null;
                        finished();
                    });
                });
            });
        });
    });
});