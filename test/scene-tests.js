"use strict";

var expect = require("chai").expect
    , assert = require("chai").assert
    , HueApi = require("..").HueApi
    , lightState = require("..").lightState
    , testValues = require("./support/testValues.js")
    ;

describe("Hue API", function () {

    var hue = new HueApi(testValues.host, testValues.username);

    describe("get bridge scenes", function () {

        function validateScenesResult(scenes) {
            expect(scenes).to.be.defined;
            expect(scenes).to.be.instanceOf(Array);

            expect(scenes[0]).to.have.property("id");
            expect(scenes[0]).to.have.property("name");
            expect(scenes[0]).to.have.property("lights").to.be.instanceOf(Array);
            expect(scenes[0]).to.have.property("active").to.be.true;
        }

        function testPromise(fnName, done) {
            hue[fnName].call(hue)
                .then(validateScenesResult)
                .then(done)
                .done();
        }

        function testCallback(fnName, done) {
            hue[fnName].apply(hue, [function (err, result) {
                expect(err).to.be.null;
                validateScenesResult(result);
                done();
            }
            ]);
        }

        describe("#scenes", function () {

            it("using #promise", function (done) {
                testPromise("scenes", done);
            });

            it("using #callback", function (done) {
                testCallback("scenes", done);
            });
        });

        describe("#getScenes", function () {

            it("using #promise", function (done) {
                testPromise("getScenes", done);
            });

            it("using #callback", function (done) {
                testCallback("getScenes", done);
            });
        });
    });


    describe("get a scene", function () {

        describe("#scene()", function () {

            var sceneId = "7";

            function validateResult(cb) {
                return function (result) {
                    expect(result).to.be.defined;

                    expect(result).to.have.property("id", sceneId);
                    expect(result).to.have.property("name", "7");
                    expect(result).to.have.property("lights");
                    expect(result.lights).to.be.instanceOf(Array);

                    cb();
                };
            }

            it("using #promise", function (done) {
                hue.scene(sceneId)
                    .then(validateResult(done))
                    .done();
            });

            it("using #callback", function (done) {
                hue.scene(sceneId, function (err, result) {
                    expect(err).to.be.null;

                    validateResult(done)(result);
                });
            });
        });

        describe("#getScene()", function () {
            var sceneId = "0";

            function validateResult(cb) {
                return function (result) {
                    expect(result).to.be.defined;

                    expect(result).to.have.property("id", sceneId);
                    expect(result).to.have.property("name", "test-0");
                    expect(result).to.have.property("lights");
                    expect(result.lights).to.be.instanceOf(Array);
                    expect(result.lights).to.have.members(["1", "2"]);

                    cb();
                };
            }

            it("using #promise", function (done) {
                hue.getScene(sceneId)
                    .then(validateResult(done))
                    .done();
            });

            it("using #callback", function (done) {
                hue.getScene(sceneId, function (err, result) {
                    expect(err).to.be.null;

                    validateResult(done)(result);
                });
            });
        });
    });


    describe("create scene", function () {

        var name = "node-hue-test-scene"
            , lightIds = ["1", "2"]
            ;

        function validateResult(cb) {
            return function (result) {
                expect(result).to.be.defined;
                expect(result).to.have.property("id");
                expect(result.id).to.contain("node-hue-api");
                expect(result).to.have.property("name", name);

                expect(result).to.have.property("lights");
                expect(result.lights).to.be.instanceOf(Array);
                expect(result.lights).to.have.members(lightIds);

                cb();
            };
        }

        describe("#createScene()", function () {

            it("using #promise", function (done) {
                hue.createScene(lightIds, name)
                    .then(validateResult(done))
                    .done();
            });

            it("using #callback", function (done) {
                hue.createScene(lightIds, name, function (err, result) {
                    expect(err).to.be.null;
                    validateResult(done)(result);
                });
            });
        });

    });


    describe("updating scenes", function () {

        //TODO add tests for the name being changed as well

        var sceneId = "nha-00"
            , idx = 0
            , lightIds = [
                ["1", "2", "4"],
                ["4", "5"]
            ]
            ;

        function validateResult(cb, lightIds) {
            return function (result) {
                expect(result).to.be.defined;

                expect(result).to.have.property("id", sceneId);
                expect(result).to.have.property("lights");
                expect(result.lights).to.be.instanceOf(Array);
                expect(result.lights).to.have.members(lightIds);

                cb();
            };
        }


        describe("updateScene", function () {

            it("using #promise", function (done) {
                idx = 0;

                hue.updateScene(sceneId, lightIds[idx])
                    .then(validateResult(done, lightIds[idx]))
                    .done();
            });

            it("using #callback", function (done) {
                idx = 1;

                hue.updateScene(sceneId, lightIds[idx], function (err, result) {
                    expect(err).to.be.null;
                    validateResult(done, lightIds[idx])(result);
                });
            });
        });
    });


    describe("modifying scenes", function () {

        describe("#setSceneLightState()", function () {

            describe("update existing", function () {

                var sceneId = "node-hue-api-0"
                    , lightId = 1
                    ;

                it("using #promise", function (done) {
                    var state = lightState
                        .create()
                        .on()
                        .hue(0);

                    hue.setSceneLightState(sceneId, lightId, state)
                        .then(function (results) {
                            expect(results).to.be.defined;
                            expect(results).to.have.property("on", true);
                            expect(results).to.have.property("hue", true);

                            done();
                        })
                        .done();
                });

                it("using #callback", function(done) {
                    var state = lightState
                        .create()
                        .on()
                        .hue(10000);

                    hue.setSceneLightState(sceneId, 2, state, function(err, results) {
                        expect(err).to.be.null;

                        expect(results).to.be.defined;
                        expect(results).to.have.property("on", true);
                        expect(results).to.have.property("hue", true);

                        done();
                    });
                });
            });

            //TODO create a new scene
        });
    });


    describe("activating scenes", function () {

        describe("#activateScene()", function () {

            var sceneId = "node-hue-api-0";

            it("using #promise", function (done) {
                hue.activateScene(sceneId)
                    .then(function (result) {
                        expect(result).to.be.true;
                        done();
                    })
                    .done();
            });

            it("using #callback", function (done) {
                hue.activateScene(sceneId, function (err, result) {
                    expect(err).to.be.null;
                    expect(result).to.be.true;
                    done();
                });
            });
        });
    });

    //TODO need more tests
});