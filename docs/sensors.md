# Sensors API

The sensors API allows you to interact with the sensors features of the Hue Bridge.


* [getAll()]()
* [get(id)]()
* [searchForNew()]()
* [getNew()]()
* [updateName()]()
* [createSensor()]()
* [deleteSensor()]()
* [updateSensorConfig()]()
* [updateSensorState()]()


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

This will return an Array of `Sensor` objects that exist in the Hue Bridge. There are many different types of `Sensors`
that can exist in a Hue Bridge. Some of these are actual Physical Sensors and others can be Programmable `CLIP` Sensors. 


## get(id)


## searchForNew()


## getNew()


## updateName(id, name)


## createSensor(sensor)


## deleteSensor(id)


## updateSensorConfig(sensor)


## updateSensorState(sensor)

