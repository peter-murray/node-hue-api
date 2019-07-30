# node-hue-api

[![npm](https://img.shields.io/npm/v/node-hue-api.svg)](http://npmjs.org/node-hue-api)

An API library for Node.js that interacts with the Philips Hue Bridge to control Lights, schedules, sensors and the 
various other features of the bridge.

This library abstracts away the actual Philips Hue Bridge REST API and provides all of the features of the Philips API and
a number of useful functions to control/configure its various features.


## Contents
- [Change Log](#change-log)
    - [2.x](#2x)
    - [3.x](#3x)
        - [2.x Backwards Compatibility Shim](#2x-backwards-compatibility-shim) 

- [Installation](#installation)

- [v2 API](docs/v2_api.md)

- [v3 API](#v3-api)
    - [Discovering Hue Bridges](docs/discovery.md)  
    - [Users](docs/users.md)
    - [Lights](docs/lights.md)
        - [Light Object](docs/light.md)
        - [LightState Object](docs/lightState.md)
    - [Sensors](docs/sensors.md)
        - [Sensor Objects](docs/sensor.md)
    - [Scenes](docs/scenes.md)
        - [Scene Object](docs/scene.md)
    - [Configuration](docs/configuration.md)

- [Examples](#examples)

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

- [Discovering Hue Bridges](docs/discovery.md)  
- [Users](docs/users.md)
- [Lights](docs/lights.md)
    - [Light Object](docs/light.md)
- [Sensors](docs/sensors.md)
    - [Sensor Objects](docs/sensor.md)
- [Scenes](docs/scenes.md)
    - [Scene Object](docs/scene.md)
- [Configuration](docs/configuration.md)



## Examples
The v3 APIs are documented using example code and links to more complex/complete examples for each API calls.

Check the [v3 API links](#v3-api) or the [examples directory](examples/v3) in this repository.



## Philips Hue Resources

There are a number of resources where users have detailed documentation on the Philips Hue Bridge;
 - The Official Phillips Hue Documentation <http://www.developers.meethue.com>
 - Unofficial Hue Documentation: <http://burgestrand.github.com/hue-api/>
 - Hue Hackers Mailing List: <https://groups.google.com/forum/#!forum/hue-hackers>
 - StackOverflow: <http://stackoverflow.com/questions/tagged/philips-hue>



## License
Copyright 2013-2019. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this library except in compliance with the License.

You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
