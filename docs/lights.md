# Lights API

The `lights` API provides a means of interacting with the lights in Hue Bridge.

* [Light Object](#light-object)
* [getAll()](#getAll)
* [getLight()](#getlight)
* [getLightById(id)](#getlightbyid): Deprecated
* [getLightByName(name)](#getlightbyname)
* [searchForNew()](#searchfornew)
* [getNew()](#getnew)
* [getLightAttributesAndState(id)](#getlightattributesandstate)
* [getLightState(id)](#getlightstate)
* [setLightState(id, state)](#setlightstate)
* [renameLight(light)](#renamelight)
* [deleteLight(id)](#deletelight)


## Light Object
Any function calls that will return an instance of a Light, will return a [`Light`](./light.md) instance. 
The `Light` object provides useful getters and setters for interacting with the Light. Consult the [documentation](./light.md)
for specifics.



## getAll()
The `getAll()` function allows you to get all the lights that the Hue Bridge has registered with it.

```js
api.lights.getAll()
  .then(allLights => {
    // Display the lights from the bridge
    console.log(JSON.stringify(allLights, null, 2));
  });
```

This function call will resolve to an `Array` of `Light` objects. 

A complete code sample for this function is available [here](../examples/v3/lights/getAllLights.js).



## getLight()
The `getLight(id)` function allows you to retrieve a specific light.

* `id`: The `id` number or a `Light` instance to retrieve from the bridge.

```js
api.lights.getLight(id)
  .then(light => {
    // Display the details of the light
    console.log(light.toStringDetailed());
  });
```

This function call will return a Promise that will resolve to a single `Light` instance.

A complete code sample for this function is available [here](../examples/v3/lights/getLight.js).


## getLightById()
This API `getLightById(id)` has bee deprecated, use [`getLight(id)`](#getlight) instead.



## getLightByName()
The `getLightByName(name)` function allows you to retrieve a specific light by it's associated name value.

```js
api.lights.getLightByName(name)
  .then(light => {
    // Display the details of the light
    console.log(light.toStringDetailed());
  });
```

This function call will resolve to a single `Light` instance.

A complete code sample for this function is available [here](../examples/v3/lights/getLight.js).



## searchForNew()
The `searchForNew()` function will initiate a search for new lights by the Hue Bridge. It will search for at least 40 seconds 
(but may run longer if lights are found). The search is asynchronous and performed on the bridge. To obtain the results
from a previous search, use the `getNew()` API function.

Calling this function whilst a search is in progress will extend the search for another 40 seconds.

```js
api.lights.searchForNew()
  .then(searchStarted => {
    // Display the status of the search request
    console.log(`Search for new lights started? ${searchStarted}`);
  });
``` 

The function will resolve to a `Boolean` status as to whether or no a search was activated, or extended.

A complete code sample for this function is available [here](../examples/v3/lights/searchForNewLights.js).



## getNew()
The `getNew()` function obtains the list of Lights that were discovered from the last time a search was performed (via `searchForNew()`).
Note, the lights that are provided in this API call will be cleared when a new search is initiated on the Hue Bridge.

```js
api.lights.getNew()
  .then(results => {
    // Display the details of the search results
    console.log(JSON.stringify(results, null, 2));
  });
```

The function will resolve to a JSON payload consisting of a `lastscan` property that will be set to the timestamp of the 
last scan that was performed.

If any lights are found they will be presented under the `id` value that has been associated with the light,, e.g. 5 and the
data value associate with it will be the JSON payload for the light.

For example if a light of id 7 is found the returned JSON payload will be:

```json
{
  "lastscan": "2019-07-13T09:58:20",
  "7": {
    "name": "Hue Lamp 7"
  }
}
```

A complete code sample for this function is available [here](../examples/v3/lights/getNewLights.js).



## getLightAttributesAndState()
The `getLightSttributesAndState(id)` function allows you to retrieve all the attributes and the state of a particular 
light from the Hue Bridge.

```js
api.lights.getLightAttributesAndState(id)
  .then(attributesAndState => {
    // Display the details of the light
    console.log(JSON.stringify(attributesAndState, null, 2));
  });
```

This will resolve to an `Object` that contains all the attributes and the current state of the light, an example of this 
is shown below:

```json
{
  "id": 1,
  "state": {
    "on": false,
    "bri": 0,
    "hue": 38191,
    "sat": 94,
    "effect": "none",
    "xy": [
      0.3321,
      0.3605
    ],
    "alert": "select",
    "colormode": "xy",
    "mode": "homeautomation",
    "reachable": true
  },
  "swupdate": {
    "state": "notupdatable",
    "lastinstall": null
  },
  "type": "Color light",
  "name": "Living Colour Floor",
  "modelid": "LLC007",
  "manufacturername": "Philips",
  "productname": "LivingColors",
  "capabilities": {
    "certified": true,
    "control": {
      "mindimlevel": 10000,
      "maxlumen": 120,
      "colorgamuttype": "A",
      "colorgamut": [
        [
          0.704,
          0.296
        ],
        [
          0.2151,
          0.7106
        ],
        [
          0.138,
          0.08
        ]
      ]
    },
    "streaming": {
      "renderer": false,
      "proxy": false
    }
  },
  "config": {
    "archetype": "huebloom",
    "function": "decorative",
    "direction": "upwards"
  },
  "uniqueid": "xx:xx:xx:xx:xx:xx:xx:xx-xx",
  "swversion": "4.6.0.8274"
}
```

A complete code sample for this function is available [here](../examples/v3/lights/getLightAttributesAndState.js).



## getLightState()
You can obtain the current light state for a light using the `getLightState(id)` function.

```js
api.lights.getLightState(id)
  .then(state => {
    // Display the state of the light
    console.log(JSON.stringify(state, null, 2));
  });
```

This will resolve to an `Object` with the current state values of the light identified by the `id`. The state values 
returned will depend upon the type of the light and its current state values.

```json
{
  "on": false,
  "bri": 0,
  "hue": 38191,
  "sat": 94,
  "effect": "none",
  "xy": [
    0.3321,
    0.3605
  ],
  "alert": "select",
  "colormode": "xy",
  "mode": "homeautomation",
  "reachable": true
}
```

A complete code sample for this function is available [here](../examples/v3/lights/getLightState.js).


## setLightState()

The `setLightState(id, state)` function can be used to set the state of a light specified by the `id` to the specified 
`state` provided. 

You can either provide a data object with the desired properties set for the `state` or utilize the [`LightState`](lightState.md) 
object to build a desired `LightState` to set.


Example setting a simple light state of `on` using a simple object:
```js
api.lights.setLightState(id, {on: true})
  .then(result => {
    console.log(`Light state change was successful? ${result}`);
  })
``` 
A complete code sample for this function is available [here](../examples/v3/lights/setLightStateUsingObject.js).

Example using a LightState state to set `on` and `ct` value:
```js
const state = new LightState().on().ct(200);

api.lights.setLightState(LIGHT_ID, state)
  .then(result => {
    console.log(`Light state change was successful? ${result}`);
  })
```

The call will resolve to a `Boolean`  that indicates the success status of the change.

A complete code sample for this function is available [here](../examples/v3/lights/setLightStateUsingLightState.js).



## renameLight()

The `renameLight(id, name)` function allows you to rename the light identified by the `id` to the specified `name` value.

```js
api.lights.renameLight(id, 'my_new_name')
  .then(result => {
      console.log(`Successfully reanmed light? ${result}`);
  });
````

The call will resolve to a `Boolean` with the auccess status of the renaming.

A complete code sample for this function is available [here](../examples/v3/lights/renameLight.js).



## deleteLight()

The `deletLight(id)` function will allow you to remove the light identified by the `id` value from the Hue Bridge.

```js
api.lights.deleteLight(lightId)
  .then(result => {
    // Display the state of the light
    console.log(`Successfully delete light? ${result}`);
  })
```

The call will resolve to a `Boolean` indicate a successful deletion of the light. If the light is not found, it will
generate an error stating the resource is not available.

A complete code sample for this function is available [here](../examples/v3/lights/deleteLight.js).

