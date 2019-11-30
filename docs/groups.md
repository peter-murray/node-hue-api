# Groups API

The `groups` API provides a means of interacting with groups in the Hue Bridge.

* [getAll()](#getall)
* [getGroup()](#getgroup)
* [getGroupByName()](#getgroupbyname)
* [get by type](#get-by-type)   
* [createGroup()](#creategroup)
* [updateGroupAttributes()](#updategroupattributes)
* [deleteGroup()](#deletegroup)
* [getGroupState()](#getgroupstate)
* [setGroupState()](#setgroupstate)
  * [Activating a Scene](#activating-a-scene)



## getAll()
The `getAll()` function allows you to get all the groups that the Hue Bridge has defined.

```js
api.groups.getAll()
  .then(allGroups => {
    // Display the groups from the bridge
    allGroups.forEach(group => {
      console.log(group.toStringDetailed());
    });
  });
```

This function call will resolve to an `Array` of `Group` instance objects (LightGroup, Zone, Room, Entertainment and Luminaire, 
see [Group Objects](./group.md) for more details). 

A complete code sample for this function is available [here](../examples/v3/groups/getAllGroups.js).



## getGroup()
The `getGroup(id)` function will allow to to get the group specified by the `id` value.

* `id`: The integer `id` of the group you wish to retrieve, or a `Group` object that you want a refreshed copy of.

```js
api.groups.getGroup(1)
  .then(group => {
    console.log(group.toStringDetailed());
  })
;
```

The call will resolve to a [`Group Object`](./group.md) instance for the specified `id`.

A complete code sample for this function is available [here](../examples/v3/groups/getGroup.js).



## getGroupByName()
The `getGroupByName(name)` function will retrieve the group(s) from the Hue Bridge that have the specified `name`. Group names
are not guaranteed to be unique in the Hue Bridge.

```js
api.groups.getGroupByName('myGroup')
  .then(matchedGroups => {
    // Display the groups from the bridge
    matchedGroups.forEach(group => {
      console.log(group.toStringDetailed());
    });
  });
```

The call will resolve to an `Array` of `Group Objects`](./group.md) that have a matching `name`.

A complete code sample for this function is available [here](../examples/v3/groups/getGroupByName.js).



## get by type

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

All these functions will resolve to an `Array` of matching [Group Objects](./group.md) that matches the `type` that was requested; e.g. a Zones if you call `getZones()`.

A complete code samples for these functions is available [here](../examples/v3/groups/getGroupByType.js).



## createGroup()
The `createGroup(group)` function allows you to create an instance of a specific [`Group Object`](./group.md) in the Hue Bridge.

* `group`: The Group object that has been built that you wish to create, e.g. a LightGroup populated with a name and light ids

```js
const group = v3.model.createLightGroup();
group.name = 'my new group';
group.lights = [2, 3];

api.groups.createGroup(group)
  .then(createdGroup => {
    console.log(`Created new group:\n${createdGroup.toStringDetailed()});
  })
;
```

The call will resolve to a [`Group Object`](./group.md) that was created using the provided details.

Complete code samples creating various types of Groups are available:
* [LightGroup](../examples/v3/groups/createLightGroup.js)
* [Room](../examples/v3/groups/createRoom.js)
* [Zone](../examples/v3/groups/createZone.js)
* [Entertainment](../examples/v3/groups/createEntertainment.js)



## updateGroupAttributes()
The `updateGroupAttributes(group)` function allows you to update the attributes of an existing group. The attributes that
can be modified are:

     * `name`
     * `lights`
     * `sensors`
     * `class`: The class for the Room/Zone or Entertainment Group

* `group`: The Group that has been modified with the updates you want to apply to the Bridge Group.

```js
const group; // Obtained from some other call to retrieve this reference to a Group object from the bridge
// Update the name 
group.name = 'Updated Group Name';

api.groups.updateGroupAttributes(group)
  .then(result => {
    console.log(`Updated attributes: ${result}`)
  })
;
```

The call will resolve to a `Boolean` indicating the success status of the update to the specified attributes.

A complete code sample for this function is available [here](../examples/v3/groups/updateGroupAttributes.js).



## deleteGroup()
The `deleteGroup(id)` function allow you to delete a group from the Hue Bridge.

* `id`: The integer `id` of the group to delete, or a `Group Object` that you wish to remove

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

* `id`: The id of the group to get the state for, or Group Object.

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

* `id`: The id of the group to modify the state on, or a `Group Object`.
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
const GroupLightState = require('node-hue-api').v3.model.lightStates.GroupLightState;
const groupState = new GroupLightState().on();

api.groups.setGroupState(groupId, groupState)
  .then(result => {
    console.log(`Updated Group State: ${result}`);
  })
;
```

The call will resolve to a `Boolean` indicating success state of setting the desired group light state.

A complete code sample for this function is available [here](../examples/v3/groups/setGroupLightState.js).


### Activating a Scene
The `setGroupState(id, state)` function (as detailed above) is the function that needs to be used to activate/recall an
existing `Scene` that is stored in the Hue Bridge / Lights.

The lights that are affected by the Scene activation is the intersection of the members of the `Group` and the lights 
that were `Scene` associated with it.

This means you can potentially target a single room/zone when recalling a Scene that might straddle multiple rooms or zones 
by limiting the target `Group` when recalling the Scene.

So to ensure that you target all the lights that you associated with a `Scene`, when activating it, you would need to 
utilize the special `All Lights Group` which has an id of `0`.

Example for recalling a Scene using the `All Lights Group`, that is all lights saved in the scene will be activated:
```js
const GroupLightState = require('node-hue-api').v3.lightStates.GroupLightState;
const mySceneLightState = new GroupLightState().scene('my-scene-id');

api.groups.setGroupState(0, mySceneLightState)
  .then(result => {
    console.log(`Activated Scene? ${result}`);
  })
;
```

_Note: There is a convenience function on the Scenes API [activateScene(id)](./scenes.md#activatescene) that is a 
wrapper around the `setGroupState()` API call targeting the `All Lights Group`._


