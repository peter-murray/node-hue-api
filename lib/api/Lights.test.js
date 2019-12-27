'use strict';

const expect = require('chai').expect
  , v3 = require('../v3')
  , discovery = v3.discovery
  , model = require('../model')
  , LightState = model.lightStates.LightState
  , testValues = require('../../test/support/testValues.js')
;

describe('Hue API #lights', function () {

  let hue;

  this.timeout(10000);

  before(async () => {
    const searchResults = await discovery.nupnpSearch();

    if (!searchResults || searchResults.length === 0) {
      throw new Error('Failed to find a bridge in nupnp search');
    }

    const localApi = v3.api.createLocal(searchResults[0].ipaddress);
    hue = await localApi.connect(testValues.username);
  });

  describe('#getAll()', () => {

    it('should find some', async () => {
      const lights = await hue.lights.getAll();
      expect(lights).to.have.length.greaterThan(20);

      let light = lights[0];
      expect(light).to.have.property('id').to.be.greaterThan(0);

      expect(model.isLightInstance(light)).to.be.true;
    });
  });

  describe('#getLight()', () => {

    it('should get light with id === 2', async () => {
      const result = await hue.lights.getLight(2);
      expect(result).to.have.property('id').to.equal(2);
    });

    it('should get light with id as a Light object', async () => {
      const light = await hue.lights.getLight(2);
      expect(light).to.have.property('id').to.equal(2);

      const result = await hue.lights.getLight(light);
      expect(result).to.have.property('id').to.equal(2);
    });
  });

  describe('#getLightById()', () => {

    it('should get light with id === 2', async () => {
      const result = await hue.lights.getLightById(2);
      expect(result).to.have.property('id').to.equal(2);
    });

    it('should get light with id as a Light object', async () => {
      const light = await hue.lights.getLightById(2);
      expect(light).to.have.property('id').to.equal(2);

      const result = await hue.lights.getLightById(light);
      expect(result).to.have.property('id').to.equal(2);
    });
  });


  describe('#getLightByName()', () => {

    it('should get light with a valid name', async () => {
      const name = 'Office Desk Left'
        , result = await hue.lights.getLightByName(name)
      ;

      expect(result).to.have.property('name').to.equal(name);
    });
  });


  describe('#getNew()', () => {

    it('should find some', async () => {
      const result = await hue.lights.getNew();
      expect(result).to.have.property('lastscan');
    });
  });


  describe('#searchForNew()', () => {

    it('should perform a search', async () => {
      const result = await hue.lights.searchForNew();
      expect(result).to.be.true;
    });
  });


  describe('#getLightAttributesAndState()', () => {

    describe('using id', () => {

      it('should return a light state for id=2', async () => {
        const result = await hue.lights.getLightAttributesAndState(2);

        expect(result).to.have.property('id', 2);

        expect(result).to.have.property('state');
        expect(result.state).to.have.property('on');
        expect(result.state).to.have.property('bri');
        expect(result.state).to.have.property('hue');
        expect(result.state).to.have.property('sat');
        expect(result.state).to.have.property('effect');
        expect(result.state).to.have.property('xy');
        expect(result.state).to.have.property('alert');
        expect(result.state).to.have.property('colormode');
        expect(result.state).to.have.property('mode');
        expect(result.state).to.have.property('reachable');

        expect(result).to.have.property('swupdate');
        expect(result.swupdate).to.have.property('state');
        expect(result.swupdate).to.have.property('lastinstall');

        expect(result).to.have.property('type');
        expect(result).to.have.property('name');
        expect(result).to.have.property('modelid');
        expect(result).to.have.property('manufacturername');
        expect(result).to.have.property('productname');

        expect(result).to.have.property('capabilities');
        expect(result.capabilities).to.have.property('certified');
        expect(result.capabilities).to.have.property('control');
        expect(result.capabilities).to.have.property('streaming');

        expect(result).to.have.property('config');
        expect(result.config).to.have.property('archetype');
        expect(result.config).to.have.property('function');
        expect(result.config).to.have.property('direction');

        expect(result).to.have.property('uniqueid');
        expect(result).to.have.property('swversion');
      });
    });

    describe('using Light instance', () => {

      it('should return a light state', async () => {
        const light = await hue.lights.getLight(2)
          , result = await hue.lights.getLightAttributesAndState(light)
        ;

        expect(result).to.have.property('id').to.equal(2);

        expect(result).to.have.property('state');
        expect(result.state).to.have.property('on');
        expect(result.state).to.have.property('bri');
        expect(result.state).to.have.property('hue');
        expect(result.state).to.have.property('sat');
        expect(result.state).to.have.property('effect');
        expect(result.state).to.have.property('xy');
        expect(result.state).to.have.property('alert');
        expect(result.state).to.have.property('colormode');
        expect(result.state).to.have.property('mode');
        expect(result.state).to.have.property('reachable');

        expect(result).to.have.property('swupdate');
        expect(result.swupdate).to.have.property('state');
        expect(result.swupdate).to.have.property('lastinstall');

        expect(result).to.have.property('type');
        expect(result).to.have.property('name');
        expect(result).to.have.property('modelid');
        expect(result).to.have.property('manufacturername');
        expect(result).to.have.property('productname');

        expect(result).to.have.property('capabilities');
        expect(result.capabilities).to.have.property('certified');
        expect(result.capabilities).to.have.property('control');
        expect(result.capabilities).to.have.property('streaming');

        expect(result).to.have.property('config');
        expect(result.config).to.have.property('archetype');
        expect(result.config).to.have.property('function');
        expect(result.config).to.have.property('direction');

        expect(result).to.have.property('uniqueid');
        expect(result).to.have.property('swversion');
      });
    });
  });


  describe('#getLightState()', () => {

    it('should return a light state for id=2', async () => {
      const result = await hue.lights.getLightState(2);

      expect(result).to.have.property('on');
      expect(result).to.have.property('bri');
      expect(result).to.have.property('hue');
      expect(result).to.have.property('sat');
      expect(result).to.have.property('effect');
      expect(result).to.have.property('xy');
      expect(result).to.have.property('alert');
      expect(result).to.have.property('colormode');
      expect(result).to.have.property('mode');
      expect(result).to.have.property('reachable');
    });

    it('should return a light state for Light object', async () => {
      const light = await hue.lights.getLight(2)
        , result = await hue.lights.getLightState(light)
      ;

      expect(result).to.have.property('on');
      expect(result).to.have.property('bri');
      expect(result).to.have.property('hue');
      expect(result).to.have.property('sat');
      expect(result).to.have.property('effect');
      expect(result).to.have.property('xy');
      expect(result).to.have.property('alert');
      expect(result).to.have.property('colormode');
      expect(result).to.have.property('mode');
      expect(result).to.have.property('reachable');
    });
  });


  describe('rename / renameLight', () => {

    let light
      , originalName
    ;

    beforeEach(async () => {
      light = await hue.lights.getLight(2);
      originalName = light.name;
    });

    afterEach('reset light name in bridge', async () => {
      if (originalName) {
        light.name = originalName;
        await hue.lights.renameLight(light);
      }
    });

    describe('#rename (deprecated function)', () => {
      it('should rename a light using id as integer', async () => {
        const newName = 'Lounge Living Color'
          , result = await hue.lights.rename(light.id, newName)
          , updatedLight = await hue.lights.getLight(light);

        expect(result).to.be.true;

        expect(updatedLight).to.have.property('id').to.equal(light.id);
        expect(updatedLight).to.have.property('name').to.equal(newName);
      });

      it('should rename a light using id as a Light instance', async () => {
        const newName = 'Lounge Living Color'
          , result = await hue.lights.rename(light, newName)
          , updateLight = await hue.lights.getLight(light);

        expect(result).to.be.true;

        expect(updateLight).to.have.property('id').to.equal(light.id);
        expect(updateLight).to.have.property('name').to.equal(newName);
      });

      it('should error is name is too long', async () => {
        const newName = `Renamed Light ${Date.now()} ${Date.now()}`;

        try {
          await hue.lights.rename(light.id, newName);
          expect.fail('Should have failed to rename light');
        } catch (err) {
          expect(err.message).to.contain('does not meet maximum length requirement');
        }
      });
    });

    describe('#renameLight()', () => {

      it('should rename a light using id as integer', async () => {
        const newName = 'Lounge Living Color';
        light.name = newName;

        const result = await hue.lights.renameLight(light)
          , updatedLight = await hue.lights.getLight(light)
        ;

        expect(result).to.be.true;

        expect(updatedLight).to.have.property('id').to.equal(light.id);
        expect(updatedLight).to.have.property('name').to.equal(newName);
      });
    });


    describe('using light instance', () => {

      it('should rename a light', async () => {
        const newName = 'New Light Name';

        light.name = newName;

        const result = await hue.lights.rename(light)
          , updateLight = await hue.lights.getLight(light)
        ;

        expect(result).to.be.true;

        expect(updateLight).to.have.property('id').to.equal(light.id);
        expect(updateLight).to.have.property('name').to.equal(newName);
      });
    });
  });


  describe('#setLightState()', () => {

    describe('using Light instance', () => {

      it('should set an xy value', async () => {
        const id = testValues.testLightId
          , light = await hue.lights.getLight(id)
          , result = await hue.lights.setLightState(light, {on: true, xy: [0.1948, 0.5478]})
          , finalLightState = await hue.lights.getLightState(id)
        ;

        expect(result).to.be.true;
        expect(finalLightState).to.have.property('on').to.be.true;

        expect(finalLightState).to.have.property('xy');
        expect(finalLightState.xy[0]).to.be.within(0.194, 0.195);
        expect(finalLightState.xy[1]).to.be.closeTo(0.547, 0.548);
      });
    });

    describe('using light id', () => {

      describe('using raw objects', () => {

        it('should set an xy value', async () => {
          const id = testValues.testLightId
            , result = await hue.lights.setLightState(id, {on: true, xy: [0.1948, 0.5478]})
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;

          expect(finalLightState).to.have.property('xy');
          expect(finalLightState.xy[0]).to.be.within(0.194, 0.195);
          expect(finalLightState.xy[1]).to.be.closeTo(0.547, 0.548);
        });


        it('should set an xy and bri value', async () => {
          const id = testValues.testLightId
            , state = {
              on: true,
              bri: 254,
              colormode: 'xy',
              xy: [0.153, 0.048]
            }
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('on').to.be.true;

          expect(finalLightState).to.have.property('xy');
          expect(finalLightState.xy[0]).to.be.within(0.15, 0.155);
          expect(finalLightState.xy[1]).to.be.closeTo(0.045, 0.05);
        });
      });

      describe('using lightState object', () => {

        it('should set alert to "lselect"', async () => {
          const id = testValues.testLightId
            , state = new LightState().alert('lselect')
            , result = await hue.lights.setLightState(id, state)
            , finalLightState = await hue.lights.getLightState(id)
          ;

          expect(result).to.be.true;
          expect(finalLightState).to.have.property('alert').to.equal('lselect');
        });


        describe('#on', () => {

          function testOn(on) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on(on)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.equal(on);
            };
          }

          it('should set on to true', testOn(true));

          it('should set on to false', testOn(false));
        });


        describe('#bri', () => {

          function testBri(briVal) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on().bri(briVal)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.be.true;
              expect(finalLightState).to.have.property('bri').to.equal(briVal);
            };
          }

          it('should set bri to 1', testBri(1));

          it('should set bri to 254', testBri(254));

          it('should set bri to 100', testBri(100));
        });


        describe('#hue', () => {

          function testHue(val) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on().hue(val)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.be.true;
              expect(finalLightState).to.have.property('hue').to.equal(val);
            };
          }

          it('should set hue to 1', testHue(1));

          it('should set hue to 254', testHue(254));

          it('should set hue to 100', testHue(100));
        });


        describe('#sat', () => {

          function testSat(val) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on().sat(val)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.be.true;
              expect(finalLightState).to.have.property('sat').to.equal(val);
            };
          }

          it('should set sat to 1', testSat(1));

          it('should set sat to 254', testSat(254));

          it('should set sat to 100', testSat(100));
        });


        describe('#xy', () => {

          function testXY(xVal, yVal) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on().xy(xVal, yVal)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.be.true;
              expect(finalLightState).to.have.property('xy').to.contain(xVal, yVal);
            };
          }

          it('should set xy to 1,1', testXY(1, 1));

          it('should set xy to 0,1', testXY(0, 1));

          it('should set xy to 0,0', testXY(0, 0));

          it('should set xy to 1,0', testXY(1, 0));

          it('should set xy to 0.5,0.5', testXY(0.5, 0.5));

          it('should set xy to 0.178,0.99', testXY(0.178, 0.99));
        });


        describe('#ct', () => {

          function testCt(val) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on().ct(val)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.be.true;
              expect(finalLightState).to.have.property('ct').to.equal(val);
            };
          }

          it('should set ct to 153', testCt(153));

          it('should set ct to 500', testCt(500));

          it('should set ct to 200', testCt(200));

          it('should set ct to 499', testCt(499));

          //TODO do failure conditions
        });


        describe('#alert', () => {

          function testAlert(val) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on().alert(val)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.be.true;
              expect(finalLightState).to.have.property('alert').to.equal(val);
            };
          }

          it('should set alert to none', testAlert('none'));

          it('should set alert to select', testAlert('select'));

          it('should set alert to lselect', testAlert('lselect'));
        });


        describe('#effect', () => {

          function testEffect(val) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on().effect(val)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.be.true;
              expect(finalLightState).to.have.property('effect').to.equal(val);
            };
          }

          it('should set alert to none', testEffect('none'));

          it('should set alert to colorloop', testEffect('colorloop'));
        });


        describe('#transitiontime', () => {

          function testTransitiontime(val) {
            return async () => {
              const id = testValues.testLightId
                , state = new LightState().on().transitiontime(val)
                , result = await hue.lights.setLightState(id, state)
                , finalLightState = await hue.lights.getLightState(id)
              ;

              expect(result).to.be.true;
              expect(finalLightState).to.have.property('on').to.be.true;
              // It is not possible to query the transition time value azs it is no longer returned in the state values
              // from the Hue API.
            };
          }

          afterEach(async () => {
            // Turn off the light so that the next test call will do something.
            const id = testValues.testLightId;
            await hue.lights.setLightState(id, new LightState().off());
          });

          it('should set to 0', testTransitiontime(0));

          it('should set to 4', testTransitiontime(4));

          it('should set to 10', testTransitiontime(10));

          it('should set to 1000', testTransitiontime(1000));
        });


        //TODO inc seem to be more difficult to test
        describe('#bri_inc', () => {

          function testBriInc(initialBri, incVal, expectedBri) {
            return async () => {
              const id = testValues.testLightId
                , initialState = new LightState().on().bri(initialBri)
                , incState = new LightState().transitiontime(0).bri_inc(incVal)
              ;

              const initialResult = await hue.lights.setLightState(id, initialState);
              expect(initialResult).to.be.true;

              const result = await hue.lights.setLightState(id, incState);
              expect(result).to.be.true;


              const finalLightState = await hue.lights.getLightState(id);
              expect(finalLightState).to.have.property('on').to.be.true;
              expect(finalLightState).to.have.property('bri').to.equal(expectedBri);
            };
          }

          it('should respond to +1', testBriInc(1, 1, 2));

          it('should respond to +200', testBriInc(1, 200, 201));
        });
      });

      describe('#rgb', () => {

        function testRGB(red, green, blue, xy) {
          return async () => {
            const id = testValues.testLightId
              , state = new LightState().on().rgb(red, green, blue)
              , result = await hue.lights.setLightState(id, state)
              , finalLightState = await hue.lights.getLightState(id)
            ;

            expect(result).to.be.true;
            expect(finalLightState).to.have.property('on').to.be.true;

            expect(finalLightState).to.have.property('colormode').to.equal('xy');
            expect(finalLightState).to.have.property('xy');
            expect(finalLightState.xy[0]).to.be.closeTo(xy[0], 0.001);
            expect(finalLightState.xy[1]).to.be.closeTo(xy[1], 0.001);
          };
        }

        it('should set rgb to red', testRGB(255, 0, 0, [0.6484, 0.3309]));

        it('should set rgb to green', testRGB(0, 255, 0, [0.3157, 0.5906]));

        it('should set rgb to blue', testRGB(0, 0, 255, [0.153, 0.048]));
      });

      //TODO complete all the property tests for a light state
    });
  });
});