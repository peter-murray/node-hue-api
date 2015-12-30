"use strict";

var util = require("util")
    , expect = require("chai").expect
    , semver = require("semver")
    , HueApi = require("..").BridgeApi
    , testValues = require("./support/testValues.js")
    ;


describe("Hue API", function () {

    var hue = new HueApi(testValues.host, testValues.username);

    describe("#config", function () {

        function validateConfigResults(results) {
            expect(results).to.be.an.instanceOf(Object);

            expect(results).to.have.property("name");
            expect(results).to.have.property("mac");
            expect(results).to.have.property("dhcp");
            expect(results).to.have.property("ipaddress").to.equal(testValues.host);
            expect(results).to.have.property("gateway");

            expect(results).to.have.property("proxyaddress");
            expect(results).to.have.property("proxyport");

            expect(results).to.have.property("UTC");
            expect(results).to.have.property("localtime");
            expect(results).to.have.property("timezone");

            expect(results).to.have.property("whitelist");

            expect(results).to.have.property("swversion");
            expect(results).to.have.property("apiversion");

            expect(results).to.have.property("swupdate");
            expect(results.swupdate).to.have.property("updatestate");
            expect(results.swupdate).to.have.property("checkforupdate");

            expect(results).to.have.property("linkbutton");

            expect(results).to.have.property("portalservices");
            expect(results).to.have.property("portalconnection");

            expect(results).to.have.property("portalstate");
            expect(results.portalstate).to.have.property("signedon");
            expect(results.portalstate).to.have.property("incoming");
            expect(results.portalstate).to.have.property("outgoing");
        }

        it("using #promise", function (finished) {
            hue.config()
                .then(function (results) {
                    validateConfigResults(results);
                    finished();
                })
                .done();
        });

        it("using #callback", function (finished) {
            hue.config(function (err, results) {
                expect(err).to.be.null;

                validateConfigResults(results);
                finished();
            });
        });
    });


    describe("version", function () {

        function validateVersionResults(results) {
            expect(results).to.be.an.instanceOf(Object);

            expect(results).to.have.property("name");
            expect(results).to.have.property("version");

            expect(results.version).to.have.property("api");
            expect(semver.gte(results.version.api, testValues.version.api)).to.be.true;

            expect(results.version).to.have.property("software");
            expect(parseInt(results.version.software)).to.at.least(parseInt(testValues.version.software));
        }

        function testPromise(name, done) {
            hue[name].apply(hue).then(function (results) {
                validateVersionResults(results);
                done();
            })
                .done();
        }

        function testCallback(name, done) {
            hue[name].apply(hue, [function (err, results) {
                expect(err).to.be.null;

                validateVersionResults(results);
                done();
            }]);
        }

        describe("#version", function () {

            var fnName = "version";

            it("using #promise", function (done) {
                testPromise(fnName, done);
            });

            it("using #callback", function (done) {
                testCallback(fnName, done);
            });
        });

        describe("#getVersion", function () {

            var fnName = "getVersion";

            it("using #promise", function (done) {
                testPromise(fnName, done);
            });

            it("using #callback", function (done) {
                testCallback(fnName, done);
            });
        });
    });


    describe("description", function () {

        function validateDescription(desc) {
            expect(desc).to.have.property("version");
            expect(desc.version).to.have.property("major", "1");
            expect(desc.version).to.have.property("minor", "0");

            expect(desc).to.have.property("url", util.format("http://%s:80/", testValues.host));
            expect(desc).to.have.property("name", util.format("Philips hue (%s)", testValues.host));
            expect(desc).to.have.property("manufacturer", "Royal Philips Electronics");

            expect(desc).to.have.property("model");
            expect(desc.model).to.have.property("name", testValues.model.name);
            expect(desc.model).to.have.property("description", testValues.model.description);
            expect(desc.model).to.have.property("number", testValues.model.number);
            expect(desc.model).to.have.property("serial");
            expect(desc.model).to.have.property("udn", testValues.model.udn);

            expect(desc).to.have.property("icons");
            expect(desc.icons).to.have.length(2);
            //TODO could validate an icon...
        }

        function testPromise(name, done) {
            hue[name].call(hue)
                .then(function (description) {
                    validateDescription(description);
                    done();
                })
                .done();
        }

        function testCallback(name, done) {
            hue[name].apply(hue, [function (err, result) {
                expect(err).to.be.null;
                validateDescription(result);
                done();
            }]);
        }

        describe("#description()", function () {

            it("using #promise", function (done) {
                testPromise("description", done);
            });

            it("using #callback", function (done) {
                testCallback("description", done);
            });
        });

        describe("#getDescription()", function () {

            it("using #promise", function (done) {
                testPromise("getDescription", done);
            });

            it("using #callback", function (done) {
                testCallback("getDescription", done);
            });
        });
    });

    describe("full state", function () {

        function validateFullState(state) {
            expect(state).to.be.defined;
            expect(state).to.have.property("lights");
            expect(state).to.have.property("groups");
            expect(state).to.have.property("config");
            expect(state).to.have.property("schedules");
            expect(state).to.have.property("scenes");
            expect(state).to.have.property("rules");
            expect(state).to.have.property("sensors");
        }

        function testCallback(fnName, done) {
            hue[fnName].apply(hue, [(function(err, result) {
                expect(err).to.be.null;
                validateFullState(result);
                done();
            })]
            );
        }

        function testPromise(fnName, done) {
            hue[fnName].call(hue)
                .then(function(state) {
                    validateFullState(state);
                    done();
                })
                .done();
        }

        describe("#fullState()", function() {

            it("using #promise", function(done) {
                testPromise("fullState", done);
            });

            it("using #callback", function(done) {
                testCallback("fullState", done);
            });
        });

        describe("#getFullState()", function() {

            it("using #promise", function(done) {
                testPromise("fullState", done);
            });

            it("using #callback", function(done) {
                testCallback("getFullState", done);
            });
        });
    });

    describe("info", function() {

        function validateTimezones(cb) {
            return function(zones) {
                expect(zones).to.be.defined;
                expect(zones).to.be.instanceOf(Array);
                expect(zones).to.have.length.at.least(430);
                cb();
            };
        }

        describe("#getTimezones()", function() {

            it("using #promise", function(done) {
                hue.getTimezones()
                    .then(validateTimezones(done))
                    .done();
            });

            it("using #callback", function(done) {
                hue.getTimezones(function(err, zones) {
                    expect(err).to.be.null;

                    validateTimezones(done)(zones);
                });
            });
        });

        describe("#timezones()", function() {
            it("using #promise", function(done) {
                hue.timezones()
                    .then(validateTimezones(done))
                    .done();
            });

            it("using #callback", function(done) {
                hue.timezones(function(err, zones) {
                    expect(err).to.be.null;

                    validateTimezones(done)(zones);
                });
            });
        });
    });
});