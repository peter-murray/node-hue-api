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
- __hsl(hue, saturation, brightPercent)__ where hue is a value from 0 to 359, saturation is a percent value from 0 to 100, and brightPercent is from 0 to 100
- __xy(x, y)__ where x and y is from 0 to 1 in the Philips Color co-ordinate system
- __rgb(red, green, blue)__ where red, green and blue are values from 0 to 255 - Not all colors can be created by the lights
- __transition(seconds)__ this can be used with another setting to create a transition effect (like change brightness over 10 seconds)
- __effect(value)__ this can be set to 'colorloop' or 'none'. The 'colorloop' rotates through all available hues at the current saturation level

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

## Working with Groups

### Obtaining all Groups from the Bridge
To obtain all the groups defined in the bridge use the __groups()__ function;

```js
var hue = require("node-hue-api").hue;

var displayGroups = function(groups) {
    console.log(JSON.stringify(groups, null, 2));
};

var host = "192.168.2.129",
    username = "033a6feb77750dc770ec4a4487a9e8db",
    api = new hue.HueApi(host, username);

// Obtain all the defined groups in the Bridge
api.groups()
    .then(displayGroups)
    .done();
```

This will produce an array of values detailing the id and names of the groups;
```
[
  {
    "id": "0",
    "name": "All Lights"
  },
  {
    "id": "1",
    "name": "VRC 1"
  }
]
```
The "All Lights" Group is a special instance and will always exist and have the id of "0" as specified in the Hue Api
documentation.


### Obtaining the Details of a Group Definition
To obtain the details of the lights that make up a group (and some extra information like the last action that was performed)
use the __getGroup(id)__ function.

```js
var hue = require("node-hue-api").hue;

var displayGroup = function(group) {
    console.log(JSON.stringify(group, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username);

api.getGroup(0)
    .then(displayGroup)
    .done();
```

Which will return produce a result like;
```
{
  "id": "0",
  "name": "All Lights",
  "lights": [
    "1",
    "2",
    "3",
    "4",
    "5"
  ],
  "lastAction": {
    "on": true,
    "bri": 128,
    "hue": 6144,
    "sat": 254,
    "xy": [
      0.6376,
      0.3563
    ],
    "ct": 500,
    "effect": "none",
    "colormode": "ct"
  }
}
```


### Updating a Group
It is possible to update the associated lights and the name of a group after it has been created on the bridge. The function
__updateGroup(groupId, name, lightIds)__ allows you to do this.

You can set the name, the lightIds or both with this function, just omit what you do not want to set, it will work out which
parameter was passed based on type, a String for the name and an array for the light ids.

If the update is successful __true__ will be returned in the promise chain, otherwise an error will be thrown.

Changing the name of an existing group;
```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log("Updated Successfully? " + result);
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username);

// Update the name of the group
api.updateGroup(5, "new group name")
    .then(displayResult)
    .done();
```

Changing the lights associated with an existing group;
```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log("Updated Successfully? " + result);
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username);

// Update the lights in the group to ids 1, 2, and 3.
api.updateGroup(5, [1, 2, 3])
    .then(displayResult)
    .done();
```

Changing both the name and the lights for an existing group;
```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log("Updated Successfully? " + result);
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username);

// Update the name of the group and the light ids to 4 and 5.
api.updateGroup(5, "new group name", [4, 5])
    .then(displayResult)
    .done();
```


### Create a New Group
The creation of groups is not officially supported in the released Hue API from Phillips (version 1.0). This has been
tested on a Hue Bridge, but use at your own risk *(you may have to reset the bridge to factory defaults if something goes wrong)*.

To create a new group use the __createGroup(name, lightIds)__ function;

```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username);

api.createGroup("A Group Name", [1, 2, 3])
    .then(displayResult)
    .done();
```

The function will return a promise with a result that contains the id of the newly created group;
```
{
  "id": "2"
}
```


### Deleting a Group
The deletion of groups is not officially supported in the released Hue API from Phillips (version 1.0), but it is still
possible to delete groups, but use at your own risk *(you may have to reset the bridge to factory defaults if something
goes wrong)*.

To delete a group use the __deleteGroup(id)__ function;

```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log("Deleted Group? " + result);
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username);

api.deleteGroup(10)
    .then(displayResult)
    .done();
```

This function call will return a __true__ result in the promise chain if successful, otherwise an error will be thrown.


## Working with Schedules

### Obtaining all the Defined Schedules
To obtain all the defined schedules on the Hue Bridge use the __schedules()__ function.

```js
var hue = require("node-hue-api").hue;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username);

api.schedules()
    .then(displayResult)
    .done();
```

The function will return a promise that will provide an array of objects of __id__ and __name__ for each schedule;
```
[
  {
    "id": "1",
    "name": "Sample Schedule"
  },
  {
    "id": "2",
    "name": "Wake Up"
  }
]
```

### Obtaining the details of a Schedule
To obtain the details of a schedule use the __getSchedule(id)__ function;

```js
var hue = require("node-hue-api").hue;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username),
    scheduleId = 1;

api.getSchedule(scheduleId)
    .then(displayResult)
    .done();
```

The promise returned by the function will return the details of the schedule in the following format;
```
{
  "name": "Sample Schedule",
  "description": "An example of a schedule",
  "command": {
    "address": "/api/08a902b95915cdd9b75547cb50892dc4/lights/5/state",
    "body": {
      "on": true
    },
    "method": "PUT"
  },
  "time": "2014-08-01T00:00:00",
  "id": 1
}
```

### Creating a Schedule
Creating a schedule requires just two elements, a time at which to trigger the schedule and the command that will be
triggered when the schedule is run.
There are other optional values of a name and a description that can be provided to make the schedule easier to identify.

There are two functions that can be invoked to create a new schedule;
- __scheduleEvent(event)__
- __createSchedule(event)__

These functions both take an object the wraps up the scheduled event to be created. There are only two required properties
of the object, __time__ and __command__, with option properties __name__ and __description__.

```js
var hue = require("node-hue-api").hue;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username),
    scheduledEvent;

scheduledEvent = {
    "name": "Sample Schedule",
    "description": "A sample scheduled event to switch on a light",
    "time": "2013-12-24T00:00:00",
    "command": {
        "address": "/api/08a902b95915cdd9b75547cb50892dc4/lights/5/state",
        "method" : "PUT",
        "body"   : {
            "on": true
        }
    }
};

api.createSchedule(scheduledEvent)
    .then(displayResult)
    .done();
```

The result returned by the promise when creating a new schedule will be that of the __id__ for the newly created schedule;
```
{
  "id": "1"
}
```

The __command__ value must be a Hue Bridge API endpoint for it to correctly function, which means it must start with
__/api/<valid username>/__. For now if using this function, you will have to use the exact API end point as specified in
the Phillips Hue REST Api.

To help with building a schedule and to perform some basic checking to ensure that values are correct/valid there is a
helper module __scheduleEvent__ which can be used the build a valid schedule object.

### Using ScheduleEvent to build a Schedule
The __scheduleEvent__ module/function is used to build up a schedule that the Hue Bridge can understand. It is not a
requirement when creating schedules, but can eliminate some of the basic errors that can result when creating a schedule.

To obtain a scheduleEvent instance;
```js
var scheduleEvent = require("node-hue-api").scheduledEvent;

var mySchedule = scheduleEvent.create();
```

This will give you a schedule object that has the following functions available to build a schedule;
- __withName(String)__ which will set a name for the schedule (optional)
- __withDescription(String)__ which will set a description for the schedule (optional)
- __withCommand(command)__ which will set the command object that the schedule will run
- __on()__, __at()__, __when()__ which all take a string or Date value to specify the time the schedule will run, if
passing a string it must be valid when parsed by __Date.parse()__

The __command__ object currently has to be specified as the Hue Bridge API documentation states which is of the form;
```
{
	"address": "/api/08a902b95915cdd9b75547cb50892dc4/lights/5/state",
    "method" : "PUT",
    "body"   : {
    	"on": true
    }
}
```
The above example command will switch on the light with id __5__ for the username __08a902b95915cdd9b75547cb50892dc4__.

If you use the __withCommand()__ function then the __address__ will be undergo basic validation to ensure it is an
endpoint for the Hue Bridge which is a common mistake to make when crafting your own values.

Once a scheduleEvent has been built it can be passed directly to the __createSchedule()__, __scheduleEvent()__ or
__updateSchedule()__ function calls in the Hue API.

For example to create a new schedule that will turn on the light with id 5 at 07:00 on the 25th December 2013;
```js
var hue = require("node-hue-api").hue;
var scheduleEvent = require("node-hue-api").scheduledEvent;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username),
    mySchedule;

mySchedule = scheduleEvent.create()
    .withName("Xmas Day Wake Up")
    .withDescription("Like anyone really needs a wake up on Xmas day...")
    .withCommand(
        {
            "address": "/api/08a902b95915cdd9b75547cb50892dc4/lights/5/state",
            "method" : "PUT",
            "body"   : {
                "on": true
            }
        }
    )
    .on("2013-12-25T07:00:00");

api.createSchedule(mySchedule)
    .then(displayResult)
    .done();
```


### Updating a Schedule
You can update an existing schedule using the __updateSchedule(id, schedule)__ function;

```js
var hue = require("node-hue-api").hue;
var scheduleEvent = require("node-hue-api").scheduledEvent;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username),
    scheduleId = 1,
    updatedValues;

updatedValues = {
    "name": "Updated Name",
    "time": "January 1, 2014 07:00:30"
};

api.updateSchedule(scheduleId, updatedValues)
    .then(displayResult)
    .done();
```

The result from the promise will be an object with the properties of the schedule that were updated and __true__ as the
value of each one that was successful.
```
{
  "name": true,
  "time": true
}
```


### Deleting a Schedule
All schedules in the Hue Bridge are removed once they are triggered. To remove an impending schedule use the __deleteSchedule(id)__
function;

```js
var hue = require("node-hue-api").hue;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new hue.HueApi(host, username),
    scheduleId = 1;

api.deleteSchedule(scheduleId)
    .then(displayResult)
    .done();
```

If the deletion was successful, then __true__ will be returned from the promise, otherwise an __ApiError__ will be thrown,
as in the case if the schedule does not exist.


## License
Copyright 2013. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this library except in compliance with the License.

You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
