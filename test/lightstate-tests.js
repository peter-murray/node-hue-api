//
//
// Tests for using the LightState object to build up states for the Hue Bridge.
//
//

var expect = require("chai").expect,
    lightState = require("../index.js").lightState;

describe("Light State", function () {
    var state;

    beforeEach(function () {
        state = lightState.create();
    });

    describe("creation", function () {

        it("should create an object", function () {
            expect(state).to.exist;
            expect(state).to.be.empty;
        });
    });

    describe("with single state", function () {

        it("'on'", function () {
            state.on();
            expect(state).to.have.keys("on");
            expect(state).to.have.property("on").that.equals(true);
        });

        it("'off'", function () {
            state.off();
            expect(state).to.have.keys("on");
            expect(state).to.have.property("on").that.equals(false);
        });

        it("short 'alert' when not specified", function () {
            state.alert();
            expect(state).to.have.keys("alert");
            expect(state).to.have.property("alert").that.equals("select");
        });

        it("short 'alert' when specified", function () {
            state.alert(false);
            expect(state).to.have.keys("alert");
            expect(state).to.have.property("alert").that.equals("select");
        });

        it("long 'alert'", function () {
            state.alert(true);
            expect(state).to.have.keys("alert");
            expect(state).to.have.property("alert").that.equals("lselect");
        });

        it("'brightness'", function () {
            state.brightness(100);
            expect(state).to.have.keys("bri");
            expect(state).to.have.property("bri").that.equals(254);
        });

        it("'white'", function () {
            state.white(154, 100);
            expect(state).to.have.keys("ct", "bri");
            expect(state).to.have.property("ct").that.equals(154);
            expect(state).to.have.property("bri").that.equals(254);
        });

        it("'rgb'", function () {
            state.rgb(200, 200, 200);
            expect(state).to.have.keys("hue", "sat", "bri");
            //TODO could put checks in for values...
        });
    });

    describe("with chained states", function () {

        it("'on' and 'brightness'", function () {
            state.on().brightness(10);
            expect(state).to.have.keys("on", "bri");

            expect(state).to.have.property("on").that.equals(true);
            expect(state).to.have.property("bri").that.equals(25);
        });

        //TODO add more...
    });
});