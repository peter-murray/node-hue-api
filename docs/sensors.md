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
'use strict';

const v3 = require('../../../index').v3;
const USERNAME = 'my secret username';

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.create(host, USERNAME);
  })
  .then(api => {
    return api.sensors.getAll();
  })
  .then(allSensors => {
    // Display the details of the sensors we got back
    console.log(JSON.stringify(allSensors, null, 2));
  })
;
```


## get(id)


## searchForNew()


## getNew()


## updateName(id, name)


## createSensor(sensor)


## deleteSensor(id)


## updateSensorConfig(sensor)


## updateSensorState(sensor)

