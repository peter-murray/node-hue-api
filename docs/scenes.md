# Scenes API

The `scenes` API provides a means of interacting with the scenes in Hue Bridge.

The Scenes API interacts with specific [`Scene`](./scene.md) objects stored in the Hue Bridge. These are not to be 
confused with the preset scenes that are present in the Android and iOS Hue applications.

There are a number of limitations on Scenes in the Hue Bridge.
* The bridge can support up to 200 Scenes
* There is a maximum of 2048 Scene LightStates which may lower the maximum number of Scenes that can be stored

For example if you have 20 LightStates stored on each Scene, the maximum number of Scenes that can be stored in the 
Bridge will be 102.


* [getAll()](#getall)
* [getScene(id)](#getscene)
* [getSceneByName(name)](#getscenebyname)
* [createScene()](#createscene)
* [updateScene()](#updatescene)
* [updateLightState()](#updatelightstate)
* [deleteScene()](#deletescene)
* [activateScene](#activatescene)


## getAll()
The `getAll()` function allows you to get all the scenes that the Hue Bridge has registered with it.

```js
api.scenes.getAll()
  .then(allScenes => {
    // Display the Scenes from the bridge
    console.log(JSON.stringify(allScenes, null, 2));
  });
```

This function call will resolve to an `Array` of `Scene` objects. 

A complete code sample for this function is available [here](../examples/v3/scenes/getAllScenes.js).



## getScene()
The `getScene(id)` function allows a specific scene to be retrieved from the Hue Bridge.

* `id`: The `String` id of the scene to retrieve or a previous `Scene` instance obtained from the bridge.


```js
api.scenes.getScene('GfOL56sqKPGmPer')
  .then(scene => {
    console.log(scene.toStringDetailed());
  })
;
```

This function call will resolve to a `Scene` object for the specified scene `id`.

If the Scene cannot be found an `ApiError` will be returned with a `getHueErrorType()` value of `3`.

A complete code sample for this function is available [here](../examples/v3/scenes/getScene.js).



## getSceneByName()
The `getSceneByName(name)` function will find all the scenes that are stored in the bridge with the specified `name`.

* `name`: The `String` that represents the name of the `Scene`s that you wish to find.

```js
api.scenes.getSceneByName('Concentrate')
  .then(results => {
    // Do something with the scenes we found
    results.forEach(scene => {
      console.log(scene.toStringDetailed());
    });
  })
;
```

The function will resolve to an `Array` of `Scene` Objects that were matched to the specified `name`.

A complete code sample for this function is available [here](../examples/v3/scenes/getSceneByName.js).



## createScene()
The `createScene(scene)` function allows for the creation of new `Scene`s in the Hue Bridge.

* `scene`: A `Scene` object that has been configured with the desired settings for the scene being created.

```js
const scene = v3.model.createLightScene();
scene.name = 'My Scene';
scene.lights = [1, 2, 3];

api.scenes.createScene(scene)
  .then(scene => {
    console.log(`Successfully created scene\n${scene.toStringDetailed()}`);
  })
;
```

The function will resolve with a corresponding `GroupScene` or `LightScene` object, depending upon what was passed in.

_Note: Whilst the Hue API itself will allow a scene to be updated via creation call, this library will prevent such a 
thing, by removing any `id` value from the `Scene` object to prevent overwriting an existing `Scene`.

A complete code sample for this function is available [here](../examples/v3/scenes/createScene.js).



## updateScene()
The `update(scene)` function allows you to update an existing `Scene` in the Hue Bridge.

* `scene`: The `Scene` object that contains the relevant updated data to apply to the existing scene.

```js
// The scene would have be retrieved from the bridge using some other call.
const scene;
scene.name = 'Updated scene name';

api.scenes.updateScene(scene)
  .then(updated => {
    console.log(`Updated scene properties: ${JSON.stringify(updated)}`);
  })
;
```

The function will resolve to an object that contains the attribute names of the scene that were updated set tot he success 
status of the change to the attribute.

For example, the result from the above example would resolve to:

```js
{
  "name": true
}
``` 

A complete code sample for this function is available [here](../examples/v3/scenes/updateScene.js).



## updateLightState()
The `updateLightState(id, lightId, lightstate)` function allows you to update the LightState stored for a specific light
in a `Scene`.

* `id`: The `String` id for the Scene to update
* `lightId`: The `Integer` id value for the Light in the Scene to update the LightState of
* `lightstate`: The `SceneLightState` object containing the desired state for the specified light to activate when the
    scene is activated.

_Note: The `SceneLightState` is a simplified `LightState` object and can be imported using:_
```js
const SceneLightState = require('node-hue-api').v3.lightStates.SceneLightState;
```

```js
const sceneLightState = new SceneLightState();
sceneLightState.on().brightness(100)

api.scenes.updateLightState(sceneId, lightId, sceneLightState)
  .then(results => {
    // Show the resultant updated attributes that were modified from the update request
    console.log(`Updated LightState values in scene:`)
    console.log(JSON.stringify(results, null, 2));
  })
;
```

The function will resolve to an `Object` that contains the `SceneLightState` values that were updated along with the 
success state of the requested change.

For example if you passed a `SceneLightState` that updated the `on` and `bri` attributes you would get a result object of the form:

```js
{
  "on": true,
  "bri": true
}
```

A complete code sample for this function is available [here](../examples/v3/scenes/updateSceneLightState.js).


## deleteScene()
The `deleteScene(id)` function will delete the specified scene identified by the `id` from the Hue Bridge.

* `id`: The `id` of the Scene or a `Scene` instance to delete from the Hue Bridge.

```js
api.scenes.deleteScene('abc170f')
  .then(result => {
    console.log(`Deleted scene? ${result}`);
  })
;
```

The call will resolve to a `Boolean` indicating the success status of the deletion.

A complete code sample for this function is available [here](../examples/v3/scenes/deleteScene.js).


## activateScene()
The `activateScene(id)` function allows you to activate an existing stored `Scene`.

* `id`: The id of the `Scene` to be activated.

```js
api.scenes.activateScene('GfOL56sqKPGmPer')
  .then(activated => {
    console.log(`The Scene was successfully activated? ${activated}`);
  })
;
```

The function call will resolve to a `Boolean` indicating the success state for the activation of the `Scene`.

_Note: Scene activation is really a feature of the [Groups API](./groups.md), not the underlying Scenes API that the 
bridge provides. This function is provided as a convenience function._

See the [Groups API](./groups.md#activating-a-scene) for more details on activating a `Scene`.