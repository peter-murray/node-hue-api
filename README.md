# node-hue-api

[![npm](https://img.shields.io/npm/v/node-hue-api.svg)](http://npmjs.org/node-hue-api)

An API library for Node.js that interacts with the Philips Hue Bridge to control Lights, schedules, sensors and the 
various other features of the Hue Bridge.

This library abstracts away the actual Philips Hue Bridge REST API and provides all of the features of the Philips API 
and a number of useful functions to control/configure its various features.

The library fully supports `local network` and `remote internet` access to the Hue Bridge.


## Contents
- [Change Log](#change-log)
    - [2.x](#2x)
    - [3.x](#3x)
        - [2.x Backwards Compatibility Shim](#2x-backwards-compatibility-shim) 
- [Installation](#installation)
- [v2 API](docs/v2_api.md) - for backwards compatibility with 2.x versions of the library (deprecated)
- [v3 API](#v3-api) - new API introduced in 3.x versions of the library
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
        - [Group Object](docs/group.md)
        - [GroupLightState Object](docs/lightState.md#grouplightstate)
    - [Configuration](docs/configuration.md)
    - [Remote](docs/remote.md)
- [Examples](#examples)
    - [Discover and connect to the Hue Bridge for the first time](#discover-and-connect-to-the-hue-bridge-for-the-first-time)
    - [Set a LightState on a Light](#set-a-light-state-on-a-light)
    - [Using Hue Remote API](#useing-hue)
- [Philips Hue Resources](#philips-hue-resources)
- [License](#license)



## Change Log
For a list of changes, please refer to the change log;
[Changes](Changelog.md)


### 2.x
The library was originally written well before Promises and Async functions were part of the Javascript language (as well 
as callbacks being the Node.js standard at the time). The `2.x` versions of the library heavily used  `callbacks` and 
`Q promises` for all the functions of the API.

It was getting difficult to continue to support the new features of the bridge in this manner, and there was a lot of 
unnecessary dependencies that were being dragged around, some of which were abandoned, e.g. `traits` and `Q`.

You can continue to use the old 2.x release versions of this library, but the final release is `2.4.6` and no new 
features will be added to this.

There is a shim layer in the `3.x` releases that provides a drop in to match about 95% of the v2 API, see 
[here](#2x-backwards-compatibility-shim) for more details.



### 3.x
In version `3.x` the library was rewritten to adopt up to date Javascript language features (ES6) and remove a number of
now defunct dependencies.

This has resulted in the removal of the older `callbacks` and Q `promises` from the code base and a brand new API that
includes a number of missing pieces of the the Philips Hue Bridge which were not available under the `2.x` versions, 
e.g. Sensors support.

The rewrite of the API using up to date language constructs has resulted in some significant speed increases from a 
code execution stand point as well as introducing improved functionality around utility functions like setting RGB values 
on lights (which are not explicitly supported in the Philips Hue REST API).

#### 2.x Backwards Compatibility Shim
There is a backwards compatibility shim provided in the `3.x` releases to allow existing (`2.x`) users of 
the library some time to transition existing code over to the updated API.

This does have some minor breaking changes in some edge case features, but the majority of the core library 
functions are shimmed to use the new API code behind a backwards compatible layer that provides a shimmed layer of
`callback`s and `Q` style promises as per the original API.

Please consult the [backwards compatibility changes](docs/v3_backwards_compatibility.md) for details on changes that had 
to be made that will change the v2 API.

_Note: You are strongly encouraged to migrate off this, as it will be completely removed in the `4.x` releases, also all new 
features will only be added to the `v3` going forward._  

_Note: This shim will print out on `console.error` a number of warnings about the deprecated function calls that exist and
provide some details on what you can do to remove them._

This shim layer will be removed in the `4.x` release versions of the library.


## Installation

NodeJS using npm:
```
$ npm install node-hue-api
```

NodeJS using yarn:
```
$ yarn install node-hue-api
```


## v3 API

The V3 API is written to support JavaScript native Promises, as such you can use stand Promise chaining with `then()` 
and `catch()` or utilize synchronous `async` and `await` in your own code base.

_Note that there are a number of runnable code samples in the [examples/v3](examples/v3) directory of this repository._

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
    - [Group Object](docs/group.md)
    - [GroupLightState Object](docs/lightState.md#grouplightstate)
- [Configuration](docs/configuration.md)
- [Remote](docs/remote.md)



## Examples
The v3 APIs are documented using example code and links to more complex/complete examples for each API calls, consult 
the documentation links [above](#v3-api).

Alternatively take a look at the [examples directory](examples/v3) in this repository for complete self contained 
runnable example code.


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
  const unauthenticatedApi = await hueApi.create(ipAddress);

  let user;
  try {
    user = await unauthenticatedApi.users.createUser(appName, deviceName);
    console.log('*******************************************************************************\n');
    console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
                'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
                'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
    console.log(`Hue Bridge User: ${user}`);
    console.log('*******************************************************************************\n');
    
    // Create a new API instance that is authenticated with the new user we created
    const authenticatedApi = await hueApi.create(ipAddress, user);

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
    return v3.api.create(host, USERNAME);
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
This library has support for interacting with the `Hue Remote API` as well as local network connections.

It is rather involved to set up a remote connection, but not too onerous if you desire such a thing.
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
