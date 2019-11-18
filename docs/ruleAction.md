# RuleAction

A `RuleAction` is an object that defines an action that can be performed when a `Rule` is triggered in the Hue Bridge.

There are a number of different types of `RuleAction`s that can be built and to aid in this, the API provides a 
fluent interface for building up the various `RuleActions`s for `Rule`s.

* [Instantiating a RuleAction](#instantiating-an-action)
* [RuleAction](#ruleaction)
    * [LightStateAction](#lightstateaction)
    * [GroupStateAction](#groupstateaction)
    * [SensorStateAction](#sensorstateaction)
    * [SceneAction](#sceneaction)



## Instantiating a RuleAction
A `RuleAction` can be built using the `v3.model.ruleActions` Object, currently this allows for the creation of actions 
via the functions:

* `light`: Creates a [`LightStateAction`](#lightstateaction) that will set a `LightState` on a specific `Light`
* `group`:  Creates a [`GroupStateAction`](#groupstateaction) that will set a state `GroupLightState` on a `Group`
* `sensor`:  Creates a [`SensorStateAction`](#sensorstateaction) that will set a state on a `CLIPSensor` Object


## RuleAction
The base `RuleAction` class is a common base to all `RuleAction` types. It has the following properties and functions:

* `address`: `get` the address target for the `RuleAction`
* `body`: `get` the body payload for the `RuleAction`
* `id`: `get` the id for the target of the `RuleAction`, e.g. the Light id, Group id, Sensor id
* `method`: `get` the method of the `RuleAction`, in most cases this is `PUT` as the majority of actions are updates
* `withMethod(method)`: sets the method of the `RuleAction`
* `toString()`: Obtains a String representation of the `RuleAction`
* `payload()`: Obtains the payload that is set into the Hue Bridge for the `RuleAction` when the `Rule` is updated/created

---

### LightStateAction
A `LightStateAction` is a `RuleAction` that will help in constructing the `RuleAction` for setting a `LightState` on a `Light`
when a rule is triggered.

It contains all the properties and functions for [`RuleAction`](#ruleaction) above.


#### Instantiation
To get an instance of a `LightStateAction` use the function `v3.rules.actions.light(id)`

* `id`: The id for the light or a `Light` instance obtained from the bridge

The function will return an instance of a `LightStateAction`.


#### withState(state)
The `withState(state)` function allows you to specify the state that will be applied to the `Light`.

* `state`: The [`LightState`](lightState.md) to apply to the `Light`, or a JSON payload of attributes that will be transformed in a `LightState`, e.g. `{on: true}`.

The function will return the instance of the `LightStateAction` so you can chain calls.

---


### GroupStateAction
A `GroupStateAction`  is a `RuleAction` that will help in constructing the `RuleAction` for setting a `GroupLightState` 
on a `Group` when a rule is triggered.
                     
It contains all the properties and functions for [`RuleAction`](#ruleaction) above.


#### Instantiation
To get an instance of a `GroupStateAction` use the function `v3.rules.actions.group(id)`

* `id`: The id for the group or a `Group` instance obtained from the bridge

The function will return an instance of a `GroupStateAction`.


#### withState(state)
The `withState(state)` function allows you to specify the state that will be applied to the `Group`.

* `state`: The [`GroupLightState`](lightState.md) to apply to the `Group`, or a JSON payload of attributes that will be transformed in a `GroupLightState`, e.g. `{on: true}`.

The function will return the instance of the `GroupStateAction` so you can chain calls.

---

### SensorStateAction
A `SensorStateAction`  is a `RuleAction` that will help in constructing the `RuleAction` for setting a `Sensor`s state
attributes when a rule is triggered.
                     
It contains all the properties and functions for [`RuleAction`](#ruleaction) above.


#### Instantiation
To get an instance of a `SensorStateAction` use the function `v3.rules.actions.sensor(id)`

* `id`: The id for the sensor or a `Sensor` instance obtained from the bridge

The function will return an instance of a `SensorStateAction`.


#### withState(state)
The `withState(state)` function allows you to specify the state that will be applied to the `Sensor`.

* `state`: A JSON payload of attributes that will be modified on the `Sensor`, e.g: `{flag: true}`

The function will return the instance of the `SensorStateAction` so you can chain calls.

---

### SceneAction
A `SceneAction` is a `RuleAction` that will help to constructo a `RuleAction` for saving a `Scene`'s state when triggered

It contains all the properties and functions for [`RuleAction`](#ruleaction) above.

#### Instantiation
To get an instance of a `SensotStateAction` use the function `v3.rules.actions.scene(id)`

* `id`: The id for the sensor or a `Scene` instance obtained from the bridge

The function will return an instance of a `SceneAction`.


#### withState(state)
The `withState(state)` function allows you to specify the state that will be applied to the `Scene`.

* `state`: A JSON payload of attributes that will be modified on the `Sensor`, e.g: `{storelightstate: true}`

The function will return the instance of the `SceneAction` so you can chain calls.


---