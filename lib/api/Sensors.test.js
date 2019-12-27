'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , testValues = require('../../test/support/testValues.js') //TODO move these
  , Sensor = require('../model/sensors/Sensor')
  , CLIPOpenClose = require('../model/sensors/CLIPOpenClose')
;


describe('Hue API #sensors', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        const localApi = v3Api.createLocal(searchResults[0].ipaddress);
        return localApi.connect(testValues.username)
          .then(api => {
            hue = api;
          });
      });
  });


  function createClipOpenCloseSensor(name) {
    const sensor = new CLIPOpenClose();
    sensor.name = name;
    sensor.modelid = 'software';
    sensor.swversion = '1.0';
    sensor.uniqueid = '00:00:00:01';
    sensor.manufacturername = 'software';
    sensor.config = {
      url: 'http://developers.meethue.com'
    };

    return sensor;
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
      const result = await hue.sensors.getSensor(1);

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


  describe('#createSensor()', () => {

    let createdSensor;

    afterEach('remove the created sensor', async () => {
      if (createdSensor) {
        await hue.sensors.deleteSensor(createdSensor);
      }
    });

    it('should create a new sensor', async () => {
      const sensor = createClipOpenCloseSensor('testSoftwareSensor')
        , result = await hue.sensors.createSensor(sensor)
      ;

      createdSensor = await hue.sensors.getSensor(result.id);

      expect(result).to.have.property('id').to.be.greaterThan(0);

      expect(createdSensor).to.have.property('name').to.equal(sensor.name);
      expect(createdSensor).to.have.property('modelid').to.equal(sensor.modelid);
      expect(createdSensor).to.have.property('swversion').to.equal(sensor.swversion);
      expect(createdSensor).to.have.property('uniqueid').to.equal(sensor.uniqueid);
      expect(createdSensor).to.have.property('manufacturername').to.equal(sensor.manufacturername);
    });
  });


  describe('#reanmeSensor()', () => {

    let sensorId;

    beforeEach('', async () => {
      const sensor = createClipOpenCloseSensor('updateNameTest')
        , result = await hue.sensors.createSensor(sensor)
      ;
      sensorId = result.id;
    });

    afterEach('', async () => {
      await hue.sensors.deleteSensor(sensorId);
    });

    it('should update the name on an existing sensor', async () => {
      const initialSensor = await hue.sensors.getSensor(sensorId)
        , newName = `newName-${Date.now()}`
      ;
      // Raname the sensor
      expect(initialSensor.name).to.not.equal(newName);
      initialSensor.name = newName;

      const result = await hue.sensors.renameSensor(initialSensor)
        , sensor = await hue.sensors.getSensor(sensorId)
      ;

      expect(result).to.be.true;
      expect(sensor).to.have.property('name').to.equal(newName);
    });
  });


  describe('#rename()', () => {

    let sensor;

    beforeEach('', async () => {
      const newSensor = createClipOpenCloseSensor('updateNameTest');
      sensor = await hue.sensors.createSensor(newSensor);
    });

    afterEach('', async () => {
      if (sensor) {
        await hue.sensors.deleteSensor(sensor);
      }
    });

    it('should update the name on an existing sensor', async () => {
      sensor.name = `newName-${Date.now()}`;

      const result = await hue.sensors.renameSensor(sensor)
        , updatedSensor = await hue.sensors.getSensor(sensor)
      ;

      expect(result).to.be.true;
      expect(updatedSensor).to.have.property('name').to.equal(sensor.name);
    });
  });


  describe('#updateSensorConfig', () => {

    let sensorId;

    beforeEach('', async () => {
      const sensor = createClipOpenCloseSensor('testSensorConfig')
        , result = await hue.sensors.createSensor(sensor)
      ;
      sensorId = result.id;
    });

    afterEach('', async () => {
      await hue.sensors.deleteSensor(sensorId);
    });


    it('should update the config', async () => {
      const sensor = await hue.sensors.getSensor(sensorId);

      expect(sensor).to.have.property('on');
      const initalOnState = sensor.on;

      // Update some configuration values
      sensor.on = !initalOnState;

      const result = await hue.sensors.updateSensorConfig(sensor)
        , updatedSensor = await hue.sensors.getSensor(sensor.id)
      ;

      expect(result).to.be.true;
      expect(updatedSensor).to.have.property('on', !initalOnState);
    });
  });


  describe('#updateSensorState', () => {

    let sensorId;

    beforeEach('', async () => {
      const sensor = createClipOpenCloseSensor('testSensorConfig')
        , result = await hue.sensors.createSensor(sensor)
      ;
      sensorId = result.id;
    });

    afterEach('', async () => {
      await hue.sensors.deleteSensor(sensorId);
    });


    it('should update the state', async function () {
      const sensor = await hue.sensors.getSensor(sensorId);
      expect(sensor).to.have.property('open', false);

      // Update some state values
      sensor.open = true;

      const result = await hue.sensors.updateSensorState(sensor)
        , updatedSensor = await hue.sensors.getSensor(sensor.id)
      ;
      expect(result).to.have.property('open').to.be.true;
      expect(updatedSensor).to.have.property('open', true);
      expect(updatedSensor).to.have.property('lastupdated').to.exist;
    });


    it('should update a subset of states when filtered', async () => {
      const sensor = await hue.sensors.getSensor(sensorId);

      expect(sensor).to.have.property('open', false);

      // Update some state values
      sensor.open = true;

      // Prevent any state updates to be performed
      const result = await hue.sensors.updateSensorState(sensor, [])
        , updatedSensor = await hue.sensors.getSensor(sensor.id)
      ;

      expect(Object.keys(result)).to.have.length(0);
      expect(updatedSensor).to.have.property('open', false);
      expect(updatedSensor).to.have.property('lastupdated').to.exist;
    });
  });
});