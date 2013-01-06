# Node Hue API

An API library for Node.js that interacts with the Philips Hue Bridge to control Philips Hue Light Bulbs and
Philips Living Color Lamps.

This library abstracts away the actual Philips Hue Bridge REST API, that is as yet, not finalized.

The library uses __promises__ instead of Node's normal callback system that is in common use. The reason for this was to make the writing of the library cleaner and error handling simpler. In some use cases the amount of nesting of async callbacks was excessive, and the promise system alleviates this, as well as providing simpler chaining.
It is simple enough to wrap this library with callback functions if necessary.

Due to this library using promises, it is necessary to call __done()__ on any promises that are returned, otherwise errors can be swallowed silently.

## Philips Hue Resources

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

## Finding the Lights Attached to the Bridge
To find all the lights that are registered with the Hue Bridge, so that you might be able to interact with them, you can use the lights() function.

```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "033a6feb77750dc770ec4a4487a9e8db",
    api;

api = new hue.HueApi(host, username);
api.lights()
    .then(displayResult)
    .done();
```

This will output a JSON object that will provide details of the lights that the Hue Bridge knows about;
```
{
  "lights": [
    {
      "id": "1",
      "name": "Lounge Living Color"
    },
    {
      "id": "2",
      "name": "Right Bedside"
    },
    {
      "id": "3",
      "name": "Left Bedside"
    },
    {
      "id": "4",
      "name": "Lounge Standing Lamp"
    }
  ]
}
```
The "id" values are what you will need to use to interact with the light directly and set the states on it (like on/off, color, etc...).

## Interacting with a Hue Light or Living Color Lamp
The library provides a function, __setLightState()__, that allows you to set the various states on a light connected to the Hue Bridge.
You can either provide a JSON object that contains the values to set the various state values, or you can use the provided __lightState__ object in the library to build the state object ot pass to the function. See below for examples.

## Using LightState to Build States
The __lightState__ object provides a fluent way to build up a simple or complex light states that you can pass to a light.

The majority of the various states that you can set on a Hue Light or Living Color lamp are available from this object.

### LightState Options
The __lightState__ object provides the following methods that can be used to build various states (all of which can be combined);

- __on()__
- __off()__
- __alert()__ flash the light once
- __alert(isLong)__ if isLong is true then the alert will flash 10 times
- __white(colorTemp, brightPercent)__ where colorTemp is a value between 154 (cool) and 500 (warm) and brightPercent is 0 to 100
- __brightness(percent)__ where percent is the brightness from 0 to 100
- __hsl(hue, saturation, brightPercent)__ where hue is a value from 0 to 65535, saturation is a value from 0 to 254, and brightPercent is from 0 to 100
- __xy(x, y)__ where x and y is from 0 to 1 in the Philips Color co-ordinate system
- __rgb(red, green, blue)__ where red, green and blue are values from 0 to 255 - Not all colors can be created by the lights
- __transition(seconds)__ this can be used with another setting to create a transition effect (like change brightness over 10 seconds)

### Creating Complex States
The LightState object provides a simple way to build up JSON object to set multiple values on a Hue Light.

To turn on a light and set it to a warm white color;
```js
var hue = require("node-hue-api").hue,
    lightState = require("node-hue-api").lightState;

var host = "192.168.2.129",
    username = "033a6feb77750dc770ec4a4487a9e8db",
    api = new hue.HueApi(host, username),
    state;

// Set light state to 'on' with warm white value of 500 and brightness set to 100%
state = lightState.create().on().white(500, 100);

// Set the lamp with id '2' to on
api.setLightState(2, state)
    .done();
```

The __lightState__ object will ensure that the values passed into the various state functions are correctly bounded to avoid
errors when setting them. For example the color temperature value (which determines the white value) must be between 154 and 500. If you pass in a value outside of this range then the lightState function call will set it to the closest valid value.

Currently the __lightState__ object will combine together all the various state values that get set by the various function calls. This means that if you do create a combination of conflicting values, like __on__ and __off__ the last one set will be the actual value provided in the corresponding JSON object;

```js
// This will result in a JSON object for the state that sets the brightness to 100% but turn the light "off"
state = lightState.create().on().brightness(100).off();
```

When using __lightState__ it is currently recommended to create a new state object each time you want to build a new state, otherwise you will get a combination of all the previous settings as well as the new values.

## Turning a Light On/Off using LightState

```js
var hue = require("node-hue-api").hue,
    lightState = require("node-hue-api").lightState;

var displayResult = function(result) {
    console.log(result);
};

var displayError = function(err) {
    console.error(err);
};

var host = "192.168.2.129",
    username = "033a6feb77750dc770ec4a4487a9e8db",
    api = new hue.HueApi(host, username),
    state = lightState.create();

// Set the lamp with id '2' to on
api.setLightState(2, state.on())
    .then(displayResult)
    .fail(displayError)
    .done();

// Now turn off the lamp
api.setLightState(2, state.off())
	.then(displayResult)
    .fail(displayError)
    .done();
```

If the function call is successful, then you should get a response of true. If the call fails then an APIError will be generated with the failure details.


## Setting Light States using custom JSON Object
You can pass in your own JSON object that contain the setting(s) that you wish to pass to the light via the bridge.

```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log(result);
};

var displayError = function(err) {
    console.error(err);
};

var host = "192.168.2.129",
    username = "033a6feb77750dc770ec4a4487a9e8db",
    api;

api = new hue.HueApi(host, username);
api.setLightState(2, {"on": true}) // provide a value of false to turn off
    .then(displayResult)
    .fail(displayError)
    .done();
```

If the function call is successful, then you should get a response of true. If the call fails then an APIError will be generated with the failure details.


## Getting the Current Status/State for a Light
To obtain the current state of a light from the Hue Bridge you can use the __lightStatus()__ function;

```js
var hue = require("node-hue-api").hue;

var displayStatus = function(status) {
    console.log(JSON.stringify(status, null, 2));
};

var host = "192.168.2.129",
    username = "033a6feb77750dc770ec4a4487a9e8db",
    api = new hue.HueApi(host, username);

// Obtain the Status of Light '2'
api.lightStatus(2)
    .then(displayStatus)
    .done();
```

This will produce a JSON object detailing the status of the lamp;
```
{
  "state": {
    "on": true,
    "bri": 254,
    "hue": 34515,
    "sat": 236,
    "xy": [
      0.3138,
      0.3239
    ],
    "ct": 153,
    "alert": "none",
    "effect": "none",
    "colormode": "ct",
    "reachable": true
  },
  "type": "Extended color light",
  "name": "Left Bedside",
  "modelid": "LCT001",
  "swversion": "65003148",
  "pointsymbol": {
    "1": "none",
    "2": "none",
    "3": "none",
    "4": "none",
    "5": "none",
    "6": "none",
    "7": "none",
    "8": "none"
  }
}
```


## License
Copyright 2013. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this library except in compliance with the License.

You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
