# Node Hue API

[![npm](https://img.shields.io/npm/v/node-hue-api.svg)](http://npmjs.org/node-hue-api)

An API library for Node.js that interacts with the Philips Hue Bridge to control Philips Hue Light Bulbs and
Philips Living Color Lamps.

This library abstracts away the actual Philips Hue Bridge REST API and provides all of the features of the Phillips API and
a number of useful functions to control the lights and bridge remotely.

The library supports both function ``callbacks`` and Q ``promises`` for all the functions of the API.
So for each function in the API, if a callback is provided, then a callback will be used to return any results
or notification of success, in a true Node.js fashion. If the callback is omitted then a promise will be returned for
use in chaining or in most cases simpler handling of the results.

When using Q ``promises``, it is necessary to call ``done()`` on any promises that are returned, otherwise errors can be
swallowed silently.

## Table of Contents
- [Change Log](#change-log)
- [Work In Progress](#work-in-progress)
- [Breaking Changes in 2.0.x](#breaking-changes-in-20x)
- [Philips Hue Resources](#philips-hue-resources)
- [Installation](#installation)
- [Examples](#examples)
- [Finding the Lights Attached to the Bridge](#finding-the-lights-attached-to-the-bridge)
- [Interacting with a Hue Light or Living Color Lamp](#interacting-with-a-hue-light-or-living-color-lamp)
- [Using LightState to Build States](#using-lightstate-to-build-states)
- [Turning a Light On/Off using LightState](#turning-a-light-onoff-using-lightstate)
- [Setting Light States using custom JSON Object](#setting-light-states-using-custom-json-object)
- [Getting the Current Status/State for a Light](#getting-the-current-statusstate-for-a-light)
- [Working with Groups](#working-with-groups)
- [Working with Schedules](#working-with-schedules)
- [Working with scenes](#working-with-scenes)
- [Advanced Options](#advanced-options)
- [License](#license)

## Change Log
For a list of changes, please refer to the change log;
[Changes](Changelog.md)


## Work In Progress
There are still some missing pieces to the library which includes;
* Rules API
* Improved handling of settings/commands for Schedules


## Breaking Changes in 2.0.x
In version `2.0.x` breaking changes were made to the API so that the library could better integrate with the `1.11`
version of Hue Bridge's software. This involved a number of new API endpoints and changes to types of activities that
had been wrapped by this library, which the bridge endpoints now offer.

The majority of the changes in the API were with respect to the scenes, as these were stored inside the bridge, instead
of in the lights. As such the scene APIs have been modified to expose this new functionality.

### Node.js 0.10.x and Early 0.12.x Issues
In version `2.0.x` the HTTP library was swapped out with a new one `axios`. This library requires that there is a
`promise` present in Node.js.
Versions 0.10.x and some early versions of 0.12.x will require a shim to work with the node-hue-api library now.

If you get an error stack trace like the following, you will need the promise shim;

```
node_modules/axios/lib/axios.js:45
var promise = Promise.resolve(config);
^
ReferenceError: Promise is not defined
```

The shim dependency is available at [https://github.com/stefanpenner/es6-promise] and can be installed via npm using
``npm install es6-promise``

Once you have the dependency, you will need to add the following into your code to apply the polyfill:

```js
require('es6-promise').polyfill();
```


## Philips Hue Resources

There are a number of resources where users have detailed documentation on the Philips Hue Bridge;
 - The Official Phillips Hue Documentation <http://www.developers.meethue.com>
 - Unofficial Hue Documentation: <http://burgestrand.github.com/hue-api/>
 - Hue Hackers Mailing List: <https://groups.google.com/forum/#!forum/hue-hackers>
 - StackOverflow: <http://stackoverflow.com/questions/tagged/philips-hue>


## Installation

NodeJS application using npm:
```
$ npm install node-hue-api
```

## Examples

### Locating a Philips Hue Bridge
There are two functions available to find the Phillips Hue Bridges on the network ``nupnpSearch()`` and ``upnpSearch()``.
Both of these methods are useful if you do not know the IP Address of the bridge already.

The official Hue documentation recommends an approach to finding bridges by using both UPnP and N-UPnP in parallel
to find your bridges on the network. This API library provided you with both options, but leaves it
to the developer to decide on the approach to be used, i.e. fallback, parallel, or just one type.


#### nupnpSearch() or locateBridges()
This API function makes use of the official API endpoint that reveals the bridges on a network. It is a call through to
``http://meethue.com/api/nupnp`` which may not work in all circumstances (your bridge must have signed into the methue portal),
 in which case you can fall back to the slower
``upnpSearch()`` function.

This function is considerably faster to resolve the bridges < 500ms compared to 5 seconds to perform a full search on my
own network.

```js
var hue = require("node-hue-api");

var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

// --------------------------
// Using a promise
hue.nupnpSearch().then(displayBridges).done();

// --------------------------
// Using a callback
hue.nupnpSearch(function(err, result) {
	if (err) throw err;
	displayBridges(result);
});
```

The results from this call will be of the form;
```
Hue Bridges Found: [{"id":"001788fffe096103","ipaddress":"192.168.2.129","name":"Philips Hue","mac":"00:00:00:00:00"}]
```


#### upnpSearch or searchForBridges()
This API function utilizes a network scan for the SSDP responses of devices on a network. It is the only method that does not
support callbacks, and is only in the API as a fallback since Phillips provided a quicker discovery method once the API was
officially released.

```js
var hue = require("node-hue-api"),
	timeout = 2000; // 2 seconds

var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

hue.upnpSearch(timeout).then(displayBridges).done();
```
A timeout can be provided to the function to increase/decrease the amount of time that it waits for responses from the
search request, by default this is set to 5 seconds (the above example sets this to 2 seconds).

The results from this function call will be of the form;
```
Hue Bridges Found: [{"id":"001788096103","ipaddress":"192.168.2.129"}]
```


### Registering a new Device/User with the Bridge
Once you have discovered the IP Address for your bridge (either from the UPnP/N-UPnP function, or looking it up on the
Philips Hue website), then you will need to register your application with the Hue Bridge.

Registration requires you to issue a request to the Bridge after pressing the Link Button on the Bridge (although you can
now do this via the API too if you already have an existing user account on the Bridge).

This library offer two functions to register new devices/users with the Hue Bridge. These are detailed below.


### Bridge Configuration
You can obtain a summary of the configuration of the Bridge using the ``config()`` or ``getConfig()`` functions;

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
api.config().then(displayResult).done();
// using getConfig() alias
api.getConfig().then(displayResult).done();

// --------------------------
// Using a callback
api.config(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
// using getConfig() alias
api.getConfig(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
```

This will provide results detailing the configuration of the bridge (IP Address, Name, Link Button Status, Defined Users, etc...);
```
{
  "name": "Philips hue",
  "zigbeechannel": 11,
  "bridgeid": "xxxxxxx",
  "mac": "00:xx:88:xx:f3:xx",
  "dhcp": false,
  "ipaddress": "192.168.2.245",
  "netmask": "255.255.255.0",
  "gateway": "192.168.2.1",
  "proxyaddress": "none",
  "proxyport": 0,
  "UTC": "2017-01-04T20:01:21",
  "localtime": "2017-01-04T20:01:21",
  "timezone": "Europe/London",
  "modelid": "BSB002",
  "datastoreversion": "59",
  "swversion": "01036659",
  "apiversion": "1.16.0",
  "swupdate": {
    "updatestate": 0,
    "checkforupdate": false,
    "devicetypes": {
      "bridge": false,
      "lights": [],
      "sensors": []
    },
    "url": "",
    "text": "",
    "notify": false
  },
  "linkbutton": false,
  "portalservices": true,
  "portalconnection": "connected",
  "portalstate": {
    "signedon": true,
    "incoming": true,
    "outgoing": true,
    "communication": "disconnected"
  },
  "factorynew": false,
  "replacesbridgeid": "xxxxxxxxxxx",
  "backup": {
    "status": "idle",
    "errorcode": 0
  },
  "whitelist": {
    ...
  }
}
```

If you invoke the ``config()`` or ``connect()`` functions with an invalid user account (i.e. one that is not valid) then
results of the name and software version will be returned from the bridge with no other information;
```

  "apiversion": "1.16.0"
  "bridgeid": "xxxxxxxxxxx"
  "datastoreversion": "59"
  "factorynew": false
  "mac": "00:xx:88:xx:f3:xx"
  "modelid": "BSB002"
  "name": "Philips hue"
  "replacesbridgeid": "xxxxxxxxxxx"
  "swversion": "01036659"
}
```
For this reason, if you want to validate that the user account used to connect to the bridge is correct, you will have to
look for a field that is not present in the above result, like the ``zigbeechannel``, ``ipaddress`` or ``linkbutton`` would be good
properties to check.

//TODO Need to document setting config value and timezones

### Timezones
To obtain the valid timezones for the bridge, you can use the ``getTimezones()`` or ``timezones()`` function.

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
api.getTimezones().then(displayResult).done();
// or using 'timezones' alias
api.timezones().then(displayResult).done();

// --------------------------
// Using a callback
api.getTimezones(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
// or using 'timezones' alias
api.timezones(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
```

//TODO setting a time zone


### Software and API Version
The version of the software and API for the bridge is available from the `config` function, but out of convenience there
is also a `getVersion` and `version` function which filters the `config` return data to just give you the version details.

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
api.getVersion().then(displayResult).done();
// or using 'version' alias
api.version().then(displayResult).done();

// --------------------------
// Using a callback
api.getVersion(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
// or using 'version' alias
api.version(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
```

This will result in data output as follows;
```
{
    "name": "Philips hue",
    "version": {
        "api": "1.5.0",
        "software": "01018228"
    }
}
```

### Registering without an existing Device/User ID
A user can be registered on the Bridge using ``registerUser()`` or ``createUser()`` functions. This is useful when you have not got
an existing user account on the Bridge to use to access its protected functions.

```js
var HueApi = require("node-hue-api").HueApi;

var hostname = "192.168.2.129",
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
hue.registerUser(hostname, userDescription)
    .then(displayUserResult)
    .fail(displayError)
    .done();

// --------------------------
// Using a callback (with default description and auto generated username)
hue.createUser(hostname, function(err, user) {
	if (err) throw err;
	displayUserResult(user);
});
```

The description for the user account is optional, if you do nto provide one, then the default of "Node.js API" will be set.

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


### Bridge Description
You can obtain the UPnP/Discovery description details of the Bridge using the function ``description()`` or
``getDescription()``. The result of this will be the contents of the `/description.xml` converted into a JSON object.

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
api.description().then(displayResult).done();
// using alias getDescription()
api.getDescription().then(displayResult).done();

// --------------------------
// Using a callback
api.description(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
// using alias getDescription()
api.getDescription(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
```


### Validating a Connection to a Philips Hue Bridge
To connect to a Philips Hue Bridge and obtain some basic details about it you can use the any
of the following functions;
* ``config()`` or ``getConfig()``
* ``version()`` or ``getVersion()``

The details of the results of these functions are provided above.


### Obtaining the Complete State of the Bridge
If you have a valid user account in the Bridge, then you can obtain the complete status of the bridge using
``fullState()`` or ``getFullState()``.
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
// or alias fullState()
api.fullState().then(displayResult).done();

// --------------------------
// Using a callback
api.getFullState(function(err, config) {
    if (err) throw err;
    displayResult(config);
});
// or alias fullState()
api.fullState(function(err, config) {
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
      "name": "Lounge Living Color",
      "type": "Extended color light",
      "modelid": "LCT001",
      "manufacturername": "Phillips",
      "uniqueid": "00:17:88:01:xx:xx:xx:xx-xx",
      "swversion": "66013452",
      "state": {
          "on": true,
          "bri": 202,
          "hue": 11315,
          "sat": 237,
          "effect": "none",
          "xy": [
            0.5534,
            0.4239
          ],
          "alert": "none",
          "colormode": "xy",
          "reachable": true
        }
    },
    {
      "id": "2",
      "name": "Right Bedside",
      "type": "Extended color light",
      "modelid": "LCT001",
      "manufacturername": "Phillips",
      "uniqueid": "00:17:88:01:xx:xx:xx:xx-xx",
      "swversion": "66013452",
      "state": {
          "on": true,
          "bri": 202,
          "hue": 11315,
          "sat": 237,
          "effect": "none",
          "xy": [
            0.5534,
            0.4239
          ],
          "alert": "none",
          "colormode": "xy",
          "reachable": true
        }
    },
    {
      "id": "3",
      "name": "Left Bedside",
      "type": "Extended color light",
      "modelid": "LCT001",
      "manufacturername": "Phillips",
      "uniqueid": "00:17:88:01:xx:xx:xx:xx-xx",
      "swversion": "66013452",
      "state": {
          "on": true,
          "bri": 202,
          "hue": 11315,
          "sat": 237,
          "effect": "none",
          "xy": [
            0.5534,
            0.4239
          ],
          "alert": "none",
          "colormode": "xy",
          "reachable": true
        }
    }
  ]
}
```
The `id` values are what you will need to use to interact with the light directly and set the states on it (like on/off, color, etc...).

## Interacting with a Hue Light or Living Color Lamp
The library provides a function, __setLightState()__, that allows you to set the various states on a light connected to the Hue Bridge.
You can either provide a JSON object that contains the values to set the various state values, or you can use the provided __lightState__ object in the library to build the state object ot pass to the function. See below for examples.

## Using LightState to Build States
The __lightState__ object provides a fluent way to build up a simple or complex light states that you can pass to a light.

The majority of the various states that you can set on a Hue Light or Living Color lamp are available from this object.

### LightState Options
The __lightState__ object provides the following methods that can be used to build various states (all of which can be combined);

The LightState object, provides functions with the same name of the underlying Hue Bridge API properties for lights,
which take values documented in the official Phillips Hue Lights API:

| Function | Details |
|:-------------|:---------------------|
| `on(value)`   | Sets the `on` state, where the value is `true` or `false`|
| `bri(value)`   | Sets the brightness, where value from 0 to 255 |
| `hue(value)` | Sets the hue, where value from 0 to 65535 |
| `sat(value)`  | Sets the saturation value from 0 to 255  |
| `xy(x, y)`      | Sets the xy value where x and y is from 0 to 1 in the Philips Color co-ordinate system |
| `ct(colorTemperature)` | Set the color temperature to a value between 153 and 500 |
| `alert(value)` | Sets the alert state to value `none`, `select` or `lselect`. If no parameter is passed will default to `none`. |
| `effect(effectName)` | Sets the effect on the light(s) where `effectName` is either `none` or `colorloop`. |
| `transitiontime(int)` | Sets a transition time to a multiple of 100 milliseconds, e.g. 4 means 400ms |
| `bri_inc(value)`| Increments/Decrements the brightness by the value specified. Accepts values -254 to 254. |
| `sat_inc(value)`| Increments/Decrements the saturation by the value specified. Accepts values -254 to 254. |
| `hue_inc(value)`| Increments/Decrements the hue by the value specified. Accepts values -65534 to 65534. |
| `ct_inc(value)` | Increments/Decrements the color temperature by the value specified. Accepts values -65534 to 65534. |
| `xy_inc(value)` | Increments/Decrements the xy co-ordinate by the value specified. Accepts values -0.5 to 0.5. |

There are also a number of convenience functions to provide extra functionality or a more natural language for building
up a desired Light State:

| Function | Details |
|:---------|:--------|
| `turnOn()` | Turn the lights on |
| `turnOff()` |Turn the lights off |
| `off()` |Turn the lights off |
| `brightness(percentage)` |Set the brightness from 0% to 100% (0% is not off)|
| `incrementBrightness(value)` |Alias for the `bri_inc()` function above |
| `colorTemperature(ct)` |Alias for the `ct()` function above|
| `colourTemperature(ct)` |Alias for the `ct()` function above|
| `colorTemp(ct)`| Alias for the `ct()` function above|
| `colourTemp(ct)` |Alias for the `ct()` function above|
| `incrementColorTemp(value)` |Alias for the `ct_inc()` function above |
| `incrementColorTemperature(value)` |Alias for the `ct_inc()` function above |
| `incrementColourTemp(value)` |Alias for the `ct_inc()` function above |
| `incrementColourTemperature(value)` |Alias for the `ct_inc()` function above |
| `saturation(percentage)`| Set the saturation as a percentage value between 0 and 100|
| `incrementSaturation(value)` |Alias for the `sat_inc()` function above |
| `incrementXY(value)` |Alias for the `xy_inc()` function above |
| `incrementHue(value)` |Alias for the `hue_inc()` function above |
| `shortAlert()` |Flashes the light(s) once|
| `alertShort()` |Flashes the light(s) once|
| `longAlert()` |Flashes the light(s) 10 times|
| `alertLong()` |Flashes the light(s) 10 times|
| `transitionTime(int)` |Sets a transition time to a multiple of 100 milliseconds, e.g. 4 means 400ms |
| `transition(milliseconds)` |Specify a specific transition time|
| `transitiontime_milliseconds(milliseconds)` | Sets a transition time in milliseconds (will be rounded to the closest 100ms |
| `transitionSlow()` |A slow transition of 800ms|
| `transitionFast()` | A fast transition of 200ms|
| `transitionInstant()` |A transition of 0ms|
| `transitionDefault()` |A transition time of the bridge default (400ms)|
| `white(colorTemp, briPercent)` | where colorTemp is a value between 154 (cool) and 500 (warm) and briPercent is 0 to 100|
| `hsl(hue, sat, luminosity)` | Where hue is a value from 0 to 359, sat is a saturation percent value from 0 to 100, and luminosity is from 0 to 100|
| `hsb(hue, sat, brightness)` | Where hue is a value from 0 to 359, sat is a saturation percent value from 0 to 100, and brightness is from 0 to 100|
| `rgb(r, g, b)` | Sets an RGB value from integers 0-255|
| `rgb([r, g, b])` | Sets an RGB value from an array of integer values 0-255|
| `colorLoop()` | Starts a color loop effect (rotates through all available hues at the current saturation level)|
| `colourLoop()` | Starts a color loop effect (rotates through all available hues at the current saturation level)|
| `effectColorLoop()` | Starts a color loop effect (rotates through all available hues at the current saturation level)|
| `effectColourLoop()` | Starts a color loop effect (rotates through all available hues at the current saturation level)|
| `copy()`| Allows you to create an independent copy of the LightState|
| `reset()` | Will completely reset/remove all provided values|


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
You can pass in your own JSON object that contain the setting(s) that you wish to pass to the light via the bridge. If
you do this, then a LightState object will be created from the passed in object, so that it can be properly validated
and only valid values are passed to the bridge.

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
To obtain the current state of a light from the Hue Bridge you can use the `lightStatus()` or `getLightStatus()` function;

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

### Obtaining the RGB Value for a Light
There is a function to provide the complete light status along with an approximated RGB value (which is a rough conversion
of the xy state of a light into an RGB value). This is not a perfect conversion but does get close to the current color
of the lamp.

To obtain the status with the RGB approximation of a lamp use `lightStatusWithRGB()` or `getLightStatusWithRGB()`.

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
api.lightStatusWithRGB(1)
    .then(displayResult)
    .fail(displayError)
    .done();
```

```js
{
  state: {
    rgb: [ 255, 249, 221 ],
     on: true,
     bri: 254,
     hue: 38265,
     sat: 92,
     effect: 'none',
     xy: [ 0.3362, 0.3604 ],
     alert: 'none',
     colormode: 'xy',
     reachable: true
  },
  type: 'Color light',
  name: 'Living Color Floor',
  modelid: 'LLC007',
  manufacturername: 'Philips',
  uniqueid: '00:17:88:01:00:1b:21:a3-0b',
  swversion: '4.6.0.8274'
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
The Hue Bridge can support groups of lights so that you can do things like setting a colour and status to a group
of lights instead of just a single light.

There is a special "All Lights" Group with an id of `0` that is defined in the bridge that a user cannot modify.

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
    "name": "Lightset 0",
    "type": "LightGroup"
  },
  {
    "id": "1",
    "name": "VRC 1",
    "lights": [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "type": "LightGroup",
    "action": {
      "on": false,
      "bri": 162,
      "hue": 13088,
      "sat": 213,
      "effect": "none",
      "xy": [
        0.5134,
        0.4149
      ],
      "ct": 467,
      "alert": "none",
      "colormode": "xy"
    }
  }
]
```
Please note, the __Lightset 0__ group, is a special instance and will always exist and have the id of "0" as specified
in the Hue Api documentation. Due to this internal group being maintained by the bridge internally, it will not return
an array of light ids like the other groups in the results returned from a call to `groups()`.

If you need to get the full details of the __Lightset 0__ groups, then you can obtain that by using the `getGroup()`
function, using an id argument of `0`.

The `groups` function will return all types of Groups in the bridge, these include new types of groups that support the
new [Hue Beyond|http://www2.meethue.com/en-us/the-range/hue-beyond].

To support the addition of these new types of groups, and the fact that most users will only want a subset of the types
there are now three new functions that will filter the types of groups for you;
* `luminaires` Will obtain only the *Luminaire* groups (i.e. a collection of lights that make up a single device). These are not user modifiable.
* `lightSources` Will obtain the *Lightsource* groups (i.e. a subset of the lights in a Luminarie). These are not user modifiable.
* `lightGroups` Will obtain the defined groups in the bridge


### Obtaining the Details of a Group Definition
To get the specific details of the lights that make up a group (and some extra information like the last action that was performed)
use the __getGroup(id)__ function.

In Hue Bridge API version 1.4+ the full data for the group will be returned when obtaining all groups via the `groups`
or `lightGroups` functions. The only exception to this is the special All Lights Group, id 0, which requires the use of
a specific lookup to obtain the full details.

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
  "name": "Lightset 0",
  "lights": [
    "1",
    "2",
    "3",
    "4",
    "5"
  ],
  "type": "LightGroup",
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


### Create a New Group
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


### Updating a Group
It is possible to update the associated lights and the name of a group after it has been created on the bridge. The function
``updateGroup()`` allows you to do this.

You can set the name, the lightIds or both with this function, just omit what you do not want to set, it will work out which
parameter was passed based on type, a String for the name and an array for the light ids.

When invoking this function ``true`` will be returned if the Bridge accepts the requested change.
It can take take a short period of time before the bridge will actually reflect the change requested, in experience 1.5
seconds has always covered the necessary time to effect the change, but it could be quicker than that.

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

The function will return a promise that will provide an array of objects, each containing the complete details fo the schedule;
```
[
  {
    "id": "9067578731131353",
    "name": "Alarm",
    "description": "Peter Wakeup",
    "command": {
      "address": "/api/yeM5QamRRFNXfv13/groups/0/action",
      "body": {
        "scene": "f0f7c51a6-on-7"
      },
      "method": "PUT"
    },
    "localtime": "W124/T06:10:00",
    "time": "W124/T06:10:00",
    "created": "2015-11-18T22:19:16",
    "status": "disabled"
  },
  ...
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
  "id": "9067578731131353",
  "name": "Alarm",
  "description": "Peter Wakeup",
  "command": {
    "address": "/api/yeM5QamRRFNXfv13/groups/0/action",
    "body": {
      "scene": "f0f7c51a6-on-7"
    },
    "method": "PUT"
  },
  "localtime": "W124/T06:10:00",
  "time": "W124/T06:10:00",
  "created": "2015-11-18T22:19:16",
  "status": "disabled"
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


## Working with scenes
The Hue Bridge can store up to 200 scenes internally. There is currently no way to delete a scene from the API once it
is created, although old unused scenes will get overwritten.

Additionally, bridge scenes should not be confused with the preset scenes stored in the Android and iOS apps. In the
apps these scenes are stored internally. Once activated though, they may then appear as a bridge scene.



### Obtaining all the Defined scenes
To obtain all the defined bridge scenes on the Hue Bridge use the ``scenes()`` or ``getScenes()`` functions:

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
api.scenes()
    .then(displayResults)
    .done();
// Using 'getScenes' alias
api.getScenes()
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.scenes(function(err, result){
    if (err) throw err;
    displayResults(result);
});
// Using 'getScenes' alias
api.getScenes(function(err, result){
    if (err) throw err;
    displayResults(result);
```

The function will return an Array of scene definitions consisting of ``id``, ``name`` and ``lights``;
```
[
  {
    "name": "Tap scene 1",
    "lights": [
      "1",
      "2",
      "3"
    ],
    "owner": "none",
    "recycle": true,
    "locked": true,
    "appdata": {},
    "picture": "",
    "lastupdated": null,
    "version": 1,
    "id": "OFF-TAP-1"
  },
  {
    "name": "Tap scene 3",
    "lights": [
      "1",
      "2",
      "3"
    ],
    "owner": "none",
    "recycle": true,
    "locked": true,
    "appdata": {},
    "picture": "",
    "lastupdated": null,
    "version": 1,
    "id": "TAP-3"
  },
  {
    "name": "Tap scene 4",
    "lights": [
      "1",
      "2",
      "3"
    ],
    "owner": "none",
    "recycle": true,
    "locked": true,
    "appdata": {},
    "picture": "",
    "lastupdated": null,
    "version": 1,
    "id": "TAP-4"
  },
  {
    "name": "Blue rain on 0",
    "lights": [
      "1",
      "2",
      "3"
    ],
    "owner": "none",
    "recycle": true,
    "locked": true,
    "appdata": {},
    "picture": "",
    "lastupdated": null,
    "version": 1,
    "id": "74f97e0ba-on-0"
  }
]
```

### Get a Scene
You can obtain a specific scene using the id of the scene and the ``scene()`` or ``getScene()`` function:

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
    sceneId = "OFF-TAP-1"
    ;

// --------------------------
// Using a promise
api.scene(sceneId)
    .then(displayResults)
    .done();
// Using 'getScene' alias
api.getScene(sceneId)
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.scene(sceneId, function(err, result){
    if (err) throw err;
    displayResults(result);
});
// Using 'getScene' alias
api.getScene(sceneId, function(err, result){
    if (err) throw err;
    displayResults(result);
};
```

The functions will return a result of the scene definition, like the following:
```
{
  "OFF-TAP-1": {
    "name": "Tap scene 1",
    "lights": [
      "1",
      "2",
      "3",
      "4"
    ],
    "owner": "none",
    "recycle": true,
    "locked": true,
    "appdata": {},
    "picture": "",
    "lastupdated": null,
    "version": 1
  }
```

### Creating a Scene
The original function `createScene()` was implemented to support the older `1.2.x` version of the Hue Bridge Scene
creation. In version `2.0.x` of this library, it was modified to support both the old an new versions of scene creation.

If you call this function using a an `array` of light ids and a `name` it will call the `createBasicScene()` function.
Alternatively if you call this function with a `Scene` object, then the `createAdvancedScene()` function will be invoked.

See below for the specifics of the parameters and results.


### Creating a Basic Scene
There are multiple definitions on scenes, some of which are stored in the Bridge, others are stored inside the iOS and
Android applications. This API can only interact and define scenes that are stored inside the Hue Bridge.

As of version `1.11` of the Hue Bridge Software, all scenes are now stored inside the bridge.

When creating a new scene, the current state of the lights that are being included become the state of the lights when
you activate/recall the scene in the future.

When you create a scene via the API function ``createBasicScene()``, the scene will get an ``id`` that is created by the
bridge.

```js
var hue = require("node-hue-api")
  , HueApi = hue.HueApi
  , hueScene = hue.scene
  ;

var displayResults = function(result) {
  console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.245"
  , username = "08a902b95915cdd9b75547cb50892dc4"
  , api = new HueApi(host, username)
  , scene = hueScene.create()
  ;

scene.withName("My Scene")
  .withLights([1, 2, 3])
  .withTransitionTime(500)
  ;

// --------------------------
// Using a promise
api.createAdvancedScene(scene)
  .then(displayResults)
  .done();

// --------------------------
// Using a callback
api.createAdvancedScene(scene, function(err, result){
  if (err) throw err;
  displayResults(result);
});
```

When a new scene is created, you will get a result back with the id of the created scene of the form;
```
{
    "id": "jsoaw-58sk2"
}
```

The ``name`` value is optional, if one is not specified, then it will be set as the ``id`` that is generated. This is a
feature of the underlying Hue Bridge, so may change in a future firmware update.


### Creating an Advanced Scene
With the advent of version `1.11` Hue Bridge software version, the creation of Scenes was officially added and the number
 of parameters available when creating a scene changed.

The scenes are now stored inside the bridge itself, and to support the multiple combination of parameters available you
need to provide the settings in a `Scene` object.

```js
var HueApi = require("node-hue-api").HueApi;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
    sceneName = "My New Scene",
    lightIds = [1, 2, 3, 4, 5, 6, 7]
    ;

// --------------------------
// Using a promise
api.createBasicScene(lightIds, sceneName)
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.scene(lightIds, sceneName, function(err, result){
    if (err) throw err;
    displayResults(result);
});
```

When a new scene is created, you will get a result back with the id of the created scene of the form;
```
{
    "id": "jsoaw-58sk2"
}
```

### Scene Object
The Scene object allows you to define a number of parameters that can be used to define a scene as of the `1.11.x` Hue
Bridge firmware.

To obtain a `scene` instance;
```js
var hueScene = require("node-hue-api").scene;

var myScene = scene.create();
```

This will give you a `Scene` object that has the following functions available to build a scene;
- ``withName(String)`` which will set a name for the scene (optional)
- ``withLights([])`` which will set the array of light ids for the scene
- ``withTransitionTime(ms)`` which will set the transtion time in milliseconds for the lights (optional)
- ``withRecycle(boolean)`` which will set the recycle flag on the scene (optional)
- ``withAppData(Object)`` which will set the application data for the scene e.g. ``{data: "some data", version: "1.0"}`` (optional)
- ``withPicture(String)`` a base64 encoded string which is the picture for the scene (optional)

An example of building a complex scene;
```js
var hueScene = require("node-hue-api").scene;

var scene = hueScene.create()
              .withName("my scene")
              .withLights([1, 2, 3])
              .withTransitionTime(2000)
              .withAppData({data: "My own application data value for the scene"})
              ;
```


### Updating/Modifying an Existing Scene
You can update an existing scene by using the ``updateScene()`` or ``modifyScene()`` function. When updating the scene
you can set the ``name``, ``lights`` or store the current light states of the lights in the scene. Any combination of
these parameters are possible.

```js
var hue = require("node-hue-api")
  , HueApi = hue.HueApi
  , hueScene = hue.scene
  ;

var displayResults = function(result) {
  console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.245"
  , username = "08a902b95915cdd9b75547cb50892dc4"
  , api = new HueApi(host, username)
  , sceneId = "iimpLsd4yVuVnjy"
  , sceneUpdates = hueScene.create()
  ;

sceneUpdates.withName("My Scene")
  .withLights([1, 2, 3])
  ;

// --------------------------
// Using a promise
api.modifyScene(sceneId, sceneUpdates)
  .then(displayResults)
  .done();

// --------------------------
// Using a callback
api.modifyScene(sceneId, sceneUpdates, function(err, result){
  if (err) throw err;
  displayResults(result);
});
```

When the scene is modified/updated, you will get a response containing the values modified;
```
{
    "name": true,
    "lights": true
}
```

Each value that is modified will report a ``true`` or ``false`` value if the parameter was changed.


### Set a Light State for a Light in a Scene
If you need to set a different light state for a light that is part of scene (that is a different state to what it was
in when the original scene was created), then you can use the `setSceneLightState()`, ``updateSceneLightState()``
or ``modifySceneLightState()`` function.

This function allows you to specify the desired values for a single light in a scene, if you want to set the state for
multiple bulbs, you will have to set it on each one individually.

```js
var HueApi = require("node-hue-api").HueApi
    , lightState = require("node-hue-api").lightState
    ;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.245",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
    sceneId = "node-hue-api-2",
    lightId = 1,
    state = lightState.create().on().hue(2000)
    ;

// --------------------------
// Using a promise
api.setSceneLightState(sceneId, lightId, state)
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.setSceneLightState(sceneId, lightId, state, function(err, result){
    if (err) throw err;
    displayResults(result);
});
```

The results from setting light sate values will be the name of each value being set followed by a value of `true` if
the change in the value was successful;

```
{
    "on": true,
    "hue": true
}
```


### Activating or Recalling a Scene
To recall or activate a scene (synonyms for the same activity) use the ``activateScene()`` or ``recallScene()`` function.

When a scense is being made active, it is possible to also filter the lights in the scene using a group definition to
limit the lights that will be affected by the scene activation.
This means you could have defined a scene for all your bulbs, but if you apply a group filter that includes only, say
the lounge lights, then the scene will be activated only on the lounge lights.

If a group filter is not specified (it is an optional parameter) then the API does no filtering on the lights in the
scene when it is activated.

```js
var HueApi = require("node-hue-api").HueApi
    , lightState = require("node-hue-api").lightState
    ;

var displayResults = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    api = new HueApi(host, username),
    sceneId = "node-hue-api-2",
    lightId = 1,
    state = lightState.create().on().hue(2000)
    ;

// --------------------------
// Using a promise
api.activateScene(sceneId)
    .then(displayResults)
    .done();
// using the "recallScene" alias
api.recallScene(sceneId)
    .then(displayResults)
    .done();

// --------------------------
// Using a callback
api.activateScene(sceneId, function(err, result) {
    if (err) throw err;
    displayResults(result);
});
// using the "recallScene" alias
api.recallScene(sceneId, function(err, result) {
    if (err) throw err;
    displayResults(result);
});
```

When a Scene is successfully activated/recalled, the result will be `true`.

### Scenes by Name
There is no sensible way to dealing with scenes by name currently (firmware version 1.5+) as it is possible to define
multiple scenes with the same name (in fact in testing even editing a scene in the iOS app created a new scene on the
bridge).

The scene `id` is the only reliable and consistent way to interact with scene activation/recalling.


## Advanced Options

### Timeouts

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

api = new HueApi(host, username, timeout);
```

The default timeout, when not specified will be 10000ms (10 seconds). This is usually enough time for the bridge
to respond unless you are returning a very large result (like the complete state for the bridge in a large installation)


### Bridge Port Number

If you are running your bridge over a router or using some kind of NAT, it may be possible that the Hue Bridge is not
running on the default port. If this is the case, then you can set the port number as an advanced configuration option
when creating the API connection to the bridge.

*Please note that for normal usage, you should never set the port value.*

```js
var hue = require("node-hue-api"),
    HueApi = hue.HueApi;

var host = "192.168.2.129",
    username = "08a902b95915cdd9b75547cb50892dc4",
    timeout = 20000, // timeout in milliseconds
    port = 8080, // not the default port for the bridge
    api;

api = new HueApi(host, username, timeout, port);
```


## License
Copyright 2013-2015. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this library except in compliance with the License.

You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
