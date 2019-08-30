# Scene

The Hue Bridge can support two variations of a Scene, `LightScene`  and `GroupScene`.

A Scene is represented as an `id` a `name` and a list of `Lights` stored inside the Hue Bridge. These are separate from
what a scene is in the iOS and Android applications.

* [LightScene](#lightscene)
* [GroupScene](#groupscene)
* [LightStateScene](#lightstatescene)

* [Create a Scene](#creating-a-scene)
* [Scene Properties](#scene-properties)


## LightScene
This is the `default` type of `Scene` in the Hue Bridge. It maintains a list of lights that the are associated with the 
Scene, which can be updated.


## GroupScene
A `GroupScene` is a `Scene` with a `type` of `GroupScene`. These scenes are linked to an specified Group in the Hue Bridge.

The associated lights for the `GroupScene` is controlled via the `Group`. When the `Group` becomes empty or is removed
from the Bridge, the associated `GroupScene`s are also removed. 

The lights for a GroupScene are not modifiable.


## LightStateScene
A `LightStateScene` is a Scene that explictly sets the light states for each of the lights that makes up the Scene.


## Creating a Scene

You can create a `Scene` by using the `new` operator.

```js
const Scene = require('node-hue-api').v3.Scene;
const myScene = new Scene();
```


## Scene Properties
Depending upon the properties that you chose to set on the `Scene` the `type` attribute will be implicitly set for you 
by the API. This `type` dictates what attributes are modifiable in the Hue Bridge.

* [name](#name)
* [id](#id)
* [group](#group)
* [lights](#lights)
* [lightstates](#lightstates)
* [type](#type)
* [owner](#owner)
* [recycle](#recycle)
* [lockec](#locked)
* [appdata](#appdata)
* [picture](#picture)
* [lastupdated](#lastupdated)
* [version](#version)
* [payload](#payload)

### name
Get/Set a name for the Scene.
* `get`
* `set`

### id
Get the `id` for the Scene.
* `get`

### group
The group ID for the Scene if associated with a group. If you set this, the `type` will be set to `GroupScene` implicitly.
* `get`
* `set`

### lights
The associated light ids for the Scene. If this is a `GroupScene` these are popualte by the Hue Bridge and are read only.
If you invoke `set` on this property then the `type` will be implicitly set to `LightScene`. 
* `get`
* `set`

### lightstates
Gets/Sets the desired LightState for the lights in the scene. This is primiarily used to provide some backwards 
compatibility in the API with v2, not for normal user usage.
* `get`
* `set`

### type
Get/Set the type of the scene, which is one of `GroupScene` or `LightScene`. Users should not need to set this value, 
instead using the `set` on the `group` or `lights` properties instead.
* `get`
* `set`

### owner
Gets the owner of the Scene.
* `get`

### recycle
Get/Set the `recyle` attribute of the Scene. This is used to flag scenes that can be automatically deleted byt the bridge.
If the `recycle` state is set to `false` the Hue bridge will keep the scene until an application removes it.
* `get`
* `set`

### locked
Gets the locked state of the Scene. A locked scene means that the scene is in use by the `rule` or `schedule`. 
* `get`

### appdata
Get/Set the associated application data for the scene. This is an `Object` payload that the application is responsible for
any format/encoding/meaning of this data.

* `get`
* `set`

When setting this value, you need to create an `Object` with tow keys:

* `version`: A version for specifying the version on the data object that you are storing.
* `data`: Any data that you wish to store specific to your application, this can be between `0` and `16` characters.

For example we could store the `location` and `application_name` in the `appdata` using a payload of the form:

```js
{
  version: 1,
  data: 'my-custom-app-data'
}
```
 

### picture
Get/Set the picture data for the scene. The Hue Bridge does not support setting this via a PUT call which means it is 
not possible to update this data field, only at the time of creation.
* `get`
* `set`

### lastupdated
Gets the last updated time for the Scene.
* `get`

### version
Gets the version of the Scene
* `get`

### payload
Obtains the JSON payload that can be used to create/update the Scene on the Hue Bridge. 
* `get`


### toString()
The `toString()` function will obtain a simple `String` representation of the Scene.


### toStringDetailed()
The `toStringDetailed()` function will obtain a more detailed representation of the Scene object.