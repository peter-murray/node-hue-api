"use strict";

var HueApi = require("../hue-api"),
    ApiError = require("../hue-api/errors").ApiError,
    testValues = require("./support/testValues.js"),
    expect = require("chai").expect,
    Q = require("q");


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

    describe("#getVersion", function () {

        function validateVersionResults(results) {
            expect(results).to.be.an.instanceOf(Object);

            expect(results).to.have.property("name");
            expect(results).to.have.property("version");
            expect(results.version).to.have.property("api", testValues.version.api);
            expect(results.version).to.have.property("software", testValues.version.software);
        }

        it("using #promise", function (done) {
            hue.getVersion()
                .then(function (results) {
                    validateVersionResults(results);
                    done();
                })
                .done();
        });

        it("using #callback", function (done) {
            hue.getVersion(function (err, results) {
                expect(err).to.be.null;

                validateVersionResults(results);
                done();
            });
        });
    });
});