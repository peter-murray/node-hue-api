# Capabilities API

The `capabilities` API provides a means of obtaining the capabilities of the Bridge, along with totals as to how
many more things of each type can be stored/created.


* [getAll()](#getAll)
* [Capabilities Object](#capabilities-object)
  * [lights](#lights)
  * [sensors](#sensors)
  * [groups](#groups)
  * [scenes](#scenes)
  * [schedules](#schedules)
  * [rules](#rules)
  * [resourcelinks](#resourcelinks)
  * [streaming](#streaming)
  * [timezones](#timezones)


## getAll
The `getAll()` function will get the complete capabilities from the Hue Bridge.

```js
api.capabilities.getAll()
  .then(capabilities => {
    // Display the full capabilities from the bridge
    console.log(capabilities.toStringDetailed());
  })
;
```

The function call will resolve to a `Capabilities` Object. 

A complete code sample is available [here](../examples/v3/capabilities/getAllCapabilities.js).


## Capabilities Object

The Capabilities Object is an object that holds all the capability data obtained from the bridge.
The properties available on this object are detailed below:

### lights
Obtains the capabilities for the total number of supported lights on the bridge and how many more can be added.

* `get`

```js
{
  "available": 23,
  "total": 63
}
```

### sensors
Obtains the capabilities for the total number of supported sensors on the bridge and how many more can be added.
It has a further break down on the supported types of sensors, `clip`, `zll` and `zgp`.

* `get`

```js
{
    "available": 209,
    "total": 250,
    "clip": {
        "available": 209,
        "total": 250
    },
    "zll": {
        "available": 62,
        "total": 64
    },
    "zgp": {
        "available": 62,
        "total": 64
    }
}
```

### groups
Obtains the capabilities for the total number of supported groups on the bridge and how many more can be added.

* `get`

```js
{
  "available": 41,
  "total": 64
}
```

### scenes
Obtains the capabilities for the total number of supported scenes on the bridge and how many more can be added.
It also details how many more lightstates are in use and how many more can be created. 

* `get`

```js
{
    "available": 89,
    "total": 200,
    "lightstates": {
        "available": 5210,
        "total": 12600
    }
}
```

### schedules
Obtains the capabilities for the total number of supported schedules on the bridge and how many more can be added.

* `get`

```js
{
  "available": 97,
  "total": 100
}
```

### rules
Obtains the capabilities for the total number of supported rules on the bridge and how many more can be added.
It also contains similar breakdowns for the `conditions` and the `actions`.
* `get`

```js
{
    "available": 218,
    "total": 250,
    "conditions": {
        "available": 1429,
        "total": 1500
    },
    "actions": {
        "available": 956,
        "total": 1000
    }
```

### resourcelinks
Obtains the capabilities for the total number of supported schedules on the bridge and how many more can be added.

This is also available as `resourceLinks` getter on the Object (which is consistent with naming of ResourceLinks elsewhere in the API),

* `get`

```js
{
  "available": 51,
  "total": 64
}
```

### streaming
Obtains the capabilities for around the Entertainment streaming functions.

* `get`

```js
{
    "available": 1,
    "total": 1,
    "channels": 10
}
```

### timezones
Obtains a list of the timezones known to the Hue Bridge as an Array of `String`s.

* `get`