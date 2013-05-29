"use strict";

var HueApi = require("../hue-api"),
    ApiError = require("../hue-api/errors").ApiError,
    testValues = require("./support/testValues.js"),
    expect = require("chai").expect,
    Q = require("q");


describe("Hue API", function () {

    describe("#config", function () {

        var hue = new HueApi(testValues.host, testValues.username);

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
            expect(results).to.have.property("whitelist");
            expect(results).to.have.property("swversion");
            expect(results).to.have.property("swupdate");
            expect(results).to.have.property("linkbutton");
            expect(results).to.have.property("portalservices");
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
});