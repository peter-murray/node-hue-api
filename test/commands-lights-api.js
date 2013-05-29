var lightsApi = require("../hue-api/commands/lights-api"),
    expect = require("chai").expect;


describe("Light API Commands", function () {

    describe("#getAllLightsCommand", function() {

        it("should be instantiable", function() {
            var command = lightsApi.getAllLights;

            console.log(command);
            console.log(command.pathParameters());
        });
    });

    //TODO add all the others

    describe("#renameLight", function() {

        it("should be instantiable", function() {
            var command = lightsApi.renameLight;

            console.log(command);
            console.log(command.pathParameters());
        });
    });


    describe("#setLightState", function() {

        it("should be instantiable", function() {
            var command = lightsApi.setLightState;

            console.log(command);
            console.log(command.pathParameters());
        });
    });

    //TODO more tests here
});