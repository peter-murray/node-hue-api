# Sensors API

The sensors API allows you to interact with the sensors features of the Hue Bridge.

* [Sensor Objects](#sensors)
* [getAll()](#getall)
* [get(id)](#get)
* [searchForNew()](#searchfornew)
* [getNew()](#getnew)
* [updateName()](#updatesensorname)
* [createSensor()](#createsensor)
* [deleteSensor()](#deletesensor)
* [updateSensorConfig()](#updatesensorconfig)
* [updateSensorState()](#updatesensorstate)


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



## get()
The `get(id)` function will obtain the sensor identified by the specified `id` value.

```js
// Get the daylight sensor for the bridge, at id 1
api.sensors.get(1)
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



## updateName()
The `updateName(id, name)` function will allow you to rename an existing Sensor in the Hue Bridge.

The parameters are:

* `id`: The id of the sensor that you want to rename
* `name`: The new name for the sensor identified by the `id` value.

```js
api.sensors.updateName(sensorId, newName)
  .then(result => {
    console.log(`Updated Sensor Name? ${result}`)
  });
```

The result from the function call will be a `Boolean` indicating the success status of the renaming action.

A complete code sample is available [here](../examples/v3/sensors/updateSensorName.js).



## createSensor()
The `createSensor(sensor)` function allows you to create software backed `CLIP` sensors.

For details on creating the various types of sensors that the Hue Bridge supports, consult the [sensor](sensor.md) 
documentation or the [example code](../examples/v3/sensors/creatingClipSensors.js)



## deleteSensor()
The `deleteSensor(id)` function allows you to delete a sensor witht he specified `id`.

```js
api.sensors.deleteSensor(sensorIdToRemove)
  .then(result => {
    // Show the time of the last scan
    console.log(`Last Scan Performed: ${result.lastscan}`);
    // Display the new sensors
    console.log(`Sensors found:\n${JSON.stringify(result.sensors, null, 2)}`);
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

The function call will return a `Boolean` witht he success status of the deletion of the specified sensor. If the Sensor 
is not found in the bridge, an `ApiError` will be thrown.

A complete code sample is available [here](../examples/v3/sensors/deleteSensor.js).



## updateSensorConfig()
TODO


## updateSensorState()
TODO

