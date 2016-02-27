"use strict";

var expect = require("chai").expect
    , lightState = require("..").lightState
    ;

describe("#LightState", function () {

    var state;

    beforeEach(function () {
        state = lightState.create();
    });

    describe("creation", function () {

        it("should create an empty object", function () {
            expect(state).to.exist;
            expect(state.payload()).to.be.empty;
        });
    });

    describe("set single state", function () {

        describe("on", function () {

            describe("#on", function() {

                function test(value, expected) {
                    state.on(value);
                    validateOnState(expected);
                }

                it("#on with no value", function () {
                    state.on();
                    validateOnState(true);
                });

                it("set to true", function () {
                    test(true, true);
                });

                it("set to false", function () {
                    test(false, false);
                });
            });

            describe("#off", function() {

                it("should set on property to false", function () {
                    state.off();
                    validateOnState(false);
                });
            });
        });


        describe("effect", function () {

            describe("#effect", function () {

                it("should accept 'none'", function () {
                    state.effect("none");
                    validateEffectState("none");
                });

                it("should accept 'colorloop'", function () {
                    state.effect("colorloop");
                    validateEffectState("colorloop");
                });

                it("should deal with an invalid value and set 'none'", function () {
                    state.effect("disco");
                    validateEffectState("none");
                });

                it("should set effect to none if no parameter provided", function() {
                    state.effect();
                    validateEffectState("none");
                });
            });

            describe("#colorLoop", function () {

                it("should", function() {
                    state.colorLoop();
                    validateEffectState("colorloop");
                });
            });

            describe("#colourLoop", function () {

                it("should", function() {
                    state.colourLoop();
                    validateEffectState("colorloop");
                });
            });

            describe("#effectColorLoop", function () {

                it("should", function() {
                    state.effectColorLoop();
                    validateEffectState("colorloop");
                });
            });

            describe("#effectColourLoop", function () {

                it("should", function() {
                    state.effectColourLoop();
                    validateEffectState("colorloop");
                });
            });
        });


        describe("alert", function () {

            describe("#alert", function () {

                it("should be a short when not specified", function () {
                    state.alert();
                    validateAlertState("none");
                });

                it("should be short when false", function () {
                    state.alert("select");
                    validateAlertState("select");
                });

                it("should be long when true", function () {
                    state.alert("lselect");
                    validateAlertState("lselect");
                });
            });

            describe("#alertLong", function () {

                it("should set a long alert", function () {
                    state.alertLong();
                    validateAlertState("lselect");
                });
            });

            describe("#longAlert", function () {

                it("should set a long alert", function () {
                    state.longAlert();
                    validateAlertState("lselect");
                });
            });

            describe("#alertShort", function () {

                it("should set a short alert", function () {
                    state.alertShort();
                    validateAlertState("select");
                });
            });

            describe("#shortAlert", function () {

                it("should set a short alert", function () {
                    state.shortAlert();
                    validateAlertState("select");
                });
            });
        });


        describe("bri", function () {

            describe("#bri", function () {

                function test(value, expectedValue) {
                    state.bri(value);
                    validateBriState(expectedValue);
                }

                it("should set brightness to 254", function () {
                    test(254, 254);
                });

                it("should set brightness to 0", function () {
                    test(0, 0);
                });

                it("should set brightness to 10", function () {
                    test(10, 10);
                });

                it("should respect min boundary", function () {
                    test(-100, 0);
                });
            });

            describe("#brighness", function () {

                function test(value, expectedValue) {
                    state.brightness(value);
                    validateBriState(expectedValue);
                }

                it("100% should set brightness to 254", function () {
                    test(100, 254);
                });

                it("0% should set brightness to 0", function () {
                    test(0, 0);
                });

                it("50% should set brightness to 155", function () {
                    test(50, 127);
                });

                it("should convert negative to zero", function () {
                    test(-10, 0);
                });
            });
        });


        describe("hue", function() {

            describe("#hue", function() {

                function test(value, expected) {
                    state.hue(value);
                    validateHueState(expected);
                }

                it("should set to zero if not specified", function() {
                    state.hue();
                    validateHueState(0);
                });

                it("should respect minimum boundary", function() {
                    test(-1, 0);
                });

                it("should respect maximum boundary", function() {
                    test(65536, 65535);
                });

                it("should set to 1", function() {
                    test(1, 1);
                });

                it("should set to 15000", function() {
                    test(15000, 15000);
                });
            })
        });


        describe("sat", function() {

            describe("#sat", function() {

                function test(value, expected) {
                    state.sat(value);
                    validateSatState(expected);
                }

                it("should set to 0", function() {
                    test(0, 0);
                });

                it("should set to 255", function() {
                    test(255, 255);
                });

                it("should set to 125", function() {
                    test(125, 125);
                });

                it ("should respect min boundary", function() {
                    test(-1, 0);
                });

                it ("should respect max boundary", function() {
                    test(300, 255);
                });

                it("should set to 0 if not specified", function() {
                    state.sat();
                    validateSatState(0);
                });
            });

            describe("#saturation", function() {

                function test(value, expected) {
                    state.saturation(value);
                    validateSatState(expected);
                }

                it("should set 0%", function() {
                   test(0, 0);
                });

                it("should set 100%", function() {
                    test(100, 255);
                });

                it("should set 50%", function() {
                    test(50, 127);
                });

                it("should convert -100% to 0", function() {
                    test(-100, 0);
                });

                it("should convert 200% to 255", function() {
                    test(200, 255);
                });
            });
        });


        describe("#xy", function() {

            function test(x, y, expected) {
                var payload;

                state.xy(x, y);
                payload = state.payload();

                validateXYState(expected);
            }

            it("should set (0,0)", function() {
                test(0, 0, [0,0]);
            });

            it("should set (0, 1)", function() {
                test(0, 1, [0, 1]);
            });

            it("should set (1, 1)", function() {
                test(1, 1, [1, 1]);
            });

            it("should set (0.254, 0.5)", function() {
                test(0.254, 0.5, [0.254, 0.5]);
            });

            it("should support an array of [x, y]", function() {
                test([0.5, 0.6], null, [0.5, 0.6]);
            });

            describe("x value boundaries", function() {

                it("should convert -1 to 0", function() {
                    test(-1, 0.5, [0, 0.5]);
                });

                it("should convert 1.1 to 1", function() {
                    test(1.1, 0.5, [1, 0.5]);
                });
            });

            describe("y value boundaries", function() {

                it("should convert -10.5 to 0", function() {
                    test(-10.5, 0.675, [0, 0.675]);
                });

                it("should convert 10.581 to 1", function() {
                    test(10.581, 0.1, [1, 0.1]);
                });
            });
        });


        describe("ct", function() {

            describe("#ct", function() {

                function test(value, expected) {
                    state.ct(value);
                    validateCTState(expected);
                }

                it("should set 153 (6500K)", function() {
                    test(153, 153);
                });

                it("should set 500 (2000K)", function() {
                    test(500, 500);
                });

                it("should set 212", function() {
                    test(212, 212);
                });

                it("should convert 0 to 153", function() {
                    test(0, 153);
                });

                it ("should convert 600 to 500", function() {
                    test(600, 500);
                });

                it("should set 153 if no parameters provided", function() {
                    state.ct();
                    validateCTState(153);
                })
            });

            describe("#colorTemperature", function() {

                function test(value, expected) {
                    state.colorTemperature(value);
                    validateCTState(expected);
                }

                it("should set 153", function() {
                    test(153, 153);
                });
            });

            describe("#colourTemperature", function() {

                function test(value, expected) {
                    state.colourTemperature(value);
                    validateCTState(expected);
                }

                it("should set 153", function() {
                    test(153, 153);
                });
            });

            describe("#colorTemp", function() {

                function test(value, expected) {
                    state.colorTemp(value);
                    validateCTState(expected);
                }

                it("should set 153", function() {
                    test(153, 153);
                });

                it("should set 300", function() {
                    test(300, 300);
                });
            });

            describe("#colourTemp", function() {

                function test(value, expected) {
                    state.colourTemp(value);
                    validateCTState(expected);
                }

                it("should set 153", function() {
                    test(153, 153);
                });

                it("should set 220", function() {
                    test(220, 220);
                });
            });
        });


        describe("transitiontime", function() {

            describe("#transitiontime", function() {

                function test(value, expected) {
                    state.transitiontime(value);
                    validateTransitionTimeState(expected);
                }

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set 4", function() {
                    test(4, 4);
                });

                it("should set 10", function() {
                    test(10, 10);
                });

                it("should set 36000", function() {
                    test(36000, 36000);
                });

                it("should set 4 if no parameter provided", function() {
                    state.transitiontime();
                    validateTransitionTimeState(4);
                });
            });

            describe("#transitionTime", function() {

                function test(value, expected) {
                    state.transitionTime(value);
                    validateTransitionTimeState(expected);
                }

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set 10", function() {
                    test(10, 10);
                });

                it("should set 65535", function() {
                    test(65535, 65535);
                });

                it("should set 4 if no parameter provided", function() {
                    state.transitionTime();
                    validateTransitionTimeState(4)
                });
            });

            describe("#transitionSlow", function() {

                it("should set 8", function() {
                    state.transitionSlow();
                    validateTransitionTimeState(8);
                });
            });

            describe("#transitionInstant", function() {

                it("should set 0", function() {
                    state.transitionInstant();
                    validateTransitionTimeState(0);
                });
            });

            describe("#transitionDefault", function() {

                it("should set 4", function() {
                    state.transitionDefault();
                    validateTransitionTimeState(4);
                });
            });

            describe("#transitionFast", function() {

                it("should set 2", function() {
                    state.transitionFast();
                    validateTransitionTimeState(2);
                });
            });

            describe("#transition", function() {

                function test(value, expected) {
                    state.transition(value);
                    validateTransitionTimeState(expected);
                }

                it("should set 100ms", function() {
                    test(100, 1);
                });

                it("should set 1000ms", function() {
                    test(1000, 10);
                });

                it("should set 20000ms", function() {
                    test(20000, 200);
                });
            })
        });


        describe("#white", function() {

            function test(temp, bright, expectedCt, expectedBri) {
                state.white(temp, bright);
                validateBriState(expectedBri);
                validateCTState(expectedCt);
            }

            it("should set ct=153, bri=50%", function() {
                test(153, 50, 153, 127);
            });

            it("should set ct=500, bri=100%", function() {
                test(500, 100, 500, 254);
            });

            it("should set ct=0 to ct 153", function() {
                test(0, 0, 153, 0);
            });

            it("should set ct=600 to ct 500", function() {
                test(600, 0, 500, 0);
            });

            it("should set bri=-10% to bri 0%", function() {
                test(153, -10, 153, 0);
            });

            it("should set bri=150% to bri 100%", function() {
                test(153, 150, 153, 254);
            });
        });


        describe("#hsb", function() {

            function test(h, s, b, expectedHue, expectedSat, expectedBri) {
                state.hsb(h, s, b);
                validateHueState(expectedHue);
                validateSatState(expectedSat);
                validateBriState(expectedBri);
            }

            it("should set (0, 0, 0)", function() {
                test(0, 0, 0, 0, 0, 0);
            });

            it("should set (360, 100, 100)", function() {
                test(360, 100, 100, 65535, 255, 254);
            });

            it("should set (180, 50, 25)", function() {
                test(180, 50, 25, 32858, 127, 63);
            });

            //TODO validate limits on each parameter
        });

        describe("#hsl", function() {

            function test(h, s, l, expectedHue, expectedSat, expectedBri) {
                state.hsl(h, s, l);
                validateHueState(expectedHue);
                validateSatState(expectedSat);
                validateBriState(expectedBri);
            }

            it("should set (0, 0, 0)", function() {
                test(0, 0, 0, 0, 0, 0);
            });

            it("should set (360, 100, 100)", function() {
                test(360, 100, 100, 65535, 0, 254);
            });

            it("should set (180, 50, 25)", function() {
                test(180, 50, 25, 32858, 170, 96);
            });

            //TODO validate limits on each parameter
        });

        describe("#rgb", function() {

            function test(r, g, b, expectedRGB) {
                state.rgb(r, g, b);
                validateRGBState(expectedRGB);
            }

            it("should set (255, 255, 255)", function() {
                test(255, 255, 255, [255, 255, 255]);
            });

            it("should set (255, 255, 255)", function() {
                test(255, 255, 255, [255, 255, 255]);
            });

            it("should set (-1, 300, -100) to [0, 255, 0]", function() {
                test(-1, 300, -100, [0, 255, 0]);
            });

            it("should set via an array [r, g, b]", function() {
                test([10, 20, 30], null, null, [10, 20, 30]);
            });
        });

        describe("bri_inc", function() {

            describe("#bri_inc", function() {
                function test(value, expected) {
                    state.bri_inc(value);
                    validateBrightnessIncrement(expected);
                }

                it("should set -254", function() {
                    test(-254, -254);
                });

                it("should set 254", function() {
                    test(254, 254);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -300 as -254", function() {
                    test(-300, -254);
                });

                it("should set 1.5 as 1", function() {
                    test(1.5, 1);
                });
            });

            describe("#incrementBrightness", function() {
                function test(value, expected) {
                    state.incrementBrightness(value);
                    validateBrightnessIncrement(expected);
                }

                it("should set -254", function() {
                    test(-254, -254);
                });

                it("should set 254", function() {
                    test(254, 254);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -300 as -254", function() {
                    test(-300, -254);
                });

                it("should set 1.5 as 1", function() {
                    test(1.5, 1);
                });
            });
        });

        describe("sat_inc", function() {

            describe("#sat_inc", function() {

                function test(value, expected) {
                    state.sat_inc(value);
                    validateSaturationIncrement(expected);
                }

                it("should set -254", function() {
                    test(-254, -254);
                });

                it("should set 254", function() {
                    test(254, 254);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -300 as -254", function() {
                    test(-300, -254);
                });

                it("should set 2.4 as 2", function() {
                    test(2.4, 2);
                });
            });

            describe("#incrementSaturation", function() {

                function test(value, expected) {
                    state.incrementSaturation(value);
                    validateSaturationIncrement(expected);
                }

                it("should set -254", function() {
                    test(-254, -254);
                });

                it("should set 254", function() {
                    test(254, 254);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -300 as -254", function() {
                    test(-300, -254);
                });

                it("should set 2.4 as 2", function() {
                    test(2.4, 2);
                });
            });
        });

        describe("hue_inc", function() {

            describe("#hue_inc", function() {

                function test(value, expected) {
                    state.hue_inc(value);
                    validateHueIncrement(expected);
                }

                it("should set -65534", function() {
                    test(-65534, -65534);
                });

                it("should set 65534", function() {
                    test(65534, 65534);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -65570 as -65534", function() {
                    test(-65570, -65534);
                });

                it("should set 2.4 as 2", function() {
                    test(2.4, 2);
                });
            });

            describe("#incrementHue", function() {

                function test(value, expected) {
                    state.incrementHue(value);
                    validateHueIncrement(expected);
                }

                it("should set -65534", function() {
                    test(-65534, -65534);
                });

                it("should set 65534", function() {
                    test(65534, 65534);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -65570 as -65534", function() {
                    test(-65570, -65534);
                });

                it("should set 2.4 as 2", function() {
                    test(2.4, 2);
                });
            });
        });

        describe("ct_inc", function() {

            describe("#ct_inc", function() {

                function test(value, expected) {
                    state.ct_inc(value);
                    validateCtIncrement(expected);
                }

                it("should set -65534", function() {
                    test(-65534, -65534);
                });

                it("should set 65534", function() {
                    test(65534, 65534);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -65570 as -65534", function() {
                    test(-65570, -65534);
                });

                it("should set -1.2 as -2", function() {
                    test(-1.2, -2);
                });
            });

            describe("#incrementColorTemp", function() {

                function test(value, expected) {
                    state.incrementColorTemp(value);
                    validateCtIncrement(expected);
                }

                it("should set -65534", function() {
                    test(-65534, -65534);
                });

                it("should set 65534", function() {
                    test(65534, 65534);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -65570 as -65534", function() {
                    test(-65570, -65534);
                });

                it("should set -1.2 as -2", function() {
                    test(-1.2, -2);
                });
            });
        });

        describe("xy_inc", function() {

            describe("#xy_inc", function() {

                function test(value, expected) {
                    state.xy_inc(value);
                    validateXYIncrement(expected);
                }

                it("should set -0.5", function() {
                    test(-0.5, -0.5);
                });

                it("should set 0.5", function() {
                    test(0.5, 0.5);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -0.6 as -0.5", function() {
                    test(-0.6, -0.5);
                });
            });

            describe("#incrementXY", function() {

                function test(value, expected) {
                    state.incrementXY(value);
                    validateXYIncrement(expected);
                }

                it("should set -0.5", function() {
                    test(-0.5, -0.5);
                });

                it("should set 0.5", function() {
                    test(0.5, 0.5);
                });

                it("should set 0", function() {
                    test(0, 0);
                });

                it("should set -0.6 as -0.5", function() {
                    test(-0.6, -0.5);
                });
            })
        });
    });


    describe("chaining states", function() {

        it("should chain on().ct(200)", function() {
            state.on().ct(200);

            validateOnState(true);
            validateCTState(200);
        });

        it("should chain on().off().off().on()", function() {
            state.on().off().off().on();

            validateOnState(true);
        });

        describe("using #reset", function() {

            it("set values, reset, then specify more values", function() {
                state.on().hue(0);
                validateOnState(true);
                validateHueState(0);

                state.reset().ct(211);
                validateCTState(211);
                expect(state.payload()).to.not.have.property("on");
                expect(state.payload()).to.not.have.property("hue");

            });
        });
    });


    describe("loading from values object", function() {

        it("should load {on: true, effect: 'colorloop'}", function() {
            state = lightState.create({on: true, effect: "colorloop"});

            validateStateProperties("on", "effect");
            validateEffectState("colorloop");
            validateOnState(true);
        });

        it("should only load valid values", function () {
            var data = {
                on: false,
                name: "hello world",
                sat: 0,
                alert: "none",
                scan: true
            };

            state = lightState.create(data);
            validateStateProperties("on", "sat", "alert");
            validateOnState(false);
            validateSatState(0);
            validateAlertState("none");
        });

        it("should convert invalid property values", function() {
            state = lightState.create({effect: "disco"});

            validateStateProperties("effect");
            validateEffectState("none");
        });

        it("should load rgb", function() {
            state = lightState.create({rgb: [0, 0, 255]});
            validateRGBState([0, 0, 255]);
        });
    });


    describe("#copy", function() {

        it("should create a copy", function() {
            var origState = lightState.create().on()
                , copy = origState.copy()
                ;

            expect(origState == copy).is.false;
            expect(JSON.stringify(copy.payload())).equals(JSON.stringify(origState.payload()));
        });
    });


    describe("#applyRGB", function() {

        it("should apply RGB values for Hue Bulb", function() {
            var rgb = [10, 10, 10]
                , appliedRgb
                , payload
                ;

            state.on().rgb(rgb);
            validateOnState(true);
            validateRGBState(rgb);

            appliedRgb = state.applyRGB("LCT001");
            // Validate that we have not changed the original state
            expect(state.payload).to.not.have.property("xy");

            // Validate the conversion for rgb to xy
            payload = appliedRgb.payload();
            expect(payload).to.have.property("xy");
            expect(payload.xy).to.have.members([0.33618074375880236, 0.3603696362840742]);
            expect(payload).to.have.property("rgb");
            expect(payload.rgb).to.have.members(rgb);
            expect(payload).to.have.property("on", true);
        });

        it("should return null if not RGB value set", function() {
            state.xy(0, 1);

            expect(state.applyRGB("LCT001")).to.be.null;
        });
    });


    function validateStateProperties(expected) {
        var payload = state.payload()
            , actualKeys = Object.keys(payload)
            , expectedKeys = Array.prototype.slice.apply(arguments)
            ;

        expect(actualKeys).to.have.members(expectedKeys);
        expect(actualKeys).to.have.length(expectedKeys.length);
    }

    function validateOnState(expected) {
        expect(state.payload()).to.have.property("on", expected);
    }

    function validateEffectState(expected) {
        expect(state.payload()).to.have.property("effect", expected);
    }

    function validateAlertState(expected) {
        expect(state.payload()).to.have.property("alert", expected);
    }

    function validateBriState(expected) {
        expect(state.payload()).to.have.property("bri", expected);
    }

    function validateHueState(expected) {
        expect(state.payload()).to.have.property("hue", expected);
    }

    function validateSatState(expected) {
        expect(state.payload()).to.have.property("sat", expected);
    }

    function validateXYState(expected) {
        var payload = state.payload();

        expect(payload).to.have.property("xy");
        expect(payload.xy).to.be.an.instanceOf(Array);
        expect(payload.xy).to.have.members(expected);
    }

    function validateCTState(expected) {
        expect(state.payload()).to.have.property("ct", expected);
    }

    function validateTransitionTimeState(expected) {
        expect(state.payload()).to.have.property("transitiontime", expected);
    }

    function validateRGBState(expected) {
        var payload = state.payload();

        expect(payload).to.have.property("rgb");
        expect(payload.rgb).to.be.instanceOf(Array);
        expect(payload.rgb).to.have.members(expected);
    }

    function validateBrightnessIncrement(expected) {
        expect(state.payload()).to.have.property("bri_inc", expected);
    }

    function validateSaturationIncrement(expected) {
        expect(state.payload()).to.have.property("sat_inc", expected);
    }

    function validateHueIncrement(expected) {
        expect(state.payload()).to.have.property("hue_inc", expected);
    }

    function validateCtIncrement(expected) {
        expect(state.payload()).to.have.property("ct_inc", expected);
    }

    function validateXYIncrement(expected) {
        expect(state.payload()).to.have.property("xy_inc", expected);
    }
});