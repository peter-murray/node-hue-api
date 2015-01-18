"use strict";

var api = require("../index.js"),
    testValues = require("./support/testValues.js"),
    expect = require("chai").expect;

//TODO update these tests
describe.skip("Hue API", function () {

//todo validate the _config object
    describe("#creation", function() {

        it("should have a default timeout", function(){
            var hue = new api.HueApi(testValues.host, testValues.username);

            expect(hue).to.have.property("timeout", 10000);
        });

        it("should have a non-default timeout if specified", function(){
            var hue = new api.HueApi(testValues.host, testValues.username, 30000);

            expect(hue).to.have.property("timeout", 30000);
        });
    });
});