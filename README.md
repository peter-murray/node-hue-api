# Node Hue API

An API for NodeJS that interacts with the Philips Hue Bridge to control Philips Hue Light Bulbs and
Philips Living Color Lamps.

This API abstracts away the actual Philips Hue Bridge REST API, that is as yet, not finalized.

There are a number of resources where users have detailed documentation on the Philips Hue Bridge;
 - Unofficial Hue Documentation: <http://burgestrand.github.com/hue-api/>
 - Hack the Hue: <http://rsmck.co.uk/hue>
 - Hue Hackers Mailing List: <https://groups.google.com/forum/#!forum/hue-hackers>

## Installation

NodeJS application using npm:
```
$ npm install node-hue-api
```

## Examples

### Locating a Philips Hue Bridge
To locate all the Philips Hue Bridges on your network (if you do not know the IP Address already);

```js
var hue = require("node-hue-api").hue;

var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

hue.locateBridges().then(displayBridges).done();
```

### Registering a new Device/User with the Bridge
Once you have discovered the IP Address for your bridge (either from the locate function, or looking it up on the Philips Hue website), then you will need to register your application with the Hue Bridge.

Registration requires you to issue a request to the Bridge after pressing the Link Button on the Bridge.

Ths library offer two functions to register new devices/users with the Hue Bridge. These are detailed below.

###Registering without an existing Device/User ID
This method is useful for creating a new user when you have only just discovered your Hue Bridge and do not know the existing device/user IDs.

```js
var hue = require("node-hue-api").hue;

var hostname = "192.168.2.129",
	newUserName = "a username",
	userDescription = "device description goes here";

hue.registerUser(hostname, newUserName, userDescription)
	.then(displayResultFunction)
	.fail(displayErrorFunction)
	.done();
```

### Registering a New Device/User ID within the API
If you want to perform a lookup to ensure that a device/user does not already exist before registering a new device/user, then you can use the registerUser() function when connected to the Hue Bridge as an already approved user.

```js
var hue = require("node-hue-api").hue;

var hostname = "192.168.2.129",
	username = "033a6feb77750dc770ec4a4487a9e8db",
	newUserName = "a new username",
	userDescription = "device description goes here",
	api;

api = new hue.HueApi(hostname, username);
api.registerUser(newUserName, userDescription)
	.then(displayResultFunction)
	.fail(displayErrorFunction)
	.done();
```

### Registration Output/Error
When using either of the above registration methods you will get either a hash of the username provided which will be the API username to use, or an error that will likely be due to not pressing the link button on the Bridge.

If the link button was NOT pressed on the bridge, then you will get an APIError thrown, which will be captured by the displayError function in the above examples.
```
Api Error: link button not pressed
```

If the link button was pressed you should get a response that will provide you with a hash to use as the username for connecting with the Hue Bridge, e.g.
```
033a6feb77750dc770ec4a4487a9e8db
```
The value returned will be an MD5 hash of the username value passed into the registration function.


### Validating a Connection to a Philips Hue Bridge
To connect to a Philips Hue Bridge and obtain some basic details about it you can use the connect() function. This function can be used to validate that the host and username is correct before attempting to issue other commands to the Bridge.

```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var hostname = "192.168.2.129",
    username = "083b2f780c78555d532b78544f135798",
    api;

api = new hue.HueApi(hostname, username);
api.connect().then(displayResult).done();
```

Running the above code should give you a result similar to;
```
{
  "name": "Philips hue",
  "version": "01003542",
  "linkButton": false,
  "macAddress": "00:xx:xx:xx:xx:xx",
  "host": "192.168.2.129"
}
```


### Obtaining Registered Users/Devices
To obtain the details for all the registered users/devices for a Hue Bridge you can use the registeredUsers() function.
```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var hostname = "192.168.2.129";
var username = "083b2f780c78555d532b78544f135798";

var api = new hue.HueApi(hostname, username);
api.registeredUsers().then(displayResult).done();
```
This will produce a JSON response that has a root key of "devices" that has an array of registered devices/users for the Bridge. An example of the result is shown below
```
{
  "devices": [
    {
      "name": "Node API",
      "username": "083b2f780c78555d532b78544f135798",
      "created": "2013-01-02T19:17:02",
      "accessed": "2012-12-24T20:18:55"
    },
    {
      "name": "iPad",
      "username": "279c26146e3318997d69a8a66330b5f5",
      "created": "2012-12-24T14:05:25",
      "accessed": "2013-01-04T21:37:29"
    },
    {
      "name": "iPhone",
      "username": "fcb0a47cd664f0cbaa34d36def54577d",
      "created": "2012-12-24T17:13:54",
      "accessed": "2013-01-03T20:50:40"
    }
  ]
}
````

## License
Copyright 2013. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this library except in compliance with the License.

You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
