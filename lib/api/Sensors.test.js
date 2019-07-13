'use strict';

const expect = require('chai').expect
  , HueApi = require('../v3').api
  , discovery = require('../v3').discovery
  , testValues = require('../../test/support/testValues.js') //TODO move these
  , Sensor = require('../bridge-model/devices/sensors/Sensor')
  , CLIPOpenClose = require('../bridge-model/devices/sensors/CLIPOpenClose')
;


describe('Hue API #sensors', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        return HueApi.create(searchResults[0].ipaddress, testValues.username)
          .then(api => {
            hue = api;
          });
      });
  });


  function getSensorData(name) {
    return {
      name: name,
      modelid: 'software',
      swversion: '1.0',
      uniqueid: '00:00:00:01',
      manufacturername: 'software',
      config: {
        url: 'http://developers.meethue.com'
      }
    };
  }

  describe('#getAll()', () => {

    it('should get all sensors', async () => {
      const sensors = await hue.sensors.getAll();

      expect(sensors).to.be.instanceOf(Array);

      // The first sensor is usually the daylight sensor
      expect(sensors[0]).to.have.property('id').to.equal(1);
      expect(sensors[0]).to.have.property('name', 'Daylight');
      expect(sensors[0]).to.have.property('type', 'Daylight');
      expect(sensors[0]).to.have.property('modelid', 'PHDL00');
      expect(sensors[0]).to.have.property('manufacturername', 'Philips');
      expect(sensors[0]).to.have.property('swversion', '1.0');
    });
  });


  describe('#get()', () => {

    it('should get daylight sensor', async () => {
      const result = await hue.sensors.get(1);

      expect(result).to.be.instanceOf(Sensor);
      expect(result).to.have.property('id').to.equal(1);
      expect(result).to.have.property('name', 'Daylight');
    });
  });


  describe('#searchForNew()', () => {

    it('should start a search for new sensors', async () => {
      const result = await hue.sensors.searchForNew();

      expect(result).to.be.true;
    });
  });


  describe('#getNewSensors()', () => {

    it('should return new sensors', async () => {
      const result = await hue.sensors.getNew();

      expect(result).to.have.property('lastscan');
      //TODO could check it is one of the expected strings, none, active or a timestamp

      expect(result).to.have.property('sensors').to.be.instanceof(Array);
    });
  });


  describe('#create()', () => {

    let createdSensorId = -1;

    afterEach('remove the created sensor', async () => {
      if (createdSensorId > -1) {
        await hue.sensors.deleteSensor(createdSensorId);
      }
    });

    it('should create a new sensor', async () => {
      const sensor = new CLIPOpenClose(getSensorData('testSoftwareSensor'))
        , result = await hue.sensors.createSensor(sensor)
        , createdSensor = await hue.sensors.get(result.id)
      ;

      expect(result).to.have.property('id').to.be.greaterThan(0);
      createdSensorId = result.id;

      expect(createdSensor).to.have.property('name').to.equal(sensor.name);
      expect(createdSensor).to.have.property('modelid').to.equal(sensor.modelid);
      expect(createdSensor).to.have.property('swversion').to.equal(sensor.swversion);
      expect(createdSensor).to.have.property('uniqueid').to.equal(sensor.uniqueid);
      expect(createdSensor).to.have.property('manufacturername').to.equal(sensor.manufacturername);
    });
  });


  describe('#updateName()', () => {

    let sensorId;

    beforeEach('', async () => {
      const sensor = new CLIPOpenClose(getSensorData('updateNameTest'))
        , result = await hue.sensors.createSensor(sensor)
      ;
      sensorId = result.id;
    });

    afterEach('', async () => {
      await hue.sensors.deleteSensor(sensorId);
    });

    it('should update the name on an existing sensor', async () => {
      const initialSensor = await hue.sensors.get(sensorId)
        , newName = `newName-${Date.now()}`
        , result = await hue.sensors.updateName(sensorId, newName)
        , sensor = await hue.sensors.get(sensorId)
      ;

      expect(initialSensor.name).to.not.equal(newName);
      expect(result).to.be.true;
      expect(sensor).to.have.property('name').to.equal(newName);
    });
  });


  describe('#updateSensorConfig', () => {

    let sensorId;

    beforeEach('', async () => {
      const sensor = new CLIPOpenClose(getSensorData('testSensorConfig'))
        , result = await hue.sensors.createSensor(sensor)
      ;
      sensorId = result.id;
    });

    afterEach('', async () => {
      await hue.sensors.deleteSensor(sensorId);
    });


    it('should update the config', async () => {
      const sensor = await hue.sensors.get(sensorId);

      expect(sensor).to.have.property('on', true);

      // Update some configuration values
      sensor.on = false;

      const result = await hue.sensors.updateSensorConfig(sensor)
        , updatedSensor = await hue.sensors.get(sensor.id)
      ;

      expect(result).to.be.true;
      expect(updatedSensor).to.have.property('on', false);
    });
  });


  describe('#updateSensorState', () => {

    let sensorId;

    beforeEach('', async () => {
      const sensor = new CLIPOpenClose(getSensorData('testSensorConfig'))
        , result = await hue.sensors.createSensor(sensor)
      ;
      sensorId = result.id;
    });

    afterEach('', async () => {
      await hue.sensors.deleteSensor(sensorId);
    });


    it('should update the state', async () => {
      const sensor = await hue.sensors.get(sensorId);

      expect(sensor).to.have.property('open', false);

      // Update some state values
      sensor.open = true;

      const result = await hue.sensors.updateSensorState(sensor)
        , updatedSensor = await hue.sensors.get(sensor.id)
      ;

      expect(result).to.be.true;
      expect(updatedSensor).to.have.property('open', true);
      expect(updatedSensor).to.have.property('lastupdated').to.exist;
    });
  });
});