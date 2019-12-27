# ResourceLink

A `ResourceLink` is a grouping construct for various Hue Bridge resources that are linked to provide some level of 
interconnected functionality. This is used primarily for the Hue Formulas, but can be leveraged by API developers as an
advanced mechanism for building advanced functionality.  


* [Create a ResourceLink](#creating-a-resourcelink)
* [ResourceLink Properties and Functions](#resourcelink-properties-and-functions)


## Creating a ResourceLink

You can create a `ResourceLink` by using the `v3.model.createResourceLink()` function.

```js
const Scene = require('node-hue-api').v3.model;
const myResourceLink = model.createResourceLink();
```


## ResourceLink Properties and Functions

* [id](#id)
* [name](#name)
* [description](#description)
* [type](#type)
* [classid](#classid)
* [owner](#owner)
* [recycle](#recycle)
* [links](#links)
    * [resetLinks()](#resetlinks)
    * [addLink()](#addlink)
    * [removeLink()](#removelinks)
* [toString](#tostring)
* [toStringDetailed](#tostringdetailed)




### id
Get the `id` for the ResourceLink.
* `get`


### name
Get/Set a name for the ResourceLink.
* `get`
* `set`


### description
Get/Set a description for the ResourceLink.
* `get`
* `set`


### type
Get the type of the ResourceLink, which is always `Link` at the current time.
* `get`


### classid
Get/Set a classid for the ResourceLink. This is specific to the application and can be used to identify the purpose of
the ResourceLink.

The Hue API documentation gives the following example use case:

    The resourcelink class can be used to identify resourcelink with the same purpose, like classid 1 for wake-up, 2 for going to sleep, etc. (best practice use range 1 – 10000)

* `get`
* `set`


### owner
Gets the owner of the ResourceLink, which is only populated on ResourceLinks obtained from the Hue Bridge.
* `get`


### recycle
Get/Set the `recyle` attribute of the ResourceLink. This is used to flag scenes that can be automatically deleted by 
the bridge.

If the `recycle` state is set to `false` the Hue bridge will keep the ResourceLink until an application removes it.
* `get`
* `set`


### links
There is a property on the ResourceLink `links` that will return a copy of the existing links object defined in the 
ResourceLink.

* `get`

The object returned will have a key value of the name of the type of link (e.g. `groups`) and an Array of the ids for the 
linked items of that type. Any types of links that have no items, will not be present in the links object.

For example if we had links for lights with ids `1`, `2` and `3` and group `0` the `links` object would look like:

```json
{
  "lights": [1, 2, 3],
  "groups": [0]
}
```


#### resetLinks()
A function `resetLinks()` will clear out any existing links on the ResourceLink.
 
 
#### addLink()
The function `addLink(type, id)` allows for the adding of a link to the ResourceLink. 

* `type`: One of the supported types:
    * `lights`
    * `sensors`
    * `groups`
    * `scenes`
    * `rules`
    * `schedules`
    * `resourcelinks`
* `id`: The id of the type of object that you are adding as a link, e.g. a group id if the the `type` was a group


#### removeLink()
The function `removeLink(type, id)` allows for the removal of a specific link from the ResourceLink.

* `type`: One of the supported types:
    * `lights`
    * `sensors`
    * `groups`
    * `scenes`
    * `rules`
    * `schedules`
    * `resourcelinks`
* `id`: The id of the type of object that you are removing as a link, e.g. a group id if the the `type` was a group



### toString()
The `toString()` function will obtain a simple `String` representation of the Scene.


### toStringDetailed()
The `toStringDetailed()` function will obtain a more detailed representation of the Scene object.