"use strict";

var expect = require("chai").expect
    , hue = require("../")
    , testValues = require("./support/testValues.js")
    ;


describe("Hue API", function () {

    describe("#discovery", function() {

        describe("#searchForBridges", function() {
            this.timeout(8000);

            it ("should find my bridge on the Network", function (done) {
                hue.searchForBridges(testValues.locateTimeout).then(_validateBridgeResults(done)).done();
            });
        });

        describe("#locateBridges", function() {

            it ("should find my bridge on the Network using #promise", function (done) {
                hue.locateBridges().then(_validateBridgeResults(done)).done();
            });

            it ("should find my bridge on the Network using #callback", function (done) {
                hue.locateBridges(function(err, results) {
                    expect(err).to.be.null;
                    _validateBridgeResults(done)(results);
                });
            });
        });
    });
});

function _validateBridgeResults(finished) {
    return function(results) {
        expect(results).to.be.instanceOf(Array);
        expect(results).to.have.length.at.least(1);

        expect(results[0]).to.have.property("ipaddress").to.equal(testValues.host);

        finished();
    };
}