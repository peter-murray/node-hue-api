# node-hue-api

[![npm](https://img.shields.io/npm/v/node-hue-api.svg)](http://npmjs.org/node-hue-api)

An API library for Node.js that interacts with the Philips Hue Bridge to control Lights, schedules, sensors and the 
various other features of the Hue Bridge.

This library abstracts away the actual Philips Hue Bridge REST API and provides all of the features of the Philips API 
and a number of useful functions to control/configure its various features.

The library fully supports `local network` and `remote internet` access to the Hue Bridge API and has 100% coverage of the 
documented Hue API.


## Contents
- [Change Log](#change-log) 
- [Installation](#installation)
- [v3 API](#v3-api)
    - [Connections to the Bridge](#connections-to-the-bridge)
    - [Rate Limiting](#rate-limiting)
    - [Debug Bridge Communications](#debug-bridge-communications)
    - [v2 Compatibility](#v2-api-compatibility)
    - [API Documentation](#api-documentation)
        - [Discovering Local Hue Bridges](docs/discovery.md)
        - [Remote API Support](docs/remoteApi.md)
        - [Users](docs/users.md)
        - [Lights](docs/lights.md)
            - [Light Object](docs/light.md)
            - [LightState Object](docs/lightState.md)
        - [Sensors](docs/sensors.md)
            - [Sensor Objects](docs/sensor.md)
        - [Scenes](docs/scenes.md)
            - [Scene Object](docs/scene.md)
            - [SceneLightState Object](docs/lightState.md#scenelightstate)
        - [Groups](docs/groups.md)
            - [Group Objects](docs/group.md)
            - [GroupLightState Object](docs/lightState.md#grouplightstate)
        - [Rules](docs/rules.md)
            - [Rule Object](docs/rule.md)
            - [RuleCondition Object](docs/ruleCondition.md)
            - [RuleAction Object](docs/ruleAction.md)
        - [ResourceLinks](/docs/resourcelinks.md)
            - [ResourceLink Object](docs/resourceLink.md)
        - [Schedules](docs/schedules.md)
            - [Schedule Object](docs/schedule.md)
            - [Time Patterns](docs/timePatterns.md)
        - [Configuration](docs/configuration.md)
        - [Capabilities](docs/capabilities.md)
        - [Remote](docs/remote.md)
- [Examples](#examples)
    - [Discover and connect to the Hue Bridge for the first time](#discover-and-connect-to-the-hue-bridge-for-the-first-time)
    - [Set a LightState on a Light](#set-a-light-state-on-a-light)
    - [Using Hue Remote API](#using-hue-remote-api)
- [Philips Hue Resources](#philips-hue-resources)
- [License](#license)



## Change Log
For a list of changes, and details of the fixes/improvements, bugs resolved, please refer to the change log;
[Change Log](Changelog.md)

## Installation

Node.js using npm:
```
$ npm install node-hue-api
```

Node.js using yarn:
```
$ yarn install node-hue-api
```

## v3 API

The V3 API is written to support JavaScript native Promises, as such you can use standard Promise chaining with `then()` 
and `catch()` or utilize synchronous `async` and `await` in your own code base.

As of release `4.0.0` in December 2019, the library now has complete coverage for the Hue REST API.


### Connections to the Bridge
By default all connections to the Hue Bridge are done over TLS, after the negotiation of the Bridge certificate being 
verified to the expected format and subject contents.

The Bridge certificate is self-signed, so this will cause issues when validating it normally. The library will process 
the certificate, validate the issuer and the subject and if happy will then allow the connection over TLS with the Hue 
Bridge.

When using the remote API functionality of the library, the certificate is validated normally as the https://api.meethue.com
site has an externally valid certificate and CA chain.

_Note: There is an option to connect over `HTTP` using `createInsecureLocal()` as there are some instances of use of the 
library against software the pretends to be a Hue Bridge. Using this method to connect will output warnings on the `console`
that you are connecting in an insecure way_.


### Rate Limiting
As of version 4.0+ of the library there are Rate limiters being used in three places:

* For the whole library, API calls are limited to 12 per second
* For `lights.setLightState()`, API calls are limited to 10 per second
* For `groups.setState()`, API calls are limited to 1 per second

These defaults are not currently configurable, but have been implemented to conform to the best practices defined in the 
Hue API documentation. If you are facing issues with this, then raise a support ticket via an Issue.

_Note: these do NOT (and cannot) take into account all access to the Hue Bridge, so if you have other softare that also 
accesses the bridge, it is still possible to overload it with requests._


### Debug Bridge Communications
You can put the library in to debug mode which will print out the placeholder and request details that it is using to 
talk to the Hue Bridge.

To do this, you need to define an environment variable of `NODE_DEBUG` and ensure that it is set to a string that 
contains `node-hue-api` in it.

Once the debug mode is active you will see output like the following on the console:

```
Bridge Certificate:
  subject:       {"C":"NL","O":"Philips Hue","CN":"xxxxxxxxx"}
  issuer:        {"C":"NL","O":"Philips Hue","CN":"xxxxxxxxx"}
  valid from:    Jan  1 00:00:00 2017 GMT
  valid to:      Jan  1 00:00:00 2038 GMT
  serial number: xxxxxxx

Performing validation of bridgeId "xxx" against certifcate subject "xxx"; matched? true
URL Placeholders:
  username: { type:string, optional:false, defaultValue:null }
Headers: {"Accept":"application/json"}
{
  "method": "get",
  "baseURL": "https://192.xxx.xxx.xxx:443/api",
  "url": "/xxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
URL Placeholders:
  username: { type:string, optional:false, defaultValue:null }
Headers: {"Accept":"application/json","Content-Type":"application/json"}
{
  "method": "post",
  "baseURL": "https://192.xxx.xxx.xxx:443/api",
  "url": "/xxxxxxxxxxxxxxxxxxxxxxxx/schedules",
  "data": {
    "name": "Test Schedule Recurring",
    "description": "A node-hue-api test schedule that can be removed",
    "command": {
      "address": "/api/xxxxxxxxxxxxxxxxxxxxxxxxxx/lights/0/state",
      "method": "PUT",
      "body": {
        "on": true
      }
    },
    "localtime": "W124/T12:00:00",
    "status": "enabled",
    "recycle": true
  }
}
```

_Note: You should be careful as to who can gain access to this output as it will contain sensative data including the 
MAC Address of the bridge, IP Address and username values._

The above warning applies here with respect to schedule when **not** in debug mode, as the schedule endpoints will contain the
username value (that can be used to authenticate against the bridge) in the payloads of the `command`.


## v2 API Compatibility
In the version 4.x releases of this library all backwards compatibility to the much older Q promise and callback
functionality was removed (as was indicated in the 3.x documentation). 

What was provided in the 3.x versions of this library to provide some backward comaptibility has now been moved into 
another library [node-hue-api-v2-shim](https://github.com/peter-murray/node-hue-api-v2-shim).

_The `node-hue-api-v2-shim` is only provided to allow you to continue to use the older v2 API functionality in code you 
may have had previously written and there are downsides to using it. You are strongly encouraged to migrate to the v3 
API provided in this library (which is where any new features and improvements will be made going forward)._


## API Documentation
- [Discovering Local Hue Bridges](docs/discovery.md)  
- [Remote API Support](docs/remoteApi.md)
- [Users](docs/users.md)
- [Lights](docs/lights.md)
    - [Light Object](docs/light.md)
- [Sensors](docs/sensors.md)
    - [Sensor Objects](docs/sensor.md)
- [Scenes](docs/scenes.md)
    - [Scene Object](docs/scene.md)
    - [SceneLightState Object](docs/lightState.md#scenelightstate)
- [Groups](docs/groups.md)
    - [Group Objects](docs/group.md)
    - [GroupLightState Object](docs/lightState.md#grouplightstate)
- [Rules](docs/rules.md)
    - [Rule Object](docs/rule.md)
    - [RuleCondition Object](docs/ruleCondition.md)
    - [RuleAction Object](docs/ruleAction.md)
- [ResourceLinks](docs/resourcelinks.md)
    - [ResourceLink Object](docs/resourceLink.md)
- [Schedules](docs/schedules.md)
    - [Schedule Object](docs/schedule.md)
    - [Time Patterns](docs/timePatterns.md)
- [Configuration](docs/configuration.md)
- [Capabilities](docs/capabilities.md)
- [Remote](docs/remote.md)


## Examples
The v3 APIs are documented using example code and links to more complex/complete examples for each API calls, consult 
the documentation links [above](#v3-api).

Alternatively take a look at the [examples directory](examples/v3) in this repository for complete self contained 
runnable example code.

---

### Discover and connect to the Hue Bridge for the first time

For getting started interacting with the Hue Bridge, you will need to discover and then connect to the Hue Bridge as an
authorized user. To do this you need to either know the IP Address of the Hue Bridge in advance, or use the discovery 
features to locate it.

Once you know the IP Address of the Bridge, you need to create a user that is authorized to interact with the Hue Bridge,
this is typically done by pressing the `Link` button on the bridge and then attempting to register a new user via code.

Below is example code that can be used to achieve this (using async/await to avoid nested Promises):
```js
const v3 = require('node-hue-api').v3
  , discovery = v3.discovery
  , hueApi = v3.api 
;

const appName = 'node-hue-api';
const deviceName = 'example-code';

async function discoverBridge() {
  const discoveryResults = await discovery.nupnpSearch();

  if (discoveryResults.length === 0) {
    console.error('Failed to resolve any Hue Bridges');
    return null;
  } else {
    // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
    return discoveryResults[0].ipaddress;
  }
}

async function discoverAndCreateUser() {
  const ipAddress = await discoverBridge();

  // Create an unauthenticated instance of the Hue API so that we can create a new user
  const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();
  
  let createdUser;
  try {
    createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
    console.log('*******************************************************************************\n');
    console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
                'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
                'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
    console.log(`Hue Bridge User: ${createdUser.username}`);
    console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
    console.log('*******************************************************************************\n');

    // Create a new API instance that is authenticated with the new user we created
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(createdUser.username);

    // Do something with the authenticated user/api
    const bridgeConfig = await authenticatedApi.configuration.get();
    console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

  } catch(err) {
    if (err.getHueErrorType() === 101) {
      console.error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  }
}

// Invoke the discovery and create user code
discoverAndCreateUser();
```

The complete code sample above is available from [here](./examples/v3/discoverAndCreateUserScript.js).

For more details on discovery of Hue Bridges, check out the [discovery API](./docs/discovery.md) and referenced examples 
along with the [users API](./docs/users.md). 


---

### Set a Light State on a Light
Once you have created your user account and know the IP Address of the Hue Bridge you can interact with things on it. 
To interact with light on the Hue Bridge you can use the following:

```js
const v3 = require('node-hue-api').v3;
const LightState = v3.lightStates.LightState;

const USERNAME = 'your username to authenticating with the bridge'
  // The name of the light we wish to retrieve by name
  , LIGHT_ID = 1
;

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    // Using a LightState object to build the desired state
    const state = new LightState()
      .on()
      .ct(200)
      .brightness(100)
    ;
    
    return api.lights.setLightState(LIGHT_ID, state);
  })
  .then(result => {
    console.log(`Light state change was successful? ${result}`);
  })
;
```

For more details on interacting with lights, see the [lights API](./docs/lights.md) and [LightState](./docs/lightState.md) 
documentation and examples referenced within.


### Using Hue Remote API
This library has support for interacting with the `Hue Remote API` as well as local network connections. There are some
limitations on the remote endpoints, but the majority of them will function as they would on a local network.

It can be rather involved to set up a remote connection, but not too onerous if you desire such a thing.

The complete documentation for doing this is detailed in the [Remote API](docs/remoteApi.md) and associated links.

* [Example for connecting remotely for the first time](./examples/v3/remote/accessFromScratch.js)
* [Example for connecting using existing OAuth tokens](./examples/v3/remote/accessWithTokens.js) 


## Philips Hue Resources

There are a number of resources where users have detailed documentation on the Philips Hue Bridge;
 - The Official Phillips Hue Documentation <http://www.developers.meethue.com>
 - Hue Hackers Mailing List: <https://groups.google.com/forum/#!forum/hue-hackers>
 - StackOverflow: <http://stackoverflow.com/questions/tagged/philips-hue>


## License
Copyright 2013-2019. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this library except in compliance with the License.

You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
