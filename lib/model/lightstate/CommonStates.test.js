'use strict';

const expect = require('chai').expect
  , CommonLightState = require('./CommonStates')
;


const RANGE_ERROR_STRING = 'is not within allowed limits'
  , CHOICES_ERROR_MESSAGE = 'is not one of the allowed values'
;

describe('Hue API #lightState', () => {


  describe('#create()', () => {

    it('should create an empty state', () => {
      const state = new CommonLightState()
        , payload = state.getPayload()
      ;

      expect(Object.keys(payload)).to.be.empty;
    });
  });


  describe('single states', () => {

    let state;

    beforeEach(() => {
      state = new CommonLightState();
    });

    describe('state: on', () => {

      describe('#on()', () => {
        it('should set on with no value', () => {
          state.on();
          validateOnState(true);
        });

        it('should set on with "false" value', () => {
          state.on(false);
          validateOnState(false);
        });

        it('should set on with "true" value', () => {
          state.on(true);
          validateOnState(true);
        });
      });


      describe('#off()', () => {
        it('should set on state', () => {
          state.off(false);
          validateOnState(false);
        });
      });
    });


    describe('state: bri', () => {

      function test(functionName, value, expectedValue) {
        state[functionName](value);
        validateBriState(expectedValue);
      }

      function testFailure(functionName, value, errorString) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(errorString);
        }
      }

      describe('#bri()', () => {

        function testBri(value) {
          test('bri', value, value);
        }

        function testFailureBri(value) {
          testFailure('bri', value, RANGE_ERROR_STRING);
        }

        it('should set brightness to 254', () => {
          testBri(254);
        });

        it('should set brightness to 1', () => {
          testBri(1);
        });

        it('should set brightness to 10', () => {
          testBri(10);
        });

        it('should respect min boundary', () => {
          testFailureBri(-100);
        });

        it('should fail to set brightness to 0', () => {
          testFailureBri(0);
        });

        it('should respect max boundary', () => {
          testFailureBri(1000);
        });
      });


      describe('#brighness', () => {

        function testBrightness(value, expectedValue) {
          test('brightness', value, expectedValue);
        }

        function testFailureBrightness(value) {
          testFailure('brightness', value, RANGE_ERROR_STRING);
        }

        it('100% should set brightness to 254', () => {
          testBrightness(100, 254);
        });

        it('0% should set brightness to 1', () => {
          testBrightness(0, 1);
        });

        it('50% should set brightness to 155', () => {
          testBrightness(50, 127);
        });

        it('should fail on negative number', () => {
          testFailureBrightness(-10);
        });

        it('should fail on number higher than 100', () => {
          testFailureBrightness(101);
        });
      });
    });


    describe('state: hue', () => {

      describe('#hue()', () => {

        function test(value, expected) {
          state.hue(value);
          validateHueState(expected);
        }

        function testFailure(value, errorString) {
          try {
            state.hue(value);
            expect.fail('Should have thrown an error');
          } catch (err) {
            expect(err).to.exist;
            expect(err.message).to.contain(errorString);
          }
        }

        it('should set to 0', () => {
          test(0, 0);
        });

        it('should set to 1', () => {
          test(1, 1);
        });

        it('should set to 15000', () => {
          test(15000, 15000);
        });

        it('should set to 65535', () => {
          test(65535, 65535);
        });

        it('should fail on -1', () => {
          testFailure(-1, RANGE_ERROR_STRING);
        });

        it('should fail on 65536', () => {
          testFailure(65536, RANGE_ERROR_STRING);
        });

        // THis is optional so it will not fail
        // it('should fail if nothing specified', () => {
        //   testFailure(null, RANGE_ERROR_STRING);
        //   testFailure(undefined, RANGE_ERROR_STRING);
        // });
      });
    });


    describe('state: sat', () => {

      function test(functionName, value, expected) {
        state[functionName](value);
        validateSatState(expected);
      }

      function testFailure(functionName, value, errorString) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(errorString);
        }
      }

      describe('#sat()', () => {

        function testSat(value) {
          test('sat', value, value);
        }

        function testFailureSat(value, errorString) {
          testFailure('sat', value, errorString);
        }

        it('should set to 0', () => {
          testSat(0);
        });

        it('should set to 254', () => {
          testSat(254);
        });

        it('should set to 125', () => {
          testSat(125);
        });


        it('should fail on -1', () => {
          testFailureSat(-1, RANGE_ERROR_STRING);
        });

        it('should fail on 255', () => {
          testFailureSat(255, RANGE_ERROR_STRING);
        });

        // THis is optional so it will not fail
        // it('fail if nothing specified', () => {
        //   testFailureSat(null);
        //   testFailureSat(undefined);
        // });
      });

      describe('#saturation()', () => {

        function testSaturation(value, expected) {
          test('saturation', value, expected);
        }

        function testFailureSaturation(value) {
          testFailure('saturation', value, RANGE_ERROR_STRING);
        }

        it('should set 0%', () => {
          testSaturation(0, 0);
        });

        it('should set 100%', () => {
          testSaturation(100, 254);
        });

        it('should set 50%', () => {
          testSaturation(50, 127);
        });

        it('should fail on negative number', () => {
          testFailureSaturation(-100);
        });

        it('should fail on over 100', () => {
          testFailureSaturation(101);
        });
      });
    });

    describe('state: xy', () => {
      describe('#xy', () => {

        function test(x, y, expected) {
          state.xy(x, y);
          validateXYState(expected);
        }

        function testFailure(x, y, expected) {
          try {
            state.xy(x, y);
            expect.fail('Should have thrown an error');
          } catch (err) {
            expect(err).to.exist;
            expect(err.message).to.contain(expected);
          }
        }

        it('should set (0,0)', () => {
          test(0, 0, [0, 0]);
        });

        it('should set (0, 1)', () => {
          test(0, 1, [0, 1]);
        });

        it('should set (1, 1)', () => {
          test(1, 1, [1, 1]);
        });

        it('should set (0.254, 0.5)', () => {
          test(0.254, 0.5, [0.254, 0.5]);
        });

        it('should support an array of [x, y]', () => {
          test([0.5, 0.6], null, [0.5, 0.6]);
        });

        describe('x value boundaries', () => {

          it('should fail on -1', () => {
            testFailure(-1, 0, RANGE_ERROR_STRING);
          });

          it('should fail on 1.1', () => {
            testFailure(1.1, 0, RANGE_ERROR_STRING);
          });
        });

        describe('y value boundaries', () => {

          it('should convert -10.5 to 0', () => {
            testFailure(0, -10.5, RANGE_ERROR_STRING);
          });

          it('should fail on 10.581', () => {
            testFailure(0, 10.5, RANGE_ERROR_STRING);
          });
        });
      });
    });


    describe('state: ct', () => {

      describe('#ct()', () => {

        function test(value, expected) {
          state.ct(value);
          validateCTState(expected);
        }

        function testFailure(ct, expected) {
          try {
            state.ct(ct);
            expect.fail('Should have thrown an error');
          } catch (err) {
            expect(err).to.exist;
            expect(err.message).to.contain(expected);
          }
        }

        it('should set 153 (6500K)', () => {
          test(153, 153);
        });

        it('should set 500 (2000K)', () => {
          test(500, 500);
        });

        it('should set 212', () => {
          test(212, 212);
        });

        it('should fail on 0', () => {
          testFailure(0, RANGE_ERROR_STRING);
        });

        it('should fail on 501', () => {
          testFailure(501., RANGE_ERROR_STRING);
        });

        // This is optional so it will not fail
        // it('should fail if nothing provided', () => {
        //   testFailure(null, RANGE_ERROR_STRING);
        // });
      });

      // describe("#colorTemperature", () => {
      //
      //   function test(value, expected) {
      //     state.colorTemperature(value);
      //     validateCTState(expected);
      //   }
      //
      //   it("should set 153", () => {
      //     test(153, 153);describe("#xy", () => {
      //
      //       function test(x, y, expected) {
      //         var payload;
      //
      //         state.xy(x, y);
      //         payload = state.payload();
      //
      //         validateXYState(expected);
      //       }
      //
      //       it("should set (0,0)", () => {
      //         test(0, 0, [0, 0]);
      //       });
      //
      //       it("should set (0, 1)", () => {
      //         test(0, 1, [0, 1]);
      //       });
      //
      //       it("should set (1, 1)", () => {
      //         test(1, 1, [1, 1]);
      //       });
      //
      //       it("should set (0.254, 0.5)", () => {
      //         test(0.254, 0.5, [0.254, 0.5]);
      //       });
      //
      //       it("should support an array of [x, y]", () => {
      //         test([0.5, 0.6], null, [0.5, 0.6]);
      //       });
      //
      //       describe("x value boundaries", () => {
      //
      //         it("should convert -1 to 0", () => {
      //           test(-1, 0.5, [0, 0.5]);
      //         });
      //
      //         it("should convert 1.1 to 1", () => {
      //           test(1.1, 0.5, [1, 0.5]);
      //         });
      //       });
      //
      //       describe("y value boundaries", () => {
      //
      //         it("should convert -10.5 to 0", () => {
      //           test(-10.5, 0.675, [0, 0.675]);
      //         });
      //
      //         it("should convert 10.581 to 1", () => {
      //           test(10.581, 0.1, [1, 0.1]);
      //         });
      //       });
      //     });
      //   });
      // });
      //
      // describe("#colourTemperature", () => {
      //
      //   function test(value, expected) {
      //     state.colourTemperature(value);
      //     validateCTState(expected);
      //   }
      //
      //   it("should set 153", () => {
      //     test(153, 153);
      //   });
      // });
      //
      // describe("#colorTemp", () => {
      //
      //   function test(value, expected) {
      //     state.colorTemp(value);
      //     validateCTState(expected);
      //   }
      //
      //   it("should set 153", () => {
      //     test(153, 153);
      //   });
      //
      //   it("should set 300", () => {
      //     test(300, 300);
      //   });
      // });
      //
      // describe("#colourTemp", () => {
      //
      //   function test(value, expected) {
      //     state.colourTemp(value);
      //     validateCTState(expected);
      //   }
      //
      //   it("should set 153", () => {
      //     test(153, 153);
      //   });
      //
      //   it("should set 220", () => {
      //     test(220, 220);
      //   });
      // });
    });


    describe('state: alert', () => {

      function testAlert(functionName, value) {
        state[functionName](value);
        validateAlertState(value);
      }

      function testFailureAlert(functionName, value) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(CHOICES_ERROR_MESSAGE);
        }
      }


      describe('#alert()', () => {

        function test(value) {
          testAlert('alert', value);
        }

        it('should set none', () => {
          test('none');
        });

        it('should set select', () => {
          test('select');
        });

        it('should set lselect', () => {
          test('lselect');
        });

        it('should fail on invalid values', () => {
          testFailureAlert('alert', 'invalid');
          testFailureAlert('alert', 'other');
          testFailureAlert('alert', 'stop');
        });
      });


      describe('#alertLong', () => {

        it('should set a long alert', () => {
          testAlert('alertLong', 'lselect');
        });
      });

      describe('#alertShort()', () => {

        it('should set a short alert', () => {
          state.alertShort();
          validateAlertState('select');
        });
      });

      describe('#alertNone()', () => {

        it('should clear alert', () => {
          state.alertNone();
          validateAlertState('none');
        });
      });
    });


    describe('state: effect', () => {

      function test(value) {
        state.effect(value);
        validateEffectState(value);
      }

      function testFailure(value, expected) {
        try {
          state.effect(value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(expected);
        }
      }

      describe('#effect()', () => {

        it('should accept \'none\'', () => {
          test('none');
        });

        it('should accept \'colorloop\'', () => {
          test('colorloop');
        });

        it('should fail on colorLoop\'', () => {
          testFailure('colorLoop', CHOICES_ERROR_MESSAGE);
        });

        it('should fail on invalid value', () => {
          testFailure('disco', CHOICES_ERROR_MESSAGE);
        });

        it('should set effect to none if no parameter provided', () => {
          state.effect();
          validateEffectState('none');
        });
      });

      describe('#effectColorLoop', () => {

        it('should', () => {
          state.effectColorLoop();
          validateEffectState('colorloop');
        });
      });

      describe('#effectNone', () => {

        it('should', () => {
          state.effectNone();
          validateEffectState('none');
        });
      });
    });


    describe('state: transitiontime', () => {

      function test(functionName, value) {
        state[functionName](value);
        validateTransitionTimeState(value);
      }

      function testFailure(functionName, value, expected) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(expected);
        }
      }

      describe('#transitiontime()', () => {

        function testTransitiontime(value) {
          test('transitiontime', value, value);
        }

        function testFailureTransistiontime(value) {
          testFailure('transitiontime', value, RANGE_ERROR_STRING);
        }

        it('should set 0', () => {
          testTransitiontime(0);
        });

        it('should set 4', () => {
          testTransitiontime(4);
        });

        it('should set 10', () => {
          testTransitiontime(10);
        });

        it('should set 36000', () => {
          testTransitiontime(36000);
        });

        it('should set 65535', () => {
          testTransitiontime(65535);
        });

        it('should fail on 65536', () => {
          testFailureTransistiontime(65536);
        });

        it('should set default of 4 if no parameter provided', () => {
          state.transitiontime();
          validateTransitionTimeState(4);
        });
      });


      describe('#transitionTime()', () => {

        function testTransitionTime(value) {
          test('transitiontime', value, value);
        }

        it('should set 0', () => {
          testTransitionTime(0);
        });

        it('should set 10', () => {
          testTransitionTime(10);
        });

        it('should set 65535', () => {
          testTransitionTime(65535);
        });
      });


      describe('#transitionSlow()', () => {

        it('should set 8', () => {
          state.transitionSlow();
          validateTransitionTimeState(8);
        });
      });


      describe('#transitionInstant()', () => {

        it('should set 0', () => {
          state.transitionInstant();
          validateTransitionTimeState(0);
        });
      });


      describe('#transitionDefault()', () => {

        it('should set 4', () => {
          state.transitionDefault();
          validateTransitionTimeState(4);
        });
      });


      describe('#transitionFast()', () => {

        it('should set 2', () => {
          state.transitionFast();
          validateTransitionTimeState(2);
        });
      });


      describe('#transition()', () => {

        function test(value, expected) {
          state.transition(value);
          validateTransitionTimeState(expected);
        }

        it('should set 100ms', () => {
          test(100, 1);
        });

        it('should set 1000ms', () => {
          test(1000, 10);
        });

        it('should set 20000ms', () => {
          test(20000, 200);
        });
      });

      describe('#transitionInMillis()', () => {

        function test(value, expected) {
          state.transitionInMillis(value);
          validateTransitionTimeState(expected);
        }

        it('should set 100ms', () => {
          test(100, 1);
        });

        it('should set 1000ms', () => {
          test(1000, 10);
        });
      });
    });


    describe('state: bri_inc', () => {

      function testBrightnessIncrement(functionName, value, expected) {
        state[functionName](value);
        validateBrightnessIncrement(expected);
      }

      function testFailureBrightnessIncrement(functionName, value, expected) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(expected);
        }
      }

      describe('#bri_inc()', () => {

        function test(value, expected) {
          const expectedValue = (expected === undefined) ? value : expected;
          testBrightnessIncrement('bri_inc', value, expectedValue);
        }

        function testFailure(value) {
          testFailureBrightnessIncrement('bri_inc', value, RANGE_ERROR_STRING);
        }

        it('should set -254', () => {
          test(-254);
        });

        it('should set 254', () => {
          test(254);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should set 1.5 as 1', () => {
          test(1.5, 1);
        });

        it('should fail on -300', () => {
          testFailure(-300);
        });

        it('should fail on 255', () => {
          testFailure(255);
        });
      });


      describe('#incrementBrightness()', () => {

        function test(value) {
          testBrightnessIncrement('incrementBrightness', value, value);
        }

        function testFailure(value) {
          testFailureBrightnessIncrement('incrementBrightness', value, RANGE_ERROR_STRING);
        }

        it('should set -254', () => {
          test(-254);
        });

        it('should set 254', () => {
          test(254);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should fail on -255', () => {
          testFailure(-255);
        });

        it('should fail on 256', () => {
          testFailure(256);
        });
      });
    });


    describe('state: sat_inc', () => {

      function testSaturationIncrement(functionName, value, expected) {
        state[functionName](value);
        validateSaturationIncrement(expected);
      }

      function testFailureSaturationIncrement(functionName, value, expected) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(expected);
        }
      }

      describe('#sat_inc()', () => {

        function test(value, expected) {
          const expectedValue = (expected === undefined) ? value : expected;
          testSaturationIncrement('sat_inc', value, expectedValue);
        }

        function testFailure(value) {
          testFailureSaturationIncrement('sat_inc', value, RANGE_ERROR_STRING);
        }

        it('should set -254', () => {
          test(-254);
        });

        it('should set 254', () => {
          test(254);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should set 1.5 as 1', () => {
          test(1.5, 1);
        });

        it('should fail on -300', () => {
          testFailure(-300);
        });

        it('should fail on 255', () => {
          testFailure(255);
        });
      });


      describe('#incrementSaturation()', () => {

        function test(value) {
          testSaturationIncrement('incrementSaturation', value, value);
        }

        function testFailure(value) {
          testFailureSaturationIncrement('incrementSaturation', value, RANGE_ERROR_STRING);
        }

        it('should set -254', () => {
          test(-254);
        });

        it('should set 254', () => {
          test(254);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should fail on -255', () => {
          testFailure(-255);
        });

        it('should fail on 256', () => {
          testFailure(256);
        });
      });
    });


    describe('state: hue_inc', () => {

      function testHueIncrement(functionName, value, expected) {
        state[functionName](value);
        validateHueIncrement(expected);
      }

      function testFailureHueIncrement(functionName, value, expected) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(expected);
        }
      }

      describe('#sat_inc()', () => {

        function test(value, expected) {
          const expectedValue = (expected === undefined) ? value : expected;
          testHueIncrement('hue_inc', value, expectedValue);
        }

        function testFailure(value) {
          testFailureHueIncrement('hue_inc', value, RANGE_ERROR_STRING);
        }

        it('should set -65534', () => {
          test(-65534);
        });

        it('should set 65534', () => {
          test(65534);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should set 1.5 as 1', () => {
          test(1.5, 1);
        });

        it('should fail on -65535', () => {
          testFailure(-65535);
        });

        it('should fail on 65535', () => {
          testFailure(65535);
        });
      });


      describe('#incrementHue()', () => {

        function test(value, expected) {
          const expectedValue = (expected === undefined) ? value : expected;
          testHueIncrement('incrementHue', value, expectedValue);
        }

        function testFailure(value) {
          testFailureHueIncrement('incrementHue', value, RANGE_ERROR_STRING);
        }

        it('should set -65534', () => {
          test(-65534);
        });

        it('should set 65534', () => {
          test(65534);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should set 1.5 as 1', () => {
          test(1.5, 1);
        });

        it('should fail on -65535', () => {
          testFailure(-65535);
        });

        it('should fail on 65535', () => {
          testFailure(65535);
        });
      });
    });


    describe('state: ct_inc', () => {

      function testCtIncrement(functionName, value, expectedValue) {
        state[functionName](value);
        validateCtIncrement(expectedValue);
      }

      function testFailureCtIncrement(functionName, value, expected) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(expected);
        }
      }

      describe('#ct_inc()', () => {

        function test(value, expected) {
          const expectedValue = (expected === undefined) ? value : expected;
          testCtIncrement('ct_inc', value, expectedValue);
        }

        function testFailure(value) {
          testFailureCtIncrement('ct_inc', value, RANGE_ERROR_STRING);
        }

        it('should set -65534', () => {
          test(-65534);
        });

        it('should set 65534', () => {
          test(65534);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should set 1.5 as 1', () => {
          test(1.5, 1);
        });

        it('should fail on -65535', () => {
          testFailure(-65535);
        });

        it('should fail on 65535', () => {
          testFailure(65535);
        });
      });


      describe('#incrementCt()', () => {

        function test(value, expected) {
          const expectedValue = (expected === undefined) ? value : expected;
          testCtIncrement('incrementCt', value, expectedValue);
        }

        function testFailure(value) {
          testFailureCtIncrement('incrementCt', value, RANGE_ERROR_STRING);
        }

        it('should set -65534', () => {
          test(-65534);
        });

        it('should set 65534', () => {
          test(65534);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should set 1.5 as 1', () => {
          test(1.5, 1);
        });

        it('should fail on -65535', () => {
          testFailure(-65535);
        });

        it('should fail on 65535', () => {
          testFailure(65535);
        });
      });

      describe('#incrementColorTemp()', () => {

        function test(value, expected) {
          const expectedValue = (expected === undefined) ? value : expected;
          testCtIncrement('incrementColorTemp', value, expectedValue);
        }

        function testFailure(value) {
          testFailureCtIncrement('incrementColorTemp', value, RANGE_ERROR_STRING);
        }

        it('should set -65534', () => {
          test(-65534);
        });

        it('should set 65534', () => {
          test(65534);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should set 1.5 as 1', () => {
          test(1.5, 1);
        });

        it('should fail on -65535', () => {
          testFailure(-65535);
        });

        it('should fail on 65535', () => {
          testFailure(65535);
        });
      });

      describe('#incrementColourTemp()', () => {

        function test(value, expected) {
          const expectedValue = (expected === undefined) ? value : expected;
          testCtIncrement('incrementColorTemp', value, expectedValue);
        }

        function testFailure(value) {
          testFailureCtIncrement('incrementColorTemp', value, RANGE_ERROR_STRING);
        }

        it('should set -65534', () => {
          test(-65534);
        });

        it('should set 65534', () => {
          test(65534);
        });

        it('should set 0', () => {
          test(0);
        });

        it('should set 1.5 as 1', () => {
          test(1.5, 1);
        });

        it('should fail on -65535', () => {
          testFailure(-65535);
        });

        it('should fail on 65535', () => {
          testFailure(65535);
        });
      });
    });


    describe('state: xy_inc', () => {

      function testXYIncrementWithArray(functionName, value) {
        state[functionName](value);
        validateXYIncrement(value);
      }

      function testXYIncrementWithValues(functionName, x, y) {
        state[functionName](x, y);
        validateXYIncrement([x, y]);
      }

      function testFailureXYIncrement(functionName, value, expected) {
        try {
          state[functionName](value);
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.exist;
          expect(err.message).to.contain(expected);
        }
      }


      describe('#xy_inc()', () => {

        function testWithArray(value) {
          testXYIncrementWithArray('xy_inc', value);
        }

        function testWithValues(x, y) {
          testXYIncrementWithValues('xy_inc', x, y);
        }

        function testFailure(x, y) {
          testFailureXYIncrement('xy_inc', [x, y], RANGE_ERROR_STRING);
        }

        it('should set [-0.5, -0.5]', () => {
          testWithArray([-0.5, -0.5]);
        });

        it('should set (-0.5, -0.5)', () => {
          testWithValues(-0.5, -0.5);
        });

        it('should set [0.5, 0.5]', () => {
          testWithArray([0.5, 0.5]);
        });

        it('should set 0', () => {
          testWithValues(0, 0);
        });

        it('should fail on (-0.6, -0.5)', () => {
          testFailure(-0.6, -0.5);
        });
      });


      describe('#incrementXY', () => {

        function testWithArray(value) {
          testXYIncrementWithArray('xy_inc', value);
        }

        function testWithValues(x, y) {
          testXYIncrementWithValues('xy_inc', x, y);
        }

        function testFailure(value) {
          testFailureXYIncrement('xy_inc', value, RANGE_ERROR_STRING);
        }

        it('should set (-0.5, -0.5)', () => {
          testWithValues(-0.5, -0.5);
        });

        it('should set [0.5, 0.5]', () => {
          testWithArray([0.5, 0.5]);
        });

        it('should set [0, 0]', () => {
          testWithArray([0, 0]);
        });

        it('should fail with invalid values', () => {
          testFailure([0, 1]);
        });
      });
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    function validateOnState(expected) {
      expect(state.getPayload()).to.have.property('on', expected);
    }

    function validateBriState(expected) {
      expect(state.getPayload()).to.have.property('bri', expected);
    }

    function validateHueState(expected) {
      expect(state.getPayload()).to.have.property('hue', expected);
    }

    function validateSatState(expected) {
      expect(state.getPayload()).to.have.property('sat', expected);
    }

    function validateXYState(expected) {
      const payload = state.getPayload();

      expect(payload).to.have.property('xy');
      expect(payload.xy).to.be.an.instanceOf(Array);
      expect(payload.xy).to.have.members(expected);
    }

    function validateCTState(expected) {
      expect(state.getPayload()).to.have.property('ct', expected);
    }

    function validateEffectState(expected) {
      expect(state.getPayload()).to.have.property('effect', expected);
    }

    function validateAlertState(expected) {
      expect(state.getPayload()).to.have.property('alert', expected);
    }

    function validateTransitionTimeState(expected) {
      expect(state.getPayload()).to.have.property('transitiontime', expected);
    }

    function validateBrightnessIncrement(expected) {
      expect(state.getPayload()).to.have.property('bri_inc', expected);
    }

    function validateSaturationIncrement(expected) {
      expect(state.getPayload()).to.have.property('sat_inc', expected);
    }

    function validateHueIncrement(expected) {
      expect(state.getPayload()).to.have.property('hue_inc', expected);
    }

    function validateCtIncrement(expected) {
      expect(state.getPayload()).to.have.property('ct_inc', expected);
    }

    function validateXYIncrement(expected) {
      const payload = state.getPayload();

      expect(payload).to.have.property('xy_inc');
      expect(payload.xy_inc).to.be.an.instanceOf(Array);
      expect(payload.xy_inc).to.have.members(expected);
    }
  });
});



