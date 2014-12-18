# Node Hue API

An API library for Node.js that interacts with the Philips Hue Bridge to control Philips Hue Light Bulbs and
Philips Living Color Lamps.

This library abstracts away the actual Philips Hue Bridge REST API and provides all of the features of the Phillips API and
a number of useful functions to control the lights and bridge remotely.

The library has undergone a large update for version ``0.2.x``, where it now supports ``callbacks`` and Q ``promises`` for the
functions of the API.
So for each function in the API, if a callback is provided, then a callback will be used to return any results
or notification of success, in a true Node.js fashion. If the callback is omitted then a promise will be returned for
use in chaining or in most cases simpler handling of the results.

When using Q ``promises``, it is necessary to call ``done()`` on any promises that are returned, otherwise errors can be
swallowed silently.

## Change Log
For a list of changes, please refer to the change log;
[Changes](Changelog.md)

Please note that a number of breaking changes have occurred in moving from version 0.1.x to 0.2.x, but these were necessary to
provide more consistency in the API and to ensure that moving forward the library will be able to better adjust to changes
in the firmware of the Phillips Hue Bridge.


## Work In Progress
There is still some work to be done around completing the ability to define schedules in a bette way that properly
validates the command that is to be run as part of the schedule. With the changes introduced in version ``0.2.0`` of this
library it should be easier to accomplish in an upcoming release.

The public API as of version 0.2.0+ is close to complete (at least for the current version of the Phillips Hue Bridge firmware),
and as such there will be no breaking changes to the library that has occurred in moving from version ``0.1.x`` to ``0.2.x``.


## Philips Hue Resources

There are a number of resources where users have detailed documentation on the Philips Hue Bridge;
 - The Official Phillips Hue Documentation <http://developers.meethue.com/index.html>
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
There are two functions available to find the Phillips Hue Bridges on the network ``locateBridges()`` and ``searchForBridges()``.
Both of these methods are useful if you do not know the IP Address of the bridge already.

### locateBridges()
This API function makes use of the official API endpoint that reveals the bridges on a network. It is a call through to
``http://meethue.com/api/nupnp`` which may not work in all circumstances, in which case you can fall back to the old function
``searchForBridges()``.

This function is considerably faster to resolve the bridges < 500ms compared to 5 seconds to perform a full search on my
own network.

```js
var hue = require("node-hue-api");

var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

// --------------------------
// Using a promise
hue.locateBridges().then(displayBridges).done();

// --------------------------
// Using a callback
hue.locateBridges(function(err, result) {
	if (err) throw err;
	displayBridges(result);
});
```

The results from this call will be of the form;
```
Hue Bridges Found: [{"id":"001788fffe096103","ipaddress":"192.168.2.129"}]
```


#### searchForBridges()
This API function utilizes a network scan for the SSDP responses of devices on a network. It is the only method that does not
support callbacks, and is only in the API as a fallback since Phillips provided a quicker discovery method once the API was
officially released.

```js
var hue = require("node-hue-api"),
	timeout = 2000; // 2 seconds

var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

hue.searchForBridges(timeout).then(displayBridges).done();
```
A timeout can be provided to the function to increase/decrease the amount of time that it waits for responses from the
search request, by default this is set to 5 seconds (the above example sets this to 2 seconds).

The results from this function call will be of the form;
```
Hue Bridges Found: [{"id":"001788096103","ipaddress":"192.168.2.129"}]
```


### Registering a new Device/User with the Bridge
Once you have discovered the IP Address for your bridge (either from the locate/search function, or looking it up on the
Philips Hue website), then you will need to register your application with the Hue Bridge.

Registration requires you to issue a request to the Bridge after pressing the Link Button on the Bridge (although you can
now do this via the API too if you already have an existing user account on the Bridge).

Ths library offer two functions to register new devices/users with the Hue Bridge. These are detailed below.


### Bridge Configuration
You can obtain a summary of the configuration of the Bridge using the ``config()`` or ``connect()`` functions;

```js
var HueApi = require("node-hue-api").HueApi;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var hostname = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api;

api = new HueApi(hostname, username);

// --------------------------
// Using a promise
api.connect().then(displayResult).done();

// --------------------------
// Using a callback
api.connect(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
```

This will provide results detailing the configuration of the bridge (IP Address, Name, Link Button Status, Defined Users, etc...);
```
{
  "name": "Philips hue",
  "mac": "00:x:xx:xx:xx:xx",
  "dhcp": true,
  "ipaddress": "192.168.2.129",
  "netmask": "255.255.255.0",
  "gateway": "192.168.2.1",
  "proxyaddress": "none",
  "proxyport": 0,
  "UTC": "2013-06-15T13:20:08",
  "whitelist": {
    "51780342fd7746f2fb4e65c30b91d7": {
      "last use date": "2013-05-29T20:29:51",
      "create date": "2013-05-29T20:29:51",
      "name": "Node.js API"
    },
    "08a902b95915cdd9b75547cb50892dc4": {
      "last use date": "1987-01-06T22:53:37",
      "create date": "2013-04-02T13:39:18",
      "name": "Node Hue Api Tests User"
    }
  },
  "swversion": "01005825",
  "swupdate": {
    "updatestate": 0,
    "url": "",
    "text": "",
    "notify": false
  },
  "linkbutton": false,
  "portalservices": true
}
```

If you invoke the ``config()`` or ``connect()`` functions with an invalid user account (i.e. one that is not valid) then
results of the name and software version will be returned from the bridge with no other information;
```
{
  "name": "Philips hue",
  "swversion": "01005825"
}
```
For this reason, if you want to validate that the user account used to connect to the bridge is correct, you will have to
look for a field that is not present in the above result, like the ``mac``, ``ipaddress`` or ``linkbutton`` would be good
properties to check.


### Registering without an existing Device/User ID
A user can be registered on the Bridge using ``registerUser()`` or ``createUser()`` functions. This is useful when you have not got
an existing user account on the Bridge to use to access its protected functions.

```js
var HueApi = require("node-hue-api").HueApi;

var hostname = "192.168.2.129",
    newUserName = null // You can provide your own username value, but it is normally easier to leave it to the Bridge to create it
    userDescription = "device description goes here";

var displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};

var hue = new HueApi();

// --------------------------
// Using a promise
hue.registerUser(hostname, newUserName, userDescription)
    .then(displayUserResult)
    .fail(displayError)
    .done();

// --------------------------
// Using a callback (with default description and auto generated username)
hue.createUser(hostname, null, null, function(err, user) {
	if (err) throw err;
	displayUserResult(user);
});
```

If the username value passed in to register a new user is ``null`` or ``undefined`` then the Hue Bridge will create a
new user with a generated username. It is suggested to allow the bridge to generate this for you automatically.

The description for the user account is also optional, if you do nto provide one, then the default of "Node.js API" will be set.

There is a convenience method, if you have a existing user account when you register a new user, that will programmatically
press the link button for you. See the details for the function ``pressLinkButton()`` for more details.


#### Registration Output/Error
When registering a new user you will get the username created, or an error that will likely be due to not pressing the
link button on the Bridge.

If the link button was NOT pressed on the bridge, then you will get an ``ApiError`` thrown, which will be captured by the displayError function in the above examples.
```
Api Error: link button not pressed
```

If the link button was pressed you should get a response that will provide you with a hash to use as the username for connecting with the Hue Bridge, e.g.
```
033a6feb77750dc770ec4a4487a9e8db
```


### Validating a Connection to a Philips Hue Bridge
To connect to a Philips Hue Bridge and obtain some basic details about it you can use the ``connect()`` or ``config()``
functions which were detailed above.


### Obtaining the Complete State of the Bridge
If you have a valid user account in the Bridge, then you can obtain the complete status of the bridge using ``getFullState()``.
This function is computationally expensive on the bridge and should not be invoked frequently.

```js
var HueApi = require("node-hue-api").HueApi;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var hostname = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api;

api = new HueApi(hostname, username);

// --------------------------
// Using a promise
api.getFullState().then(displayResult).done();

// --------------------------
// Using a callback
api.getFullState(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
```
This will produce a JSON response similar to the following (large parts have been removed from the result below);
```
{
  "lights": {
    "5": {
      "state": {
        "on": false,
        "bri": 0,
        "hue": 6144,
        "sat": 254,
        "xy": [
          0.6376,
          0.3563
        ],
        "alert": "none",
        "effect": "none",
        "colormode": "hs",
        "reachable": true
      },
      "type": "Color light",
      "name": "Living Color TV",
      "modelid": "LLC007",
      "swversion": "4.6.0.8274",
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
  },
  "groups": {
    "1": {
      "action": {
        "on": false,
        "bri": 63,
        "hue": 65527,
        "sat": 253,
        "xy": [
          0.6736,
          0.3221
        ],
        "ct": 500,
        "effect": "none",
        "colormode": "ct"
      },
      "lights": [
        "1",
        "2",
        "3"
      ],
      "name": "NodejsApiTest"
    }
  },
  "config": {
  	...
  	"whitelist": {
          "51780342fd7746f2fb4e65c30b91d7": {
            "last use date": "2013-05-29T20:29:51",
            "create date": "2013-05-29T20:29:51",
            "name": "Node.js API"
          },
          "08a902b95915cdd9b75547cb50892dc4": {
            "last use date": "1987-01-06T22:53:37",
            "create date": "2013-04-02T13:39:18",
            "name": "Node Hue Api Tests User"
          }
        },
	"swversion": "01005825"
	...
  },
  "schedules": {
    "1": {
      "name": "Updated Name",
      "description": "Like anyone really needs a wake up on Xmas day...",
      "command": {
        "address": "/api/08a902b95915cdd9b75547cb50892dc4/lights/5/state",
        "body": {
          "on": true
        },
        "method": "PUT"
      },
      "time": "2014-01-01T07:00:30",
      "created": "1970-01-01T00:00:00"
    }
  },
  "scenes": {}
```

### Obtaining Registered Users/Devices
To obtain the details for all the registered users/devices for a Hue Bridge you can use the ``registeredUsers()`` function.
```js
var HueApi = require("node-hue-api").HueApi;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var hostname = "192.168.2.129";
var username = "08a902b95915cdd9b75547cb50892dc4";
var api = new HueApi(hostname, username);

// --------------------------
// Using a promise
api.registeredUsers().then(displayResult).done();

// --------------------------
// Using a callback
api.registeredUsers(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
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

### Deleting a User/Device
To delete a user or device from the Bridge, you will need an existing user account to authenticate as, and then you can call
``deleteUser()`` or ``unregisterUser()`` to remove a user from the Bridge Whitelist;

```js
var HueApi = require("node-hue-api").HueApi;

var hostname = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4";

var displayUserResult = function(result) {
    console.log("Deleted user: " + JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};

var hue = new HueApi(hostname, username);

// --------------------------
// Using a promise
hue.deleteUser("2b997aae306f15a734d8d1c2315d47cb")
    .then(displayUserResult)
    .fail(displayError)
    .done();

// --------------------------
// Using a callback
hue.unregisterUser("1ab7d44219e64c373b4b915e34494443", function(err, user) {
    if (err) throw err;
    displayUserResult(user);
});
```
Which will result in a ``true`` result if the user was removed, or an error if any other result occurs (i.e. the user does not exist) as shown below;
```
{
	message: 'resource, /config/whitelist/2b997aae306f15a734d8d1c2315d47cb, not available',
	type: 3,
	address: '/config/whitelist/2b997aae306f15a734d8d1c2315d47cb'
}
```


## Finding the Lights Attached to the Bridge
To find all the lights that are registered with the Hue Bridge, so that you might be able to interact with them, you can use the ``lights()`` function.

```js
var HueApi = require("node-hue-api").HueApi;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api;

api = new HueApi(host, username);

// --------------------------
// Using a promise
api.lights()
    .then(displayResult)
    .done();

// --------------------------
// Using a callback
api.lights(function(err, lights) {
    if (err) throw err;
    displayResult(lights);
});
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
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
    state;

// Set light state to 'on' with warm white value of 500 and brightness set to 100%
state = lightState.create().on().white(500, 100);

// --------------------------
// Using a promise
api.setLightState(5, state)
    .then(displayResult)
    .done();

// --------------------------
// Using a callback
api.setLightState(5, state, function(err, lights) {
    if (err) throw err;
    displayResult(lights);
});
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
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

var displayResult = function(result) {
    console.log(result);
};

var displayError = function(err) {
    console.error(err);
};

var host = "192.168.2.129",
    username = "033a6feb77750dc770ec4a4487a9e8db",
    api = new HueApi(host, username),
    state = lightState.create();

// --------------------------
// Using a promise

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

// --------------------------
// Using a callback
// Set the lamp with id '2' to on
api.setLightState(2, state.on(), function(err, result) {
	if (err) throw err;
	displayResult(result);
});

// Now turn off the lamp
api.setLightState(2, state.off(), function(err, result) {
	if (err) throw err;
	displayResult(result);
});
```

If the function call is successful, then you should get a response of ``true``. If the call fails then an ``ApiError``
will be generated with the failure details.


## Setting Light States using custom JSON Object
You can pass in your own JSON object that contain the setting(s) that you wish to pass to the light via the bridge.

```js
var HueApi = require("node-hue-api").HueApi;

var displayResult = function(result) {
    console.log(result);
};

var displayError = function(err) {
    console.error(err);
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api;

api = new HueApi(host, username);
api.setLightState(2, {"on": true}) // provide a value of false to turn off
    .then(displayResult)
    .fail(displayError)
    .done();
```

If the function call is successful, then you should get a response of true. If the call fails then an ``ApiError`` will be generated with the failure details.


## Getting the Current Status/State for a Light
To obtain the current state of a light from the Hue Bridge you can use the __lightStatus()__ function;

```js
var HueApi = require("node-hue-api").HueApi;

var displayStatus = function(status) {
    console.log(JSON.stringify(status, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// Obtain the Status of Light '5'

// --------------------------
// Using a promise
api.lightStatus(5)
    .then(displayStatus)
    .done();

// --------------------------
// Using a callback
api.lightStatus(5, function(err, result) {
    if (err) throw err;
    displayStatus(result);
});
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

### Searching for New Lights
When you have added new lights to the system, you need to invoke a search to discover these new lights to allow the Bridge
to interact with them. The ``searchForNewLights()`` function will invoke a search for any new lights to be added to the
system.

When you invoke a scan for any new lights in the system, the previous search results are destroyed.

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// --------------------------
// Using a promise
api.searchForNewLights()
	.then(displayResults)
	.done();

// --------------------------
// Using a callback
api.searchForNewLights(function(err, result) {
	if (err) throw err;
	displayResults(result);
});
```
The result from this call should be ``true`` if a search was successfully triggered. It can take some time for the search
to complete.

### Obtaining Newly Discovered Lights
Once a search has been completed, then the newly discovered lights can be obtained using the ``newLights()`` call.
```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// --------------------------
// Using a promise
api.newLights()
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.newLights(function(err, result) {
    if (err) throw err;
    displayResults(result);
});
```
The results from this call should be the new lights that were found during the previous search, and a ``lastscan`` value
that will be the date that the last scan was performed, which could be ``none`` if a search has never been performed.
```
{
  "lastscan": "2013-06-15T14:45:23"
}
```

### Naming Lights
It is possible to name a light using the ``setLightName()`` function;
```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// --------------------------
// Using a promise
api.setLightName(5, "A new Name")
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.setLightName(5, "Living Color TV", function(err, result) {
    if (err) throw err;
    displayResults(result);
});
```
If the call is successful, then ``true`` will be returned by the function call, otherwise a ``ApiError`` will result.


## Working with Groups
The Groups API for the Phillips Hue Bridge is not complete at this time, with some of API endpoints not officially
supported yet. This API does attempt to provide functions to invoke these end points, but in testing, some of them have
been identified as being problematic, in that they report success, but nothing on the actual Bridge changes. In most of
these cases, restarting the Bridge (pulling the power cable) resulted in the calls working again for a short period of
time. Your mileage may vary if you are creating and modifying these newly created groups...

### Obtaining all Groups from the Bridge
To obtain all the groups defined in the bridge use the __groups()__ function;

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// Obtain all the defined groups in the Bridge

// --------------------------
// Using a promise
api.groups()
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.groups(function(err, result) {
    if (err) throw err;
    displayResults(result);
});
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
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// --------------------------
// Using a promise
api.getGroup(0)
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.getGroup(0, function(err, result) {
    if (err) throw err;
    displayResults(result);
});
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

### Setting the Light State for a Group
A function ``setGroupLightState()`` exists for interacting with a group of lights to be able to set all the lights to a
particular state. This function is identical to that of the ``setLightState()`` function above, except that it works on
groups instead of a single light.

In the early versions of this library the group and individual lights were controlled via a single ``setLightState()``
function, but this has been removed from version _0.2.x_ as it was not clear that a single boolean changed the target for the
function invocation which felt wrong.


### Updating a Group
It is possible to update the associated lights and the name of a group after it has been created on the bridge. The function
``updateGroup()`` allows you to do this.

You can set the name, the lightIds or both with this function, just omit what you do not want to set, it will work out which
parameter was passed based on type, a String for the name and an array for the light ids.

When invoking this function ``true`` will be returned if the Bridge accepts the requested change, but under some circumstances
if the group has just been created, then Bridge reports success, but does not actually change the configuration details. In these
cases, a restart of the Bridge might resolve the issue.

Changing the name of an existing group;
```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// Update the name of the group

// --------------------------
// Using a promise
api.updateGroup(1, "new group name")
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.updateGroup(1, "new group name", function(err, result){
    if (err) throw err;
    displayResults(result);
});
```

Changing the lights associated with an existing group;
```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// Update the lights in the group to ids 1, 2, and 3.

// --------------------------
// Using a promise
api.updateGroup(1, [1, 2, 3])
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.updateGroup(1, [1, 2, 3], function(err, result){
    if (err) throw err;
    displayResults(result);
});
```

Changing both the name and the lights for an existing group;
```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// Update both the name and the lights in the group to ids 4, 5.

// --------------------------
// Using a promise
api.updateGroup(1, "group name", [4, 5])
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.updateGroup(1, "group name", [4, 5], function(err, result){
    if (err) throw err;
    displayResults(result);
});
```


### Create a New Group
The creation of groups is not officially supported in the released Hue API from Phillips (version 1.0). This has been
tested on a Hue Bridge, but use at your own risk *(you may have to reset the bridge to factory defaults if something goes wrong)*.

To create a new group use the __createGroup(name, lightIds)__ function;

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// Create a new Group on the bridge

// --------------------------
// Using a promise
api.createGroup("a new group", [4, 5])
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.createGroup("group name", [1, 4, 5], function(err, result){
    if (err) throw err;
    displayResults(result);
});
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

To delete a group use the ``deleteGroup()`` function;

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// Create a new Group on the bridge

// --------------------------
// Using a promise
api.deleteGroup(3)
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.deleteGroup(4, function(err, result){
    if (err) throw err;
    displayResults(result);
});
```
This function call will return a ``true`` result in the promise chain if successful, otherwise an error will be thrown.


## Working with Schedules

### Obtaining all the Defined Schedules
To obtain all the defined schedules on the Hue Bridge use the ``schedules()`` function.

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username);

// --------------------------
// Using a promise
api.schedules()
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.schedules(function(err, result){
    if (err) throw err;
    displayResults(result);
});
```

The function will return a promise that will provide an array of objects of ``id`` and ``name`` for each schedule;
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
To obtain the details of a schedule use the ``getSchedule(id)`` function;

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
    scheduleId = 1;

// --------------------------
// Using a promise
api.getSchedule(scheduleId)
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.getSchedule(scheduleId, function(err, result){
    if (err) throw err;
    displayResults(result);
});
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

There are two functions that can be invoked to create a new schedule (which are identically implemented);
- ``scheduleEvent(event, cb)``
- ``createSchedule(event, cb)``

These functions both take an object the wraps up the scheduled event to be created. There are only two required properties
of the object, ``time`` and ``command``, with option properties ``name`` and ``description``.

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
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

// --------------------------
// Using a promise
api.scheduleEvent(scheduledEvent)
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.createSchedule(scheduledEvent, function(err, result){
    if (err) throw err;
    displayResults(result);
});
```

The result returned by the promise when creating a new schedule will be that of the ``id`` for the newly created schedule;
```
{
  "id": "1"
}
```

The ``command`` value must be a Hue Bridge API endpoint for it to correctly function, which means it must start with
``/api/<valid username>/``. For now if using this function, you will have to use the exact API end point as specified in
the Phillips Hue REST API.

To help with building a schedule and to perform some basic checking to ensure that values are correct/valid there is a
helper module ``scheduleEvent`` which can be used the build a valid schedule object.

### Using ScheduleEvent to build a Schedule
The ``scheduleEvent`` module/function is used to build up a schedule that the Hue Bridge can understand. It is not a
requirement when creating schedules, but can eliminate some of the basic errors that can result when creating a schedule.

To obtain a scheduleEvent instance;
```js
var scheduleEvent = require("node-hue-api").scheduledEvent;

var mySchedule = scheduleEvent.create();
```

This will give you a schedule object that has the following functions available to build a schedule;
- ``withName(String)`` which will set a name for the schedule (optional)
- ``withDescription(String)`` which will set a description for the schedule (optional)
- ``withCommand(command)`` which will set the command object that the schedule will run
- ``on()``, ``at()``, ``when()`` which all take a string or Date value to specify the time the schedule will run, if
passing a string it must be valid when parsed by ``Date.parse()``

The ``command`` object currently has to be specified as the Hue Bridge API documentation states which is of the form;
```
{
	"address": "/api/08a902b95915cdd9b75547cb50892dc4/lights/5/state",
    "method" : "PUT",
    "body"   : {
    	"on": true
    }
}
```
The above example command will switch on the light with id ``5`` for the username ``08a902b95915cdd9b75547cb50892dc4``.

If you use the ``withCommand()`` function then the ``address`` will be undergo basic validation to ensure it is an
endpoint for the Hue Bridge which is a common mistake to make when crafting your own values.

Once a scheduleEvent has been built it can be passEd directly to the ``createSchedule()``, ``scheduleEvent()`` or
``updateSchedule()`` function calls in the Hue API.

For example to create a new schedule that will turn on the light with id 5 at 07:00 on the 25th December 2013;
```js
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    scheduleEvent = hue.scheduledEvent;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
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
    })
    .on("2013-12-25T07:00:00");

// --------------------------
// Using a promise
api.createSchedule(mySchedule)
    .then(displayResult)
    .done();

// --------------------------
// Using a callback
api.createSchedule(mySchedule, function(err, result) {
    if (err) throw err;
    displayResult(result);
});
```


### Updating a Schedule
You can update an existing schedule using the ``updateSchedule()`` function;

```js
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    scheduleEvent = hue.scheduledEvent;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
    scheduleId = 1,
    updatedValues;

updatedValues = {
    "name": "Updated Name",
    "time": "January 1, 2014 07:00:30"
};

// --------------------------
// Using a promise
api.updateSchedule(scheduleId, updatedValues)
    .then(displayResult)
    .done();

// --------------------------
// Using a callback
api.updateSchedule(scheduleId, updatedValues, function(err, result) {
    if (err) throw err;
    displayResult(result);
});
```

The result from the promise will be an object with the properties of the schedule that were updated and ``true`` as the
value of each one that was successful.
```
{
  "name": true,
  "time": true
}
```


### Deleting a Schedule
All schedules in the Hue Bridge are removed once they are triggered. To remove an impending schedule use the ``deleteSchedule()``
function;

```js
var hue = require("node-hue-api"),
    HueApi = hue.HueApi;

var displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
    scheduleId = 1;

// --------------------------
// Using a promise
api.deleteSchedule(scheduleId)
    .then(displayResult)
    .done();

// --------------------------
// Using a callback
api.deleteSchedule(scheduleId, function(err, result) {
    if (err) throw err;
    displayResult(result);
});
```

If the deletion was successful, then ``true`` will be returned from the promise, otherwise an ``ApiError`` will be thrown,
as in the case if the schedule does not exist.


## Advanced Options

If there are issues with the Bridge not responding in time for a result of error to be delivered, then you
may need to tweak the timeout settings for the API. When this happens you will get an
`ETIMEOUT` error.

The way to set a maximum timeout when interacting with the bridge is done when you instantiate the ``HueApi``.

```js
var hue = require("node-hue-api"),
    HueApi = hue.HueApi;

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    timeout = 20000 // timeout in milliseconds
    api;

api = new HueApi(host, password, timeout);
```

The default timeout, when onw is not specified will be 10000ms (10 seconds). This is usually enough time for the bridge
to respond unless you are returning a very large result (like the complete state for the bridge in a large installation)


## License
Copyright 2013. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this library except in compliance with the License.

You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
