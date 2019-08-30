# Group

A `Group` is a representation of a group in the Hue Bridge. You cannot create a `Group` object directly, these will
be returned from API calls that provide groups as results, like [api.groups.getAll()](./groups.md#getall).

The properties and functions available for a Group are:

* [name](#name)
* [id](#id)
* [lights](#lights)
* [type](#type)
* [action](#action)
* [recycle](#recycle)
* [sensors](#sensors)
* [state](#state)
* [class](#class)
* [locations](#locations)
* [stream](#stream)
* [modelid](#modelid)
* [uniqueid](#uniqueid)
* [toString()](#tostring)
* [toStringDetailed()](#tostringdetailed)


## name
The name for the group.

* `get`
* `set`


## id
The id for the group.

* `get`


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
* `Room`: A group of lights that are physically located in the smae place in a house. These behave like a standard group, but have a couple of differences
    * A room can be empry and contain no lights
    * A light is only allowed in a single room
    * A room is not automatically deleted when all the lights are removed
* `Entertainment`: Represents an entertainment set up, which is a group of lights used to define targets for streaming along with defining position of the lights
* `Zone`: A group of lights that can be controlled together
    * A zone can be empty and contain no lights
    * A light is allowed to be in multiple zones (as opposed to only being able to belong to a single room)


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


## class
The `class` represents the `Room` category as a `String`.

* `get`

The values that can be set for this on a `Room` are:

* `Living room`
* `Kitchen`
* `Dining`
* `Bedroom`
* `Kids bedroom`
* `Bathroom`
* `Nursery`
* `Recreation`
* `Office`
* `Gym`
* `Hallway`
* `Toilet`
* `Front door`
* `Garage`
* `Terrace`
* `Garden`
* `Driveway`
* `Carport`
* `Other`

Since version 1.30 of the Hue Bridge API the following values can also be present:

* `Home`
* `Downstairs`
* `Upstairs`
* `Top floor`
* `Attic`
* `Guest room`
* `Staircase`
* `Lounge`
* `Man cave`
* `Computer`
* `Studio`
* `Music`
* `TV`
* `Reading`
* `Closet`
* `Storage`
* `Laundry room`
* `Balcony`
* `Porch`
* `Barbecue`
* `Pool`


## locations
The locations of the lights in an `Entertainment` type Group which is an Object that maps the `id` of the light to an
`Array` consisting of three integers.

`get`


## stream
THe stream details for an `Entertainment` type Group.

`get`


## modelid
A unique model id that identifies the hardware model of the luminaire, only present if the group is a Lunminaire device.

* `get`


## uniqueid
The unique id on `AA:BB:CC:DD` format for Lunimarie groups or `AA:BB:CC:DD-XX` format for Lightsource groups (XX is the lightsource position).

* `get`


### toString()
The `toString()` function will obtain a simple `String` representation of the Scene.


###toStringDetailed()
The `toStringDetailed()` function will obtain a more detailed representation of the Scene object.