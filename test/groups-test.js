var api = require("../index.js").hue,
    testValues = require("./support/testValues.js"),
    expect = require("chai").expect;


describe("Hue API", function () {
    var hue = new api.HueApi(testValues.host, testValues.username);

    describe("#groups", function () {

        it("should obtain all defined groups", function (finished) {
            hue.groups().then(function (results) {

                expect(results).to.be.instanceOf(Array);
                expect(results).to.have.length.greaterThan(0);

                // The first result should always be that of the all lights group
                expect(results[0].id).to.equal("0");
                expect(results[0].name).to.equal("All Lights");

                //TODO expand tests to cover other groups
//                console.log(results);

                finished();
            }).done();
        });
    });

    describe("#getGroup", function () {
        it("should obtain 'All Lights' group details", function (finished) {
            var checkResults = function (groupDetails) {
                expect(groupDetails).to.have.property("id").to.equal("0");
                expect(groupDetails).to.have.property("name").to.equal("All Lights");
                expect(groupDetails).to.have.property("lastAction");

                expect(groupDetails).to.have.property("lights").to.be.instanceOf(Array);
                expect(groupDetails.lights).to.have.length(5);
                finished();
            };

            hue.getGroup(0).then(checkResults).done();
        });

        it("should fail for a group id that does not exist", function (finished) {
            var checkError = function (err) {
                    expect(err).to.have.property("type").to.equal(3);
                    expect(err).to.have.property("message").to.contain("resource");
                    expect(err).to.have.property("message").to.contain("not available");
                    finished();
                },
                failTest = function () {
                    expect.fail("Should have got an error");
                    finished();
                };

            hue.getGroup(999)
                .then(failTest)
                .fail(checkError)
                .done();
        });
    });


    describe("#createGroup", function () {
        it("should create a new group", function (finished) {
            //TODO there appears to be a limit of 16 chars, unless there is a duplicate of the name, in which case a " x" is added where x is a number
            var groupName = "NodejsApiTest",
                createdGroupId,

                checkResults = function (result) {
                    expect(result).to.have.property("id");
                    createdGroupId = result.id;
                    return createdGroupId;
                },

                loadGroupDetails = function (id) {
                    return hue.getGroup(id);
                },

                validateCreatedGroup = function (group) {
                    expect(group).to.have.property("id").to.equal(createdGroupId);

                    // if a duplicate is found a " x" will be appended hence why this check is not equals
                    expect(group).to.have.property("name").to.have.string(groupName);

                    expect(group).to.have.property("lights").to.be.instanceOf(Array);
                    expect(group.lights).to.contain("1", "2", "3"); //TODO extract as variable
                    finished();
                };

            hue.createGroup(groupName, [1, "2", "3"])
                .then(checkResults)
                .then(loadGroupDetails)
                .then(validateCreatedGroup)
                .done();
        });
    });


    describe("#deleteGroup", function () {
        it("should delete a group", function (finished) {
            var groupId,
                validateDeletion = function (result) {
                    expect(result).to.be.true;
                    //TODO check that the group id no longer exists
                    finished();
                },

                deleteGroup = function (group) {
                    groupId = group.id;
                    return hue.deleteGroup(groupId).then(validateDeletion);
                };

            hue.createGroup("to_delete", 1)
                .then(deleteGroup)
                .done();
        });
    });

    describe("#updateGroup", function () {

        it("should update the name of a group", function (finished) {
            var validateName = function (group) {
                    return hue.getGroup(group.id)
                        .then(function (details) {
                                  expect(details.name).to.have.string("test-Rename");
                                  return details.id;
                              });
                },

                changeName = function (id) {
                    return hue.updateGroup(id, "test-Renamed")
                        .then(function (result) {
                                  expect(result).to.be.true;
                                  return id;
                              });
                },

                validateRename = function (id) {
                    return hue.getGroup(id)
                        .then(function (details) {
                                  expect(details.name).to.have.string("test-Renamed");
                                  finished();
                              });
                };

            hue.createGroup("test-Rename", 1)
                .then(validateName)
                .then(changeName)
                .then(validateRename)
                .done();
        });

        it("should update the lights in a group", function (finished) {
            var validateLights = function (group) {
                    return hue.getGroup(group.id)
                        .then(function (details) {
                                  expect(details.lights).to.have.length(3);
                                  expect(details.lights).to.contain("1", "2", "3");
                                  return group.id;
                              });
                },

                changeLights = function (id) {
                    return hue.updateGroup(id, [3, 4, 5])
                        .then(function (result) {
                                  expect(result).to.be.true;
                                  return id;
                              });
                },

                validateChangedLights = function (id) {
                    return hue.getGroup(id)
                        .then(function (details) {
                                  expect(details.lights).to.have.length(3);
                                  expect(details.lights).to.contain("3", "4", "5");
                                  finished();
                              });
                };

            hue.createGroup("test-LightIds", [1, 2, 3])
                .then(validateLights)
                .then(changeLights)
                .then(validateChangedLights)
                .done();
        });

        it("should update name and light ids", function (finished) {
            var validateGroup = function (group) {
                    return hue.getGroup(group.id)
                        .then(function (details) {
                                  expect(details.name).to.have.string("test-all");
                                  expect(details.lights).to.have.length(1);
                                  expect(details.lights).to.contain("1");
                                  return group.id;
                              });
                },

                changeGroup = function (id) {
                    return hue.updateGroup(id, "test-yall", [2, 3])
                        .then(function (result) {
                                  expect(result).to.be.true;
                                  return id;
                              });
                },

                validateGroupChange = function (id) {
                    return hue.getGroup(id)
                        .then(function (details) {
                                  expect(details.name).to.have.string("test-yall");
                                  expect(details.lights).to.have.length(2);
                                  expect(details.lights).to.contain("2", "3");
                                  finished();
                              });
                };

            hue.createGroup("test-all", [1])
                .then(validateGroup)
                .then(changeGroup)
                .then(validateGroupChange)
                .done();
        });

        it("should fail on invalid group", function (finished) {
            var failIfCalled = function() {
                    expect.fail("The function call should have produced an error for invalid group id");
                    finished();
                },

                checkError = function(err) {
                    expect(err.type).to.equal(3);
                    expect(err.message).to.contain("resource,");
                    expect(err.message).to.contain("not available");
                    finished();
                };

            hue.updateGroup(99, "a name")
                .then(failIfCalled)
                .fail(checkError)
                .done();
        });
    });
});
