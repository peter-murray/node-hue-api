# Sensors API

The sensors API allows you to interact with the sensors features of the Hue Bridge.

* [Sensor Objects](#sensors)
* [getAll()](#getall)
* [getSensor(id)](#getsensor)
* [searchForNew()](#searchfornew)
* [getNew()](#getnew)
* [renameSensor(sensor)](#renamesensor)
* [updateName()](#updatename)
* [createSensor(sensor)](#createsensor)
* [deleteSensor(id)](#deletesensor)
* [updateSensorConfig(sensor)](#updatesensorconfig)
* [updateSensorState(sensor)](#updatesensorstate)


## Sensors

There are many different types of `Sensors` that can exist in a Hue Bridge. Some of these are actual Physical Sensors 
and others can be Programmable `CLIP` Sensors.

Consult the documentation for the `CLIP Sensors` [here](sensor.md).



## getAll()
This function allows you to retrieve all the sensors that are stored in the Hue Bridge.

```js
api.sensors.getAll()
  .then(allSensors => {
    // Display the details of the sensors we got back
    console.log(JSON.stringify(allSensors, null, 2));
  })
;
```

This will return an Array of `Sensor` objects that exist in the Hue Bridge. 

A complete code sample for getting all sensors is available [here](../examples/v3/sensors/getAllSensors.js).



## getSensor()
The `getSensor(id)` function will obtain the sensor identified by the specified `id` value.

```js
// Get the daylight sensor for the bridge, at id 1
api.sensors.getSensor(1)
  .then(sensor => {
    console.log(sensor.toStringDetailed());
  })
;
```

The Sensor that is returned will be an instance of `Sensor` or one of the many specializations that the bridge supports.
See [here](#sensors) for more details.

A complete code sample is available [here](../examples/v3/sensors/getSensor.js).



## searchForNew()
The `searchForNew()` function will initiate a search for new sensors.

```js
api.sensors.searchForNew()
  .then(result => {
    console.log(`Initiated search for new sensors? ${result}`);
  })
;
```

A `Boolean` result is returned indicating the success state of starting a search.

A complete code sample is available [here](../examples/v3/sensors/searchForNew.js).



## getNew()
The `getNew()` function will return the new sensors that were discovered in the previous search for new sensors.

```js
api.sensors.getNew()
  .then(result => {
    // Show the time of the last scan
    console.log(`Last Scan Performed: ${result.lastscan}`);
    // Display the new sensors
    console.log(`Sensors found:\n${JSON.stringify(result.sensors, null, 2)}`);
  })
;
```

The return `Object` has the following properties:

* `lastscan`: The timestamp of the last search
* `sensors`: An `Array` of the sensors that were discovered in the last search

A complete code sample is available [here](../examples/v3/sensors/getNewSensors.js).


## renameSensor()
The `renameSensor(sensor)` function will allow you to rename an existing Sensor in the Hue Bridge.

The parameters are:

* `sensor`: The updated `Sensor` object with the changed name.

```js
// The sensor would have been previously obtained from the bridge.
sensor.name = 'Updated Sensor Name';

api.sensors.renameSensor(sensor)
  .then(result => {
    console.log(`Updated Sensor Name? ${result}`)
  });
```

The result from the function call will be a `Boolean` indicating the success status of the renaming action.

A complete code sample is available [here](../examples/v3/sensors/renameSensor.js).


## updateName()
The `updateName(id, name)` function will allow you to rename an existing Sensor in the Hue Bridge.
This has been deprecated, use [`reanmeSesnor(sensor)`](#renamesensor) instead.


## createSensor()
The `createSensor(sensor)` function allows you to create software backed `CLIP` sensors.

For details on creating the various types of sensors that the Hue Bridge supports, consult the [sensor](sensor.md) 
documentation or the [example code](../examples/v3/sensors/creatingClipSensors.js)

```js
api.sensors.createSensor(sensor)
  .then(sensor => {
    console.log(`Created sensor\n${sensor.toStringDetailed()}`)
  })
```

The promise will resolve to an instance of a `Sensor` that will be an instance of the type of sensor data that you 
passed in. e.g. a `CLIPOpenClose` sensor.

A complete code sample is available [here](../examples/v3/sensors/createNewSensor.js).


## deleteSensor()
The `deleteSensor(id)` function allows you to delete a sensor with the specified `id`.

* `id`: The id of the `Sensor` or the `Sensor` itself to be deleted from the Bridge.

```js
api.sensors.deleteSensor(sensorIdToRemove)
  .then(result => {
    console.log(`Sensor deleted? ${result}`);
  })
  .catch(err => {
    if (err.getHueErrorType() === 3) {
      console.log(`Sensor was not found`);
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  })
;
```

The function call will return a `Boolean` with the success status of the deletion of the specified sensor. If the Sensor 
is not found in the bridge, an `ApiError` will be thrown.

A complete code sample is available [here](../examples/v3/sensors/deleteSensor.js).



## updateSensorConfig()
The `updateSensorConfig(sensor)` function will update the `Sensor`s `config` attributes on the Hue Bridge.

* `sensor`: The `Sensor` from the bridge with the `config` attributes updated to the desired state.

```js
api.sensors.updateSensorConfig(sensor)
  .then(result => {
    console.log(`Updated sensor config? ${result}`);
  })
```

_Note: The config attributes differ depending upon the type of Sensor that you are dealing with. To identify what 
`config` attributes are available you can get the Sensor from the Hue Bridge and use the `.toStringDetailed()` function
on it to show the `config` attributes for that `Sensor`._

The function will resolve to a `Boolean` indicating the successful updating of the config values.



## updateSensorState()
The `updateSensorState(sensor)` function allows you to update a `CLIPSensor`s state using the current state of the provided
sensor object.

* `sensor`: The `Sensor` object with the updated state values to be stored. You can get the Sensor by retrieving it 
from the Hue Bridge via a [`get(id)`](#get) or [`getAll()`](#getall) call.

```js
api.sensors.updateSensorState(mySensor)
  .then(result => {
    console.log(`Sensor Updated? ${result}`);
  });
```

The function will resolve to a `Object` with the keys being the state values that were attempted to be updated and the 
value set to a `Boolean` indicating if the bridge updated the value.

For example for an OpenClose `Sensor` it would return the following object (as it only has a state of `open`):
```json
{
  "open": true
}
```

_Note: This will only work for CLIP `Sensor` types as other sensor types are usually hardware devices. Each type of 
sensor has different state attributes that can be modified. Consult the [`Sensor` documentation](./sensor.md) for the 
state attributes for the sensor type that you are interacting with._

A complete code sample is available [here](../examples/v3/sensors/updateSensorState.js).