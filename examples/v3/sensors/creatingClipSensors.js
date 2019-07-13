'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const clipSensors = v3.sensors.clip;


//**********************************************************************************************************************
// Create a CLIPGenericFlag Sensor
//
const genericFlagSensor = new clipSensors.GenericFlag({
  modelid: 'software',
  swversion: '1.0',
  uniqueid: '00:00:00:01',
  manufacturername: 'node-hue-api',
  name: 'my-generic-flag-sensor'
});

genericFlagSensor.flag = false;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(genericFlagSensor.payload, null, 2));

//**********************************************************************************************************************



//**********************************************************************************************************************
// Create a CLIPGenericStatus Sensor
//
const genericStatusSensor = new clipSensors.GenericStatus({
  modelid: 'software',
  swversion: '1.0',
  uniqueid: '00:00:00:01',
  manufacturername: 'node-hue-api',
  name: 'my-generic-status-sensor'
});

genericStatusSensor.status = 100;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(genericStatusSensor.payload, null, 2));

//**********************************************************************************************************************



//**********************************************************************************************************************
// Create a CLIP Humidity Sensor
//
const humiditySensor = new clipSensors.Humidity({
  modelid: 'software',
  swversion: '1.0',
  uniqueid: '00:00:00:01',
  manufacturername: 'node-hue-api',
  name: 'My Humidity Sensor'
});

humiditySensor.humidity = 2000; // This is 20% as it stores values in 0.01% steps

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(humiditySensor.payload, null, 2));

//**********************************************************************************************************************



//**********************************************************************************************************************
// Create a CLIP Light Level Sensor
//
const lightLevelSensor = new clipSensors.Lightlevel({
  modelid: 'software',
  swversion: '1.0',
  uniqueid: '00:00:00:01',
  manufacturername: 'node-hue-api',
  name: 'Lounge Light Level'
});

lightLevelSensor.lightlevel = 0;
lightLevelSensor.dark = true;
lightLevelSensor.daylight = false;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(lightLevelSensor.payload, null, 2));

//**********************************************************************************************************************