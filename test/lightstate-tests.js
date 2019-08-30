'use strict';

//TODO these tests need to be folded into the new LightState tests

const expect = require('chai').expect
  , lightState = require('..').lightState
;

describe('#LightState', function () {

  let state;

  beforeEach(function () {
    state = lightState.create();
  });


  describe('creation', function () {

    it('should create an empty object', function () {
      expect(state).to.exist;
      expect(state.getPayload()).to.be.empty;
    });
  });


  describe('alert', function () {

    describe('#alert', function () {

      it('should be a short when not specified', function () {
        state.alert();
        validateAlertState('none');
      });

      it('should be short when false', function () {
        state.alert('select');
        validateAlertState('select');
      });

      it('should be long when true', function () {
        state.alert('lselect');
        validateAlertState('lselect');
      });
    });
  });


  describe('#white', function () {

    function test(temp, bright, expectedCt, expectedBri) {
      state.white(temp, bright);
      validateBriState(expectedBri);
      validateCTState(expectedCt);
    }

    it('should set ct=153, bri=50%', function () {
      test(153, 50, 153, 127);
    });

    it('should set ct=500, bri=100%', function () {
      test(500, 100, 500, 254);
    });

    // it('should set ct=0 to ct 153', function () {
    //   test(0, 0, 153, 0);
    // });

    // it('should set ct=600 to ct 500', function () {
    //   test(600, 0, 500, 0);
    // });

    // it('should set bri=-10% to bri 0%', function () {
    //   test(153, -10, 153, 0);
    // });

    // it('should set bri=150% to bri 100%', function () {
    //   test(153, 150, 153, 254);
    // });
  });


  describe('#hsb', function () {

    function test(h, s, b, expectedHue, expectedSat, expectedBri) {
      state.hsb(h, s, b);
      validateHueState(expectedHue);
      validateSatState(expectedSat);
      validateBriState(expectedBri);
    }

    it('should set (0, 0, 0)', function () {
      test(0, 0, 0, 0, 0, 1);
    });

    it('should set (360, 100, 100)', function () {
      test(360, 100, 100, 65535, 254, 254);
    });

    it('should set (180, 50, 25)', function () {
      test(180, 50, 25, 32768, 127, 64);
    });

    //TODO validate limits on each parameter
  });


  describe('#hsl', function () {

    function test(h, s, l, expectedHue, expectedSat, expectedBri) {
      state.hsl(h, s, l);
      validateHueState(expectedHue);
      validateSatState(expectedSat);
      validateBriState(expectedBri);
    }

    it('should set (0, 0, 0)', function () {
      test(0, 0, 0, 0, 0, 1);
    });

    it('should set (360, 100, 100)', function () {
      test(360, 100, 100, 65535, 0, 254);
    });

    it('should set (180, 50, 25)', function () {
      test(180, 50, 25, 32768, 170, 97);
    });

    //TODO validate limits on each parameter
  });


  describe('#rgb', function () {

    function test(r, g, b, expectedRGB) {
      state.rgb(r, g, b);
      validateRGBState(expectedRGB);
    }

    it('should set (255, 255, 255)', function () {
      test(255, 255, 255, [255, 255, 255]);
    });

    it('should set (255, 255, 255)', function () {
      test(255, 255, 255, [255, 255, 255]);
    });

    it('should set (0, 255, 0) to [0, 255, 0]', function () {
      test(0, 255, 0, [0, 255, 0]);
    });

    it('should set via an array [r, g, b]', function () {
      test([10, 20, 30], null, null, [10, 20, 30]);
    });
  });


  describe('chaining states', function () {

    it('should chain on().ct(200)', function () {
      state.on().ct(200);

      validateOnState(true);
      validateCTState(200);
    });

    it('should chain on().off().off().on()', function () {
      state.on().off().off().on();

      validateOnState(true);
    });

    describe('using #reset', function () {

      it('set values, reset, then specify more values', function () {
        state.on().hue(0);
        validateOnState(true);
        validateHueState(0);

        state.reset().ct(211);
        validateCTState(211);
        expect(state.getPayload()).to.not.have.property('on');
        expect(state.getPayload()).to.not.have.property('hue');

      });
    });
  });

  //TODO maybe need to look to make this pass
  // describe('loading from values object', function () {
  //
  //   it('should load {on: true, effect: \'colorloop\'}', function () {
  //     state = lightState.create({on: true, effect: 'colorloop'});
  //
  //     validateStateProperties('on', 'effect');
  //     validateEffectState('colorloop');
  //     validateOnState(true);
  //   });
  //
  //   it('should only load valid values', function () {
  //     var data = {
  //       on: false,
  //       name: 'hello world',
  //       sat: 0,
  //       alert: 'none',
  //       scan: true
  //     };
  //
  //     state = lightState.create(data);
  //     validateStateProperties('on', 'sat', 'alert');
  //     validateOnState(false);
  //     validateSatState(0);
  //     validateAlertState('none');
  //   });
  //
  //   it('should convert invalid property values', function () {
  //     state = lightState.create({effect: 'disco'});
  //
  //     validateStateProperties('effect');
  //     validateEffectState('none');
  //   });
  //
  //   it('should load rgb', function () {
  //     state = lightState.create({rgb: [0, 0, 255]});
  //     validateRGBState([0, 0, 255]);
  //   });
  // });

  function validateAlertState(expected) {
    expect(state.getPayload()).to.have.property('alert', expected);
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

  function validateCTState(expected) {
    expect(state.getPayload()).to.have.property('ct', expected);
  }

  function validateEffectState(expected) {
    expect(state.getPayload()).to.have.property('effect', expected);
  }

  function validateRGBState(expected) {
    const payload = state.getPayload();

    expect(payload).to.have.property('rgb');
    expect(payload.rgb).to.be.instanceOf(Array);
    expect(payload.rgb).to.have.members(expected);
  }

  function validateOnState(expected) {
    expect(state.getPayload()).to.have.property('on', expected);
  }

  function validateStateProperties(expected) {
    const payload = state.getPayload()
      , actualKeys = Object.keys(payload)
      , expectedKeys = Array.prototype.slice.apply(arguments)
    ;

    expect(actualKeys).to.have.members(expectedKeys);
    expect(actualKeys).to.have.length(expectedKeys.length);
  }
});
