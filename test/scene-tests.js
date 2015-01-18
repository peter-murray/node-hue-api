"use strict";

var expect = require("chai").expect
    , assert = require("chai").assert
    , HueApi = require("..").HueApi
//, lightState = require("..").lightState
    , testValues = require("./support/testValues.js")
    ;

describe("Hue API", function () {

    describe("get bridge scenes", function () {

        var hue = new HueApi(testValues.host, testValues.username);

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


    describe("updating scenes", function() {

        describe("updateScene", function() {

            it("using #promise", function(done) {
                done();
            });

            it("using #callback", function(done) {
                done();
            });
        });
    });
});