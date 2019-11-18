'use strict';

const expect = require('chai').expect
  , CLIPSwitch = require('./CLIPSwitch')
;

describe('CLIPSwitch', () => {

  const SENSOR_DATA = {
    'state': {
      'buttonevent': 0,
      'lastupdated': 'none'
    },
    'config': {
      'on': false,
      'reachable': true
    },
    'name': 'test switch',
    'type': 'CLIPSwitch',
    'modelid': 'TESTSENSOR',
    'manufacturername': 'node-hue-api',
    'swversion': '1.0',
    'uniqueid': '1-2-3-4',
    'recycle': true
  };



  it('should create one from valid data', () => {
    const sensor = new CLIPSwitch(1);
    sensor._populate(SENSOR_DATA);

    // expect(sensor).to.have.property('type').to.equal('CLIPPresence');
    expect(sensor).to.have.property('name').to.equal(SENSOR_DATA.name);

    expect(sensor).to.have.property('on').to.be.false;
    expect(sensor).to.have.property('url').to.equal(null);
    expect(sensor).to.have.property('battery').to.equal(null);
    expect(sensor).to.have.property('reachable').to.be.true;

    expect(sensor).to.have.property('buttonevent').to.equal(SENSOR_DATA.state.buttonevent);
    expect(sensor).to.have.property('lastupdated');
  });
});