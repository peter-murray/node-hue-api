# Users API

The `users` API provides a means of interacting with the Hue Bridge user accounts.

* [User Names](#user-names)
* [createUser(appName, deviceName)](#createuser)
* [deleteUser(username)](#deleteuser)
* [getAll()](#getAll)
* [get(username)](#get)
* [getByName(appName, deviceName)](#getbyname)


## User Names
The names of user accounts that are created in the bridge consist of two variations:

* Single string value `0..40 charcters` 
* Application Name and Device Name combination format `<applicaiton_name>#<device_name>`
   * `application_name`:  `0..20 characters`
   * `device_name`: `0..19 characters` 

The bridge APIs now encourage the use of the latter format and this is the primary format that this API will encourage
on the creation of new accounts.



## createUser
The `createUser(appName, deviceName)` function allows for the creation of new users on the Hue Bridge.

This function can be invoked without previously authenticating with another user account on the Bridge, but for it to 
succeed, it requires the user to press the Link Button on the Bridge, otherwise it will generate an `ApiError` with a 
type of `101`.

Once the user presses the Link Button on the bridge, you have roughly 30 seconds to execute this call to create a new 
user.

The parameters for the function are:

* `appName`: The application name for the user that is being created, e.g. `node-hue-api`. This has to be a string between 0 and 20 characters
* `devciceName`:  The device name for the user that is being created, e.g. `mac-mini`, This has to be a string between 0 and 19 characters

```js
api.users.createUser('node-hue-api', 'my-device-or-app')
  .then(usernameAndKey => {
    console.log(`Created User: ${usernameAndKey.username}`);
    console.log(`PSK for Entertainment API : ${usernameAndKey.clientkey}`);
  })
  .catch(err => {
    if (err.getHueErrorType() === 101) {
      console.error(`The Link Button on the bridge was not pressed. Please press the link button and then re-run.`);
    } else {
      // Unexpected error
      console.error(err);
    }
  })
;
```

If successful, this function will resolve to an `Object` for the created user with the following properties:

* `username`: The `username` to use for authenticating against the bridge
* `clientkey`: PSK Identity that can be used with the Streaming Entertainment API
 
_Note that this is sensitive data, this is effectively a password for accessing the bridge, so be sensible about where you store this._

A complete code sample for creating a user is available [here](../examples/v3/users/createUser.js).



## deleteUser
The `deleteUser(username)` function allows you to remove an existing user from the bridge.

Note currently as of 28/07/2019 (bridge API version 1.33.0) there are some issues in the Bridge with respect to permissions on the removal of users
that prevents the removal of user accounts.



## getAll
The `getAll()` function will return all the whitelisted users from the Hue bridge.

The result will always be an `Array` or user objects that are in the Bridge Whitelist which will consist of `Object`s 
with the properties returned in the bridge configuration which as of bridge API version `1.20` is:

* `username`: The username that is used to authenticate the user account against the Bridge
* `name`: The name that was used to create the user account, either a human readable `String` or of the format `<application_name>#<device_name>`
* `create date`: The date of the creation of the user
* `last use date`: The date that the user account was last used 
 

```js
api.users.getAll()
  .then(allUsers => {
    // Do something with the users array
    console.log(JSON.stringify(allUsers, null, 2));
  })
;
```

A complete code sample for creating a user is available [here](../examples/v3/users/getAllUsers.js).



## get
The `get(username)` function will return the details for the user account stored in the bridge.

If the username is found in the bridge, the result will be an object that has the following properties:

* `username`: The username that is used to authenticate the user account against the Bridge
* `name`: The name that was used to create the user account, either a human readable `String` or of the format `<application_name>#<device_name>`
* `create date`: The date of the creation of the user
* `last use date`: The date that the user account was last used

```js
api.users.get('username_value')
  .then(allUsers => {
    // Do something with the users array
    console.log(JSON.stringify(allUsers, null, 2));
  })
;
```

A complete code sample for creating a user is available [here](../examples/v3/users/getUser.js).



## getByName
The `getByName(appName, deviceName)` or `getByName(name)` function allowss you to find the user accounts that use the
specified `name` or `appName` and `deviceName` combination

The result will always be an `Array` or user objects that are in the Bridge Whitelist which will consist of `Object`s 
with the properties returned in the bridge configuration which as of bridge API version `1.20` is:

* `username`: The username that is used to authenticate the user account against the Bridge
* `name`: The name that was used to create the user account, either a human readable `String` or of the format `<application_name>#<device_name>`
* `create date`: The date of the creation of the user
* `last use date`: The date that the user account was last used 

```js
api.users.get('username_value')
  .then(allUsers => {
    // Do something with the users array
    console.log(JSON.stringify(allUsers, null, 2));
  })
;
```

A complete code sample for creating a user is available [here](../examples/v3/users/getUserByName.js).