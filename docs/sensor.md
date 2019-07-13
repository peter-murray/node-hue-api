# Sensor

The Hue Bridge can support a number of sensors. The API has various objects for each of the types of Sensors that the 
Hue Bridge can support.

Some of these Sensors are Hardware sensors whilst others are Software constructs that can be updated by API calls.

The sensors that can be built and controlled via software are the `CLIP` variety.

The API provides access to the Sensor objects via the [`v3.api.sensors` API](sensors.md), but you can also create new 
CLIP Sensor objects using the various CLIP sensor classes from the `v3.sensors.clip` objects.


- [CLIP Sensors](#clipsensors) 
  - [CLIP GenericFlag](#clipgenreicflag) 
  - [CLIP GenericStatus](#clipgenericstatus) 
  - [CLIP Humidity](#cliphumidity) 
  - [CLIP LightLevel](#cliplightlevel) 
  - [CLIP OpenClose](#clipopenclose) 
  - [CLIP Presence](#clippresence) 
  - [CLIP Switch](#clipswitch) 
  - [CLIP Temperatue](#cliptemperature) 
  


## CLIP Sensors

CLIP Sensors allow you to integrate external objects and statuses into the Hue Bridge via CLIP Sensors.

For example you may have the ability to detect the humidity in a room and want to store this value in the Hue Bridge. 
You can do this using a `CLIPHumidity` Sensor which can be saved and then updated in the Hue Bridge upon changes.

All sensors have the following mandatory properties:

* `type`: This is the type of sensor, this is readable and only set at the time of instantiation of the object
* `modelid`: A model ID for the sensor which should uniquely identify the hardware model oif the device from the manufacturer
* `manufacturername`: The manufacturer name of the sensor
* `uniqueid`: A unique ID for the sensor, this should be the MAC Address of the device
* `swversion`: A software version running on the sensor
* `name`: A name for the sensor which will be the human readable name

The above properties have to be set when creating a new sensor from scratch in code, except for `name` which can be 
modified after creation.

All CLIP Sensors also have the following properties:

* `id`: A readonly value for the `id` that the Hue Bridge will assign to a Sensor
* `lastupdated`: A readonly timestamp value when the sensor was last updated in the Hue Bridge
* `on`: `get` and `set`, turns the sensor on/off. When off, state changes of the sensor are not reflected in the sensor resource
* `reachable`: `get` and `set`, indicates whether communication with the device is possible
* `battery`: `get` and `set`, the current battery state in percent for battery powered devices
* `url`: `get` and `set`, an optional URL to the CLIP sensor



### CLIPGenericFlag
The `CLIPGenericFlag` sensor is a `Boolean` flag sensor.

A generic sensor object for 3rd party IP sensor use.
E.g. the portal can make use of a Generic sensor to indicate IFTTT events.


The unique properties for the GenericFlag Sensor are:

* `flag`: `get` and `set` stores a `Boolean` state


Creating a `CLIPGenericFlag` sensor can be done as shown below:
```js
const CLIPGenericFlag = require('node-hue-api').v3.sensors.clip.GenericFlag;

const sensorConfig = {
  modelid: 'software',
  swversion: '1.0',
  uniqueid: '00:00:00:01',
  manufacturername: 'software'
};

const mySensor = new CLIPGenericFlagSensor(sensorConfig);

// Set the name of the sensor
mySensor.name = 'My awesome clip generic flag sensor';

// Set the flag state to true
mySensor.flag = true;
```

A complete code sample for sensors is available [here](../examples/v3/sensors/creatingCLIPSensors.js).
 


### CLIPGenericStatus
The `CLIPGenericStatus` sensor is a `Integer` value sensor.

A generic sensor object for 3rd party IP sensor use.
E.g. the portal can make use of a Generic sensor to indicate IFTTT events.


The unique properties for the `GenericFlag` Sensor are:

* `status`: `get` and `set`, stores an integer value


Creating a `CLIPGenericStatus` sensor can be done as shown below:
```js
const CLIPGenericStatus = require('node-hue-api').v3.sensors.clip.GenericStatus;

const sensorConfig = {
  modelid: 'software',
  swversion: '1.0',
  uniqueid: '00:00:00:01',
  manufacturername: 'software'
};

const mySensor = new CLIPGenericStatusSensor(sensorConfig);

// Set the name of the sensor
mySensor.name = 'My awesome clip generic status sensor';
// Set the status to 1000
mySensor.status = 1000;
```

A complete code sample for sensors is available [here](../examples/v3/sensors/creatingCLIPSensors.js).




### CLIPHumidity
The `CLIPHumidity` sensor is a sensor measuring the current ambient humidity.

The unique properties for the `Humidity` Sensor are:

* `humidity`: `get` and `set`, the ambient humidity in 0.01% steps, e.g. 2000 = 20%

Creating a `CLIPHumidity` sensor can be done as shown below:
```js
const CLIPHumiditySensor = require('node-hue-api').v3.sensors.clip.Humidity;

const sensorConfig = {
  modelid: 'software',
  swversion: '1.0',
  uniqueid: '00:00:00:01',
  manufacturername: 'software'
};

const mySensor = new CLIPHumiditySensor(sensorConfig);

// Set the name of the sensor
mySensor.name = 'Lounge Humidity';
// Set the humidity level
mySensor.humidity = 1000; // 10%
```

A complete code sample for sensors is available [here](../examples/v3/sensors/creatingCLIPSensors.js).




### CLIPLightLevel
The `CLIPLightLevel` sensor indicates the ambient light level at the sensor location.

The unique properties for the `Lighlevel` Sensor are:

* `tholddark`: `get` and `set`, threshold used in rules to determine insufficient light level, below threshold, between `0` and `65535`
* `tholdoffset`: `get` and `set`, threshold used in riles to determine sufficient light level, above threshold, between `0` and `65535`
* `lightlevel`: `get` and `set`, light level in `10000 log10 (lux) + 1` value measured by sensor, between `0` and `65535`
* `dark`: `get` and `set`, `Boolean` indicating light level is at or below given dark threshold, between `0` and `65535`
* `daylight`: `get` and `set`, `Boolean` indicating light level is at or above light threshold (dark + offset), between `0` and `65535`

Creating a `CLIPLightLevel` sensor can be done as shown below:
```js
const CLIPLightLevel = require('node-hue-api').v3.sensors.clip.LightLevel;

const sensorConfig = {
  modelid: 'software',
  swversion: '1.0',
  uniqueid: '00:00:00:01',
  manufacturername: 'software'
};

const mySensor = new CLIPLightLevel(sensorConfig);

// Set the name of the sensor
mySensor.name = 'Lounge LightLevel';
// Set the light level
mySensor.lightlevel = 1000;
```

A complete code sample for sensors is available [here](../examples/v3/sensors/creatingCLIPSensors.js).



### CLIPOpenClose

A complete code sample for sensors is available [here](../examples/v3/sensors/creatingCLIPSensors.js).


### CLIPPresence

A complete code sample for sensors is available [here](../examples/v3/sensors/creatingCLIPSensors.js).

### CLIPSwitch

A complete code sample for sensors is available [here](../examples/v3/sensors/creatingCLIPSensors.js).

### CLIPTemperature

A complete code sample for sensors is available [here](../examples/v3/sensors/creatingCLIPSensors.js).