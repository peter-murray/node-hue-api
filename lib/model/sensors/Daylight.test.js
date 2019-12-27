'use strict';

const expect = require('chai').expect
  , Daylight = require('./Daylight')
;

describe('Sensor :: Daylight', () => {

  const DATA = {
    'state': {
      'daylight': false,
      'lastupdated': '2019-11-06T15:56:00'
    },
    'config': {
      'on': true,
      'configured': true,
      'sunriseoffset': 30,
      'sunsetoffset': -30
    },
    'name': 'Daylight',
    'type': 'Daylight',
    'modelid': 'PHDL00',
    'manufacturername': 'Philips',
    'swversion': '1.0'
  };

  const ID = 1;

  let sensor;

  beforeEach(() => {
    sensor = new Daylight(ID);
    sensor._populate(DATA);
  });


  it('should create a Daylight Sensor using valid data', () => {
    expect(sensor).to.have.property('id').to.equal(ID);

    expect(sensor).to.have.property('name').to.equal(DATA.name);
    expect(sensor).to.have.property('type').to.equal(DATA.type);
    expect(sensor).to.have.property('modelid').to.equal(DATA.modelid);
    expect(sensor).to.have.property('manufacturername').to.equal(DATA.manufacturername);
    expect(sensor).to.have.property('swversion').to.equal(DATA.swversion);

    expect(sensor).to.property('on').to.equal(DATA.config.on);
    expect(sensor).to.property('configured').to.equal(DATA.config.configured);
    expect(sensor).to.property('sunsetoffset').to.equal(DATA.config.sunsetoffset);
    expect(sensor).to.property('sunriseoffset').to.equal(DATA.config.sunriseoffset);

    expect(sensor).to.have.property('daylight').to.equal(DATA.state.daylight);
    expect(sensor).to.have.property('lastupdated').to.equal(DATA.state.lastupdated);
  });


  describe('#on', () => {

    it('should update', () => {
      expect(sensor).to.have.property('on').to.equal(DATA.config.on);

      sensor.on = !DATA.config.on;
      expect(sensor).to.have.property('on').to.equal(!DATA.config.on);

      sensor.on = DATA.config.on;
      expect(sensor).to.have.property('on').to.equal(DATA.config.on);
    });
  });


  describe('#on', () => {

    it('should update', () => {
      expect(sensor).to.have.property('on').to.equal(DATA.config.on);

      sensor.on = !DATA.config.on;
      expect(sensor).to.have.property('on').to.equal(!DATA.config.on);

      sensor.on = DATA.config.on;
      expect(sensor).to.have.property('on').to.equal(DATA.config.on);
    });
  });

});