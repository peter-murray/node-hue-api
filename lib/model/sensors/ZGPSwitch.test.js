'use strict';

const expect = require('chai').expect
  , ZGPSwitch = require('./ZGPSwitch')
;

describe('Sensor :: ZGPSwitch', () => {

  const DATA = {
    state: {
      "buttonevent": 34,
      "lastupdated": "2019-10-03T15:34:35"
    },
    "swupdate": {
      "state": "notupdatable",
      "lastinstall": null
    },
    "config": {
      "on": true
    },
    "name": "Hue Tap 1",
    "type": "ZGPSwitch",
    "modelid": "ZGPSWITCH",
    "manufacturername": "Philips",
    "productname": "Hue tap switch",
    "diversityid": "d8cde5d5-0eef-4b95-b0f0-71ddd2952af4",
    "uniqueid": "00:00:00:00:00:40:07:c7-f2",
    "capabilities": {
      "certified": true,
      "primary": true,
      "inputs": [
        {
          "repeatintervals": [],
          "events": [
            {
              "buttonevent": 34,
              "eventtype": "initial_press"
            }
          ]
        },
        {
          "repeatintervals": [],
          "events": [
            {
              "buttonevent": 16,
              "eventtype": "initial_press"
            }
          ]
        },
        {
          "repeatintervals": [],
          "events": [
            {
              "buttonevent": 17,
              "eventtype": "initial_press"
            }
          ]
        },
        {
          "repeatintervals": [],
          "events": [
            {
              "buttonevent": 18,
              "eventtype": "initial_press"
            }
          ]
        }
      ]
    }
  };

  const ID = 2;

  let sensor;

  beforeEach(() => {
    sensor = new ZGPSwitch(ID);
    sensor._populate(DATA);
  });


  it('should create a ZGPSwitch Sensor using valid data', () => {
    expect(sensor).to.have.property('id').to.equal(ID);

    expect(sensor).to.have.property('name').to.equal(DATA.name);
    expect(sensor).to.have.property('type').to.equal(DATA.type);
    expect(sensor).to.have.property('modelid').to.equal(DATA.modelid);
    expect(sensor).to.have.property('manufacturername').to.equal(DATA.manufacturername);

    expect(sensor).to.property('on').to.equal(DATA.config.on);

    expect(sensor).to.have.property('buttonevent').to.equal(DATA.state.buttonevent);
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

  //TODO test other properties of the sensor

});