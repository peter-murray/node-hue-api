'use strict';

const fs = require('fs')
  , path = require('path')
  , expect = require('chai').expect
  , model = require('./index')
;

const TEST_DATA_PATH = path.join(__dirname, '../../test/data')
  , HUE_DATA_PATH = path.join(TEST_DATA_PATH, 'hue')
  , MODEL_DATA_PATH = path.join(TEST_DATA_PATH, 'model')
;


describe('Serialization Tests', () => {

  describe('groups', () => {

    describe('hue bridge payloads', () => {
      bridgeSerializationTest({
        parentDirectory: HUE_DATA_PATH,
        directoryName: 'groups',
        instanceCheckFn: model.isGroupInstance,
        typeFn: (payload) => {
          return payload.type.toLowerCase()
        }
      });
    });


    describe('node-hue-api payloads', () => {
      modelSerializationTest({
        parentDirectory: MODEL_DATA_PATH,
        directoryName: 'groups',
        instanceCheckFn: model.isGroupInstance,
      });
    });
  });


  describe('lights', () => {

    describe('hue bridge payloads', () => {
      bridgeSerializationTest({
        parentDirectory: HUE_DATA_PATH,
        directoryName: 'lights',
        instanceCheckFn: model.isLightInstance,
        typeFn: () => 'light'
      });
    });

    describe('node-hue-api payloads', () => {

      modelSerializationTest({
        parentDirectory: MODEL_DATA_PATH,
        directoryName: 'lights',
        instanceCheckFn: model.isLightInstance,
      });
    });
  });


  describe('sensors', () => {

    describe('hue bridge payloads', () => {
      bridgeSerializationTest({
        parentDirectory: HUE_DATA_PATH,
        directoryName: 'sensors',
        instanceCheckFn: model.isSensorInstance,
        typeFn: (payload) => {
          return payload.type.toLowerCase()
        }
      });
    });

    describe('node-hue-api payloads', () => {

      modelSerializationTest({
        parentDirectory: MODEL_DATA_PATH,
        directoryName: 'sensors',
        instanceCheckFn: model.isSensorInstance,
      });
    });
  });


  describe('schedules', () => {

    describe('hue bridge payloads', () => {
      bridgeSerializationTest({
        parentDirectory: HUE_DATA_PATH,
        directoryName: 'schedules',
        instanceCheckFn: model.isScheduleInstance,
        typeFn: () => 'schedule'
      });
    });

    describe('node-hue-api payloads', () => {

      modelSerializationTest({
        parentDirectory: MODEL_DATA_PATH,
        directoryName: 'schedules',
        instanceCheckFn: model.isScheduleInstance,
      });
    });
  });


  describe('resourcelinks', () => {

    describe('hue bridge payloads', () => {
      bridgeSerializationTest({
        parentDirectory: HUE_DATA_PATH,
        directoryName: 'resourcelinks',
        instanceCheckFn: model.isResourceLinkInstance,
        typeFn: () => 'resourcelink'
      });
    });

    describe('node-hue-api payloads', () => {

      modelSerializationTest({
        parentDirectory: MODEL_DATA_PATH,
        directoryName: 'resourcelinks',
        instanceCheckFn: model.isResourceLinkInstance,
      });
    });
  });


  describe('scenes', () => {

    describe('hue bridge payloads', () => {
      bridgeSerializationTest({
        parentDirectory: HUE_DATA_PATH,
        directoryName: 'scenes',
        instanceCheckFn: model.isSceneInstance,
        typeFn: (payload) => {
          return payload.type.toLowerCase();
        },
        convertIdFn: (id) => {
          return `${id}`
        },
      });
    });

    describe('node-hue-api payloads', () => {

      modelSerializationTest({
        parentDirectory: MODEL_DATA_PATH,
        directoryName: 'scenes',
        instanceCheckFn: model.isSceneInstance,
      });
    });
  });
});


function modelSerializationTest(config) {
  const directory = config.parentDirectory
    , dirName = config.directoryName
    , instanceCheckFn = config.instanceCheckFn
  ;

  const cwd = path.join(directory, dirName);

  if (!fs.existsSync(cwd)) {
    return;
  }

  fs.readdirSync(cwd).forEach(file => {
    it(`should process model data "${file}"`, () => {
      // eslint-disable-next-line global-require
      const MODEL_PAYLOAD = require(path.join(cwd, file))
        , modelObject = model.createFromJson(MODEL_PAYLOAD)
      ;

      expect(instanceCheckFn(modelObject)).to.be.true;
      expect(modelObject.getJsonPayload()).to.deep.equal(MODEL_PAYLOAD);
    });
  });

}

function bridgeSerializationTest(config) {

  const directory = config.parentDirectory
    , dirName = config.directoryName
    , instanceCheckFn = config.instanceCheckFn
    , typeFn = config.typeFn
    , convertIdFn = config.convertIdFn || function (id) {
      return id
    }
  ;

  //TODO add validation of above

  const cwd = path.join(directory, dirName);
  if (!fs.existsSync(cwd)) {
    return;
  }

  fs.readdirSync(cwd).forEach(file => {
    it(`should process bridge data "${file}"`, () => {
      // eslint-disable-next-line global-require
      const BRIDGE_PAYLOAD = require(path.join(cwd, file));

      const id = 2
        , expected = removeNullsAndUndefined(Object.assign({id: convertIdFn(id)}, BRIDGE_PAYLOAD))
        , modelObject = model.createFromBridge(typeFn(BRIDGE_PAYLOAD), id, BRIDGE_PAYLOAD)
      ;

      expect(instanceCheckFn(modelObject)).to.equal(true, 'instance check failure');
      expect(modelObject.getHuePayload()).to.deep.equal(expected);
    });
  });
}

function removeNullsAndUndefined(data) {
  Object.keys(data).forEach(key => {
    if (data[key] === undefined || data[key] === null) {
      delete data[key];
    }

    if (data[key] instanceof Object) {
      removeNullsAndUndefined(data[key]);
    }
  });

  return data;
}