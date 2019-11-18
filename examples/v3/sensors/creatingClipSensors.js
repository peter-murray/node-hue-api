'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const model = v3.model;


//**********************************************************************************************************************
// Create a CLIPGenericFlag Sensor
//
const genericFlagSensor = model.createCLIPGenericFlagSensor();
genericFlagSensor.modelid = 'software';
genericFlagSensor.swversion = '1.0';
genericFlagSensor.uniqueid = '00:00:00:01';
genericFlagSensor.manufacturername = 'node-hue-api';
genericFlagSensor.name = 'my-generic-flag-sensor';

// Set the state attribute, flag
genericFlagSensor.flag = false;

// Display the details of the sensor
console.log(JSON.stringify(genericFlagSensor.getHuePayload(), null, 2));

//**********************************************************************************************************************


//**********************************************************************************************************************
// Create a CLIPGenericStatus Sensor
//
const genericStatusSensor = model.createCLIPGenericStatusSensor();
genericStatusSensor.modelid = 'software';
genericStatusSensor.swversion = '1.0';
genericStatusSensor.uniqueid = '00:00:00:01';
genericStatusSensor.manufacturername = 'node-hue-api';
genericStatusSensor.name = 'my-generic-status-sensor';

genericStatusSensor.status = 100;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(genericStatusSensor.getHuePayload(), null, 2));

//**********************************************************************************************************************


//**********************************************************************************************************************
// Create a CLIP Humidity Sensor
//
const humiditySensor = model.createCLIPHumiditySensor();
humiditySensor.modelid = 'software';
humiditySensor.swversion = '1.0';
humiditySensor.uniqueid = '00:00:00:01';
humiditySensor.manufacturername = 'node-hue-api';
humiditySensor.name = 'My Humidity Sensor';

humiditySensor.humidity = 2000; // This is 20% as it stores values in 0.01% steps

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(humiditySensor.getHuePayload(), null, 2));

//**********************************************************************************************************************


//**********************************************************************************************************************
// Create a CLIP Light Level Sensor
//
const lightLevelSensor = model.createCLIPLightlevelSensor();
lightLevelSensor.modelid = 'software';
lightLevelSensor.swversion = '1.0';
lightLevelSensor.uniqueid = '00:00:00:01';
lightLevelSensor.manufacturername = 'node-hue-api';
lightLevelSensor.name = 'Lounge Light Level';

lightLevelSensor.lightlevel = 0;
lightLevelSensor.dark = true;
lightLevelSensor.daylight = false;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(lightLevelSensor.getHuePayload(), null, 2));

//**********************************************************************************************************************


//**********************************************************************************************************************
// Create a CLIP Open Close Sensor
//
const openCloseSensor = model.createCLIPOpenCloseSensor();
openCloseSensor.modelid = 'software';
openCloseSensor.swversion = '1.0';
openCloseSensor.uniqueid = '00:00:00:01';
openCloseSensor.manufacturername = 'node-hue-api';
openCloseSensor.name = 'Lounge Door';

openCloseSensor.open = false;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(openCloseSensor.getHuePayload(), null, 2));

//**********************************************************************************************************************


//**********************************************************************************************************************
// Create a CLIP Presence Sensor
//
const presenceSensor = model.createCLIPPresenceSensor();
presenceSensor.modelid = 'software';
presenceSensor.swversion = '1.0';
presenceSensor.uniqueid = '00:00:00:01';
presenceSensor.manufacturername = 'node-hue-api';
presenceSensor.name = 'Lounge Presence';

presenceSensor.presence = true;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(presenceSensor.getHuePayload(), null, 2));

//**********************************************************************************************************************


//**********************************************************************************************************************
// Create a CLIP Switch Sensor
//
const switchSensor = model.createCLIPSwitchSensor();
switchSensor.modelid = 'software';
switchSensor.swversion = '1.0';
switchSensor.uniqueid = '00:00:00:01';
switchSensor.manufacturername = 'node-hue-api';
switchSensor.name = 'Lounge Wall Switch';

switchSensor.buttonevent = 2000;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(switchSensor.getHuePayload(), null, 2));

//**********************************************************************************************************************


//**********************************************************************************************************************
// Create a CLIP Temperature Sensor
//
const tempSensor = model.createCLIPTemperatureSensor();
tempSensor.modelid = 'software';
tempSensor.swversion = '1.0';
tempSensor.uniqueid = '00:00:00:01';
tempSensor.manufacturername = 'node-hue-api';
tempSensor.name = 'Lounge Temperature';

// Set temperature to 38.5 degrees
tempSensor.temperature = 3850;

// Display the payload of the sensor object that can be stored in the Hue Bridge
console.log(JSON.stringify(tempSensor.getHuePayload(), null, 2));

//**********************************************************************************************************************