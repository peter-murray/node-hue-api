# Scene

The Hue Bridge can support two variations of a Scene, `LightScene`  and `GroupScene`.

A Scene is represented as an `id` a `name` and a list of `Lights` stored inside the Hue Bridge. These are separate from
what a scene is in the iOS and Android applications.

* [Common Scene Properties](#common-scene-properties-and-functions)
* [LightScene](#lightscene)
    * [Creating a LightScene](#creating-a-lightscene)
    * [Properties](#lightscene-properties)
        * [lights](#lights)
        * [lightstates](#lightstates)
* [GroupScene](#groupscene)
    * [Creating a GroupScene](#creating-a-groupscene)
    * [Properties](#groupscene-properties)
        * [group](#group-1)
        * [lights](#lights-1)
        * [lightstates](#lightstates-1)


## Common Scene Properties and Functions
Depending upon the properties that you chose to set on the `Scene` the `type` attribute will be implicitly set for you 
by the API. This `type` dictates what attributes are modifiable in the Hue Bridge.

* [id](#id)
* [name](#name)
* [type](#type)
* [owner](#owner)
* [recycle](#recycle)
* [locked](#locked)
* [appdata](#appdata)
* [picture](#picture)
* [lastupdated](#lastupdated)
* [version](#version)
* [toString()](#tostring)
* [toStringDetailed()](#tostringdetailed)


### id
Get the `id` for the Scene.
* `get`

### name
Get/Set a name for the Scene.
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
Get/Set the `recyle` attribute of the Scene. This is used to flag scenes that can be automatically deleted by the bridge.
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


### toString()
The `toString()` function will obtain a simple `String` representation of the Scene.


### toStringDetailed()
The `toStringDetailed()` function will obtain a more detailed representation of the Scene object.



# LightScene
This is the `default` type of `Scene` in the Hue Bridge. It maintains a list of lights that the are associated with the 
Scene, which can be updated.

## Creating a LightScene
You can create a new LightScene object using the `v3.model.createLightScene()` function.


## LightScene Properties
The following are the LightScene specific properties above those already defined in the [Common Scene Properties and functions](#common-scene-properties-and-functions).

### lights
The associated light ids for the `LightScene`.
 
* `get`: Obtains the Array of light ids
* `set`: Set the Array of light ids associated with the LightScene

### lightstates
Gets/Sets the desired LightState for the lights in the scene. This is primarily used to provide some backwards 
compatibility in the API with v2, not for normal user usage.
* `get`
* `set`

_Note: lightStates are only present on scenes that have explicitly been retrieved from the Hue Bridge, that is, scenes
that you have obtained from the `v3.api.scenes.get(id)` API call._




# GroupScene
A `GroupScene` is a `Scene` with a `type` of `GroupScene`. These scenes are linked to an specified Group in the Hue Bridge.

The associated lights for the `GroupScene` is controlled via the `Group`. When the `Group` becomes empty or is removed
from the Bridge, the associated `GroupScene`s are also removed. 

The lights for a GroupScene are not modifiable as they belong to the `Group` object.


## Creating a GroupScene
You can create a new GroupScene object using the `v3.model.createGroupScene()` function.


## GroupScene Properties
The following are the LightScene specific properties above those already defined in the [Common Scene Properties and functions](#common-scene-properties-and-functions).

### group
The group ID for the GroupScene if associated with a group.
* `get`
* `set`

### lights
The associated light ids for the `GroupScene`. This is controlled via the membership of the lights in the `Group` that 
the GroupScene is associated with.
 
* `get`: Obtains the Array of light ids in the target Group

### lightstates
Gets the LightStates for the lights in the GroupScene. This is primarily used to provide some backwards 
compatibility in the API with v2, not for normal user usage.
* `get`

_Note: lightStates are only present on scenes that have explicitly been retrieved from the Hue Bridge, that is, scenes
that you have obtained from the `v3.api.scenes.get(id)` API call._
