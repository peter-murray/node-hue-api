//
//
// Tests for using the Schedule object to build up schedules for the Hue Bridge.
//
//

var expect = require("chai").expect,
    schedule = require("../index").scheduledEvent,
    ApiError = require("../index").ApiError,
    testValues = require("./support/testValues");

describe("ScheduleEvent", function () {
    var scheduledEvent;

    beforeEach(function () {
        scheduledEvent = schedule.create();
    });

    describe("creation", function () {

        it("should create an object", function () {
            expect(scheduledEvent).to.exist;
            expect(scheduledEvent).to.be.empty;
        });
    });


    describe("time value", function () {

        it("should accept valid string time value", function () {
            var timeString = "2013-08-12T12:00:00";

            scheduledEvent.on(timeString);
            expect(scheduledEvent).to.have.property("time").to.equal(timeString);

            timeString = "2011-01-01T00:00:01";
            scheduledEvent.on(timeString);
            expect(scheduledEvent).to.have.property("time").to.equal(timeString);
        });

        it("should convert valid Date values from strings", function () {
            var timeString = "October 13, 1975 11:13:00"; //BST which is UTC+1

            scheduledEvent.on(timeString);
            expect(scheduledEvent).to.have.property("time").to.equal("1975-10-13T10:13:00");

            timeString = "Wed, 09 Aug 1995 00:00:00 GMT";
            scheduledEvent.on(timeString);
            expect(scheduledEvent).to.have.property("time").to.equal("1995-08-09T00:00:00");
        });

        it("should not accept invalid date strings", function () {
            try {
                scheduledEvent.on("1995-00-00T00:00:00");
                expect.fail("should have got a parsing error");
            }
            catch (error) {
                if (error instanceof ApiError) {
                    expect(error.message).to.contain("Invalid time value");
                } else {
                    throw error;
                }
            }
        });

        it("should accept a valid Date instance", function () {
            var time = new Date();

            scheduledEvent.on(time);
            expect(scheduledEvent).to.have.property("time").to.equal(time.toJSON().substr(0, 19));

            time = new Date(2007, 12, 1, 12, 30, 31);
            scheduledEvent.on(time);
            expect(scheduledEvent).to.have.property("time").to.equal(time.toJSON().substr(0, 19));
        });
    });


    describe("withName()", function () {

        var maxNameLength = testValues.maxScheduleNameLength;

        it("should accept a name", function () {
            scheduledEvent.withName("Simple Event");
            expect(scheduledEvent).to.have.property("name").to.equal("Simple Event");
        });

        it("should shorten really long names and shorten it", function () {
            var name = "A really long name that is longer than the allowed " + maxNameLength + " characters for a name";
            scheduledEvent.withName(name);
            expect(scheduledEvent).to.have.property("name").with.length(maxNameLength);
            expect(scheduledEvent.name).to.equal(name.substr(0, maxNameLength));
        });
    });


    describe("withDescription()", function () {

        it("should accept a description", function () {
            var descriptionValue = "A description is a longer string value compared with name";

            scheduledEvent.withDescription(descriptionValue);
            expect(scheduledEvent).to.have.property("description").to.equal(descriptionValue);
        });

        it("should accept a really long description and shorten it", function () {
            var descriptionValue = "A description is a longer string value compared with name but this one is too " +
                                   "long as it should only be 64 characters in total";

            scheduledEvent.withDescription(descriptionValue);
            expect(scheduledEvent).to.have.property("description").to.have.length(64);
            expect(scheduledEvent.description).to.equal(descriptionValue.substr(0, 64));
        });
    });


    describe("withCommand()", function () {

        it("should take a command string", function () {
            var commandValue = '{' +
                               '    "address": "/api/0/groups/1/action",' +
                               '    "method": "PUT",' +
                               '    "body": { "on": true }' +
                               '}';

            scheduledEvent.withCommand(commandValue);
            expect(scheduledEvent).to.have.property("command");
            _verifyCommandsMatch(scheduledEvent.command, commandValue);
        });

        it("should take a command object", function () {
            var commandValue = {
                "address": "/api/1/groups/0/action",
                "method" : "PUT",
                "body"   : {
                    "on": false
                }
            };

            scheduledEvent.withCommand(commandValue);
            expect(scheduledEvent).to.have.property("command");
            _verifyCommandsMatch(scheduledEvent.command, commandValue);
        });
    });


    describe("create() from object", function () {

        it("should load name and description values", function () {
            var values = {
                "name"       : "my object",
                "description": "An object to populate a schedule",
                "ignore"     : "a value to ignore"
            };

            scheduledEvent = schedule.create(values);
            expect(scheduledEvent).to.have.property("name").to.equal(values.name);
            expect(scheduledEvent).to.have.property("description").to.equal(values.description);

            expect(scheduledEvent.ignore).to.be.undefined;

            expect(scheduledEvent.time).to.be.undefined;
            expect(scheduledEvent.command).to.be.undefined;
        });

        it("should load the time", function () {
            var values = {
                "time": (new Date()).toJSON().substr(0, 19)
            };

            scheduledEvent = schedule.create(values);
            expect(scheduledEvent).to.have.property("time").to.equal(values.time);
        });

        it("should load a command", function () {
            var values = {
                "command": '{"address":"/api/a/path/goes/here","method":"PUT","body":{}}'
            };

            scheduledEvent = schedule.create(values);
            expect(scheduledEvent).to.have.property("command");
            _verifyCommandsMatch(scheduledEvent.command, values.command);
        });


        //TODO test a completely formed object, name, description, command and time
    });
});

function _verifyCommandsMatch(scheduleCommand, expectedCommand) {
    var convert = function (value) {
            var result;
            if (typeof (value) === 'string') {
                result = JSON.parse(value);
            } else {
                result = value;
            }
            return result;
        },

        cmdScheduled = convert(scheduleCommand),
        cmdExpected = convert(expectedCommand);

    expect(cmdScheduled).to.deep.equal(cmdExpected);
}