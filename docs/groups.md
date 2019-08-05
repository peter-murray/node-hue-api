# Groups API

The `groups` API provides a means of interacting with groups in the Hue Bridge.

* [getAll()](#getall)
* [get()](#get)
* [getByName()](#getbyname)
* [Get Groups by type](#get-groups-by-type)   
* [createGroup()](#creategroup)
* [createRoom()](#createroom)
* [createZone()](#createzone)
* [updateAttributes()](#updateattributes)
* [deleteGroup()](#deletegroup)
* [getGroupState()](#getgroupstate)
* [setGroupState()](#setgroupstate)



## getAll()
The `getAll()` function allows you to get all the groups that the Hue Bridge has defined.

```js
api.groups.getAll()
  .then(allGroups => {
    // Display the groups from the bridge
    console.log(JSON.stringify(allGroups, null, 2));
  });
```

This function call will resolve to an `Array` of `Group` objects. 

A complete code sample for this function is available [here](../examples/v3/groups/getAllGroups.js).



## get()
The `get(id)` function will allow to to get the group specified by the `id` value.

* `id`: The integer `id` of the group you wish to retrieve.

```js
api.groups.get(1)
  .then(group => {
    console.log(group.toStringDetailed());
  })
;
```

The call will resolve to a `Group` instance for the specified `id`.

A complete code sample for this function is available [here](../examples/v3/groups/getGroup.js).



## getByName()
The `getByName(name)` function will retrieve the group(s) from the Hue Bridge that have the specified `name`. Group names
are not guaranteed to be unique in the Hue Bridge.

```js
api.groups.getByName('myGroup')
  .then(matchedGroups => {
    // Display the groups from the bridge
    console.log(JSON.stringify(matchedGroups, null, 2));
  });
```

The call will resolve to an `Array` of `Group` objects that have the matching `name`.

A complete code sample for this function is available [here](../examples/v3/groups/getGroupByName.js).



## Get Groups by Type

You can retrieve a specific `type` of `Group` from the Hue Bridge using the following functions:

* `getLightGroups()` 
* `getLuminaires()` 
* `getLightSources()` 
* `getRooms()` 
* `getZones()` 
* `getEntertainment()` 

For example to get all the `zone` Groups from the Hue Bridge: 
```js
api.groups.getZones()
  .then(zones => {
    // Do something with the zone groups.
    console.log(`There are ${zones.length} defined zones in the bridge`); 
  })
;
```

All these functions will resolve to an `Array` of `Group` object that match the `type` that was desired; e.g. a Zone Groups if you call `getZones()`.

A complete code samples for these functions is available [here](../examples/v3/groups/getGroupByType.js).



## createGroup()
The `createGroup(name, lights)` function allows you to create a `Group` in the Hue Bridge. This will create a `LightGroup` type group.

* `name`: The name of the group to be created
* `lights`: The `Array` of light `id`s that will be associated with the Group.

```js
api.groups.createGroup('myNewGroup', [1, 2])
  .then(createdGroup => {
    console.log(`Created new group with id:${createdGroup.id}`);
  })
;
```

The call will resolve to an `Group` object that was created.

A complete code sample for this function is available [here](../examples/v3/groups/createLightGroup.js).



## createRoom()
The `createRoom(name, lights, roomClass)` function allows you to create a `Group` in the Hue Bridge. This will create a `LightGroup` type group.

* `name`: The name of the group to be created
* `lights`: The `Array` of light `id`s that will be associated with the Room. A Light can only exist in a single room. 
    You can pass an empty Array of lights and associate the lights later, or not specify this value at all if you are not providing a `roomClass`.
* `roomClass`: The room class, a `String` value for the class of room, see [here](./group.md#class) for available values. 
    This is optional, if not specified will default to `Other` class.

```js
api.groups.createGroup('New Gym Room', [1, 2], 'Gym')
  .then(createdRoom => {
    console.log(`Created new room with id:${createdRoom.id}`);
  })
;
```

The call will resolve to an `Group` object that was created.

A complete code sample for this function is available [here](../examples/v3/groups/createRoom.js).



## createZone()
The `createRoom(name, lights, roomClass)` function allows you to create a `Group` in the Hue Bridge. This will create a `LightGroup` type group.

* `name`: The name of the group to be created
* `lights`: Optional `Array` of light `id`s that will be associated with the Zone.
* `roomClass`: Optional room class, a `String` value for the class of zone, see [here](./group.md#class) for available values

```js
api.groups.createGroup('New Gym Room', [1, 2], 'Gym')
  .then(createdRoom => {
    console.log(`Created new room with id:${createdRoom.id}`);
  })
;
```

The call will resolve to an `Group` object that was created.

A complete code sample for this function is available [here](../examples/v3/groups/createZone.js).



## updateAttributes()
The `updateAttributes(id, data)` function allows you to update the attributes of an existing group. The attributes that
can be modified are `name`, `lights` and/or `room class`.

* `id`: The `id` of the group to be updated
* `data`: An object with optional keys of `name`, `lights` and/or `class`. All of these are optional, but at least one must be specified.

```js
api.groups.updateAttributes(id, {name: 'my_new_group_name'})
  .then(result => {
    console.log(`Updated attributes: ${result}`)
  })
;
```

The call will resolve to a `Boolean` indicating the success status of the update to the specified attributes.

A complete code sample for this function is available [here](../examples/v3/groups/updateAttributes.js).



## deleteGroup()
The `deleteGroup(id)` function allow you to delete a group from the Hue Bridge.

* `id`: The integer `id` of the group to delete.

```js
api.groups.deleteGroup(id)
  .then(result => {
    console.log(`Deleted group? ${result}`);
  })
;
```

The call will resolve to a `Boolean` indicating the success status of the deletion.

A complete code sample for this function is available [here](../examples/v3/groups/deleteGroup.js).



## getGroupState()
The `getGroupState(id)` function allows you to get the current state that has been applied to the `Group`.

* `id`: The id of the group to get the state for

```js
api.groups.getGroupState(id)
  .then(state => {
    // Display the current state
    console.log(JSON.stringify(state, null, 2));
  })
;
```

The call will resolve to an `Object` that contains the current state values for the `Group`



## setGroupState()
The `setGroupState(id, state)` function allows you to set a state on the lights in the specified `Group`.

* `id`: The id of the group to modify the state on
* `state`: A `GroupLightState` for the group to be applied to the lights in the group. This can be an Object with explicit 
    key values or a `GroupLightState` Object. 


Using an Object for the state, which must conform to the various state attributes that can be set for a `Group`:
```js
api.groups.setGroupState(groupId, {on: true})
  .then(result => {
    console.log(`Updated Group State: ${result}`);
  })
;
```


Using a [`GroupLightState`](lightState.md#grouplightstate) Object:
```js
const GroupLightState = require('node-hue-api').v3.lightStates.GroupLightState;
const groupState = new GroupLightState().on();

api.groups.setGroupState(groupId, groupState)
  .then(result => {
    console.log(`Updated Group State: ${result}`);
  })
;
```


The call will resolve to a `Boolean` indicating success state of setting the desired group light state.

A complete code sample for this function is available [here](../examples/v3/groups/setGroupLightState.js).