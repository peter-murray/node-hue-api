# ResourceLinks API

The `resourceLinks` API provides a means of interacting with the `ResourceLinks` in Hue Bridge.

A `ResourceLink` is a collection/grouping mechanism for linking various bridge resources that are interconnected. The
Hue Formulas that you add to your bridge are examples of these.

See [`ResourceLink`s](./resourceLink.md) for more details on the `ResourceLink` objects


* [getAll()](#getall)
* [getResourceLink(id)](#getresourcelink)
* [getResourceLinkByName(name)](#getresourcelinkbyname)
* [createResourceLink()](#createresourcelink)
* [updateResouceLink()](#updateresourcelink)
* [deleteResourceLink()](#deleteresourcelink)


## getAll()
The `getAll()` function allows you to get all the `ResourceLinks` that the Hue Bridge has registered with it.

```js
api.resourceLinks.getAll()
  .then(allResourceLinks => {
    // Display the ResourceLinks from the bridge
    allResourceLinks.forEach(resourceLink => {
      console.log(resourceLink.toStringDetailed());
    });
  });
```

This function call will resolve to an `Array` of `ResourceLink` objects. 

A complete code sample for this function is available [here](../examples/v3/resourceLinks/getAllResourceLinks.js).



## getResourceLink()
The `getResourceLink(id)` function allows a specific `ResourceLink` to be retrieved from the Hue Bridge.

* `id`: The `String` id of the `ResourceLink` to retrieve.


```js
api.resourceLinks.getResourceLink(62738)
  .then(resourceLink => {
    console.log(resourceLink.toStringDetailed());
  })
;
```

This function call will resolve to a `ResourceLink` object for the specified `id`.

If the `ResourceLink` cannot be found an `ApiError` will be returned with a `getHueErrorType()` value of `3`.

A complete code sample for this function is available [here](../examples/v3/resourceLinks/getResourceLink.js).


## getResourceLinkByName()
The `getResourceLinkByName(name)` function will retrieve all `ResourceLink` instances that match the provided name from the Hue Bridge.

* `name`: The `String` name of the `ResourceLink` to retrieve.


```js
api.resourceLinks.getResourceLink(62738)
  .then(resourceLink => {
    console.log(resourceLink.toStringDetailed());
  })
;
```

This function call will resolve to a `ResourceLink` object for the specified `id`.

If the `ResourceLink` cannot be found an `ApiError` will be returned with a `getHueErrorType()` value of `3`.

A complete code sample for this function is available [here](../examples/v3/resourceLinks/getResourceLink.js).




## createResourceLink()
The `createResourceLink(ResourceLink)` function allows for the creation of new `ResourceLink`s in the Hue Bridge.

* `resourceLink`: A `ResourceLink` object that has been configured with the desired settings that you want to store.

```js
const resourceLink = v3.model.createResourceLink();
resourceLink.name = 'My Resource Link';
resourceLink.description = 'A test resource link for node-hue-api';
resourceLink.recycle = true;
resourceLink.classid = 100;
resourceLink.addLink('groups', 0);

api.resourceLinks.createResourceLink(resourceLink)
  .then(resourceLink => {
    console.log(`Successfully created ResourceLink\n${resourceLink.toStringDetailed()}`);
  })
;
```

The function will resolve with a corresponding `ResourceLink` object that was created.

A complete code sample for this function is available [here](../examples/v3/resourceLinks/createAndDeleteResourceLink.js).



## updateResourceLink()
The `updateResourceLink(resourceLink)` function allows you to update an existing `ResourceLink` in the Hue Bridge.

* `resourceLink`: A `ResourceLink` object that was obtained from the API and then updated with the appropriate data changes to apply.

```js
// A resourceLink needs to be obtained from the bridge first, assume one has called "resourceLink"
resourceLink.name = 'Updated ResourceLink Name';

api.resourceLink.updateResourceLink(resourceLink);
  .then(updated => {
    console.log(`Updated ResourceLink properties: ${JSON.stringify(updated)}`);
  })
;
```

The function will resolve to an object that contains the attribute names of the `ResourceLink` that were updated set
to the success status of the change to the attribute.

_Note currently no checks are performed against the existing attributes, so all updatable attributes are sent to the bridge
when invoking this function._

For example, the result from the above example would resolve to:

```js
{
  "name": true,
  "description": true,
  "classid": true,
  "links": true
}
``` 

A complete code sample for this function is available [here](../examples/v3/resourceLinks/updateResourceLink.js).




## deleteResourceLink()
The `deleteResourceLink(id)` function will delete the specified `ResourceLink` identified by the `id` from the Hue Bridge.

* `id`: The `id` of the `ResourceLink` to delete from the Hue Bridge, or a `ResourceLink` object that was obtained from 
    the Hue Bridge

```js
api.resourceLinks.deleteResourceLink('abc170f')
  .then(result => {
    console.log(`Deleted ResourceLink? ${result}`);
  })
;
```

The call will resolve to a `Boolean` indicating the success status of the deletion.

A complete code sample for this function is available [here](../examples/v3/resourceLinks/createAndDeleteResourceLink.js).

