# Group

A `Group` is a representation of a grouping construct in the Hue Bridge, of which there are a number of specializations
including serrving different purposes:

* [`LightGroup`](#lightgroup): The default type of Group which collects lights and sensors
* [`Luminaire`](#luminaire): A special type of group representing a Luminaire, the bridge will create these for these devices if you have any 
* [`Room`](#room): A Room that collects a number of lights and sensors togehter (a light and sensor can only belong to a single `Room`)
* [`Entertainment`](#entertainment): A new special type of Group used for an Entertainment area for streaming (syncing light changes
    to a visualization via a seperate streaming API). Not all lights can be added to an Entertainment Group.
* [`Zone`](#zone): A group that allows you to define a Zone that might be within a room, or extend across a number of rooms.
    This allows you to work around the `Room` limitations of lights and sensors only being able to belong to on Room. 

You cannot create these Object directly, but can either retrieve them from the Hue Bridge via the [Groups API](./groups.md)
or create a new instance of them using the `v3.model` functions:

* `v3.model.createLightGroup()`
* `v3.model.createRoom()`
* `v3.model.createZone()`
* `v3.model.createEntertainment()`


* [Common Group Properties and Functions](#common-group-properties-and-functions)
    * [id](#id)
    * [name](#name)
    * [lights](#lights)
    * [type](#type)
    * [action](#action)
    * [recycle](#recycle)
    * [sensors](#sensors)
    * [state](#state)
    * [toString()](#tostring)
    * [toStringDetailed()](#tostringdetailed)
* [LightGroup](#lightgroup)
* [Room](#room)
    * [class](#class)
* [Zone](#zone)
    * [class](#class
* [Entertainment](#entertainment)
    * [class](#class)
    * [locations](#locations)
    * [stream](#stream)



## Common Group Properties and Functions

The properties and functions available for all `Group`s are:

## id
The id for the group.

* `get`


## name
The name for the group.

* `get`
* `set`


## lights
An array of light `id`s that are in the group

* `get`


## type
The type of group that this `Group` instance represents.

* `get`

The type can be one of the following values:

* `Lunimarie`: Multisource Luminaire group
* `Lighsource`: Multisource Luminaire group
* `LightGroup`: A group of lights that can be controlled together
    * A light group is deleted by the bridge if you remove all the lights from it
* `Room` 
* `Entertainment`
* `Zone`


## action
The Light state of one of the lamps in the group.

* `get`


## recycle
A flag indicating if the bridge can automatically remove the group.

* `get` 


## sensors
An `Array` of sensor `id`s that are associated with the group, which cna be empty. 

* `get`


## state
A state representation of the group. Which can contain details like `all_on` or `any_on` which indicate if all or any of 
the light members are currently on.

`get`


### toString()
The `toString()` function will obtain a simple `String` representation of the Scene.


###toStringDetailed()
The `toStringDetailed()` function will obtain a more detailed representation of the Scene object.



## LightGroup

The standard LightGroup has all the properties and functions defined in the [common group properties](#common-group-properties-and-functions).


## Room
A group of lights that are physically located in the same place in a house. These behave like a standard group, but have a couple of differences:

* A room can be empty and contain no lights
* A light is only allowed in a single room
* A room is not automatically deleted when all the lights are removed

The `Room` Group has all the properties and functions as defined in the [common group properties](#common-group-properties-and-functions) 
as well as the following:

## class
The `class` represents the `Zone` category as a `String`.

* `get`
* `set`

The values that can be set for this on a `Room` are:

-------------- | -------------- | ----------
`Living room`  | `Kitchen`      | `Dining`   
`Bedroom`      | `Kids bedroom` | `Bathroom` 
`Nursery`      | `Recreation`   | `Office`   
`Gym`          | `Hallway`      | `Toilet`   
`Front door`   | `Garage`       | `Terrace`  
`Garden`       | `Driveway`     | `Carport`  
`Other`        |                |           

Since version 1.30 of the Hue Bridge API the following values can also be used:

--------------  | -------------     | ----------
`Home`          | `Downstairs`      | `Upstairs`
`Top floor`     | `Attic`           | `Guest room`
`Staircase`     | `Lounge`          | `Man cave`
`Computer`      | `Studio`          | `Music`
`TV`            | `Reading`         | `Closet`
`Storage`       | `Laundry room`    | `Balcony`
`Porch`         | `Barbecue`        | `Pool`


## Zone
A group of lights that can be controlled together.

* A zone can be empty and contain no lights
* A light is allowed to be in multiple zones (as opposed to only being able to belong to a single room)

The `Zone` Group has all the properties and functions as defined in the [common group properties](#common-group-properties-and-functions) 
as well as the following:

## class
The `class` represents the `Zone` category as a `String`.

* `get`
* `set`

The values that can be set for this on a `Room` are:

-------------- | -------------- | ----------
`Living room`  | `Kitchen`      | `Dining`   
`Bedroom`      | `Kids bedroom` | `Bathroom` 
`Nursery`      | `Recreation`   | `Office`   
`Gym`          | `Hallway`      | `Toilet`   
`Front door`   | `Garage`       | `Terrace`  
`Garden`       | `Driveway`     | `Carport`  
`Other`        |                |           

Since version 1.30 of the Hue Bridge API the following values can also be used:

--------------  | -------------     | ----------
`Home`          | `Downstairs`      | `Upstairs`
`Top floor`     | `Attic`           | `Guest room`
`Staircase`     | `Lounge`          | `Man cave`
`Computer`      | `Studio`          | `Music`
`TV`            | `Reading`         | `Closet`
`Storage`       | `Laundry room`    | `Balcony`
`Porch`         | `Barbecue`        | `Pool`



## Entertainment
Represents an entertainment set up, which is a group of lights used to define targets for streaming along with defining position of the lights.

The Entertainment Group has all the properties and functions as defined in the [common group properties](#common-group-properties-and-functions) 
as well as the following:

* [class](#class)
* [locations](#locations)
* [stream](#stream)

## class
The `class` represents the `Entertainment` category as a `String`.

* `get`

The values that can be set for this on a are:

* `TV`
* `Other`


## locations
The locations of the lights in an `Entertainment` type Group which is an Object that maps the `id` of the light to an
`Array` consisting of three integers inidicating the position in 3D space from the source.

`get`


## stream
The stream details object for an `Entertainment` type Group.

`get`

The stream object consists of the following keys and values:

* `proxymode`: A string indicating the proxy mode
* `proxynode`: A string which is an address string to a light in the bridge, e.g. `/lights/22`
* `active`: A Boolean indicating whether or not the Entertainment is currently streaming
* `owner`: If the Entertainment is currently streaming, this is the user id of the owner of the stream.

