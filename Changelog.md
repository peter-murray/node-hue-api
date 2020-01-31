# Change Log

#4.0.5
- Various TypeScript definition fixes including Issue #166.

#4.0.4
- Fixing UPnP lookup results failures, Issue #162.

# 4.0.3
- TypeScript definition updates

## 4.0.2
- Fixing TypeScript definition return types for Groups API, Issue #157
- Adding another Rule status `looperror` to Rule status options, Issue #158

## 4.0.1
- fixes/improvements in TypeScript definitions
- removal of an invalid character in source code of the remote API Issue #155

## 4.0.0
- Deprecated v2 API and shim and modules removed from library

- Introduced rate limiting in the Light and Group set States to be compliant with the Hue API documentation best practices.
    This only has an impact on this library, so it may be possible if you are running other software on your network
    accessing the Bridge, you will still able to overload it. 
    * The whole API is currently limited to 12 requests per second by default (currently not configurable)
    * `lights.setLightState()` is limited to 10 requests per second
    * `groups.setState()` is limited to 1 request per second 

- `v3.discovery.nupnp()` Now returns a different payload as it no longer accesses the XML Discovery endpoint to return 
    the bridge data as this can become unreliable when the bridge is overloaded. See the [documentation](./docs/discovery.md#n-upnpsearch)
    for specifics. 

- `v3.api` removed the `create` function as it was deprecated, use `createRemote()` fro the remote API, `createLocal()` 
    for the local API or `createInsecureLocal()` for non-hue bridges that do not support https connections
    
- `v3.Scene` has been removed, use the following functions to create a new Scene instance: 
    * `v3.model.createLightScene()`
    * `v3.model.createGroupScene()`
    
    This change has also allowed for the separation of the attributes and getter/setters locked down properly based on
    the type of Scene, i.e. Cannot change the lights in a GroupScene (as they are controlled by the Group).
    
- `v3.sensors` has been removed, use `v3.model.createCLIPxxx()` functions instead

- `v3.rules` has been moved into `v3.model`
    * To create a `Rule` use `v3.model.createRule()`
    * To create a `RuleCondition` use `v3.model.ruleConditions.[group|sensor]`
    * To create a `RuleAction` use `v3.model.ruleActions.[light|group|sensor|scene]`
    
- `v3.model` added to support exposing the underlying model objects that represent bridge objects. This module will allow
    you to create all of the necessary objects, e.g. `createGroupScene()`

- Capabilities API:
    * `capabilities.getAll()` now returns a [`Capabilities` object](./docs/capabilities.md#capabilities-object)
    
- Groups API:
    * The following API functions will accept a Light Object as the `id` parameter as well as an integer value:
        * `groups.get(id)`
        * `groups.getGroup(id)`
        * `deleteGroup(id)`
        * `enableStreaming(id)`
        * `disableStreaming(id)`
    * `groups.createGroup(group)` introduced, it expects a pre-configured Group instance created using the model functions:
        * `model.createLightGroup()`
        * `model.createEntertainment()`
        * `model.createRoom()`
        * `model.createZone()`
    * `groups.get(id)` has been deprecated, use `groups.getGroup(id)` instead.
    * `groups.createGroup(name, lights)` has been deprecated, use `groups.createGroup(group)` instead.
    * `groups.createRoom(name, lights, roomClass)` has been deprecated, use `groups.createGroup(group)` instead.
    * `groups.createZone(name, lights, roomClass)` has been deprecated, use `groups.createGroup(group)` instead.
    * `groups.updateAttributes(id, data)` has been deprecated, Use `groups.updateGroupAttributes(group)` instead.
    
- Lights API:
    * `getLightById(id)` is deprecated use `getLight(id)` instead
    * `rename(id, name)` is deprecated, use `renameLight(light)` instead
    * The following API functions will accept a Light Object as the `id` parameter as well as an integer value:
        * `getLight(id)`
        * `getLightById(id)`
        * `getLightAttributesAndState(id)`
        * `getLightState(id)`
        * `setLightState(id, state)`
        * `deleteLight(id)`
    
- Scenes API:
    * `getScene(id)` introduced, can take a scene id or `Scene` instance as the id value
    * `get(id)` has been deprecated, use `getScene(id)` instead
    * `getByName(name)` has been depricated use `getSceneByName(name)` instead
    * `updateScene(scene)` introduced to replace `update(id, scene)` for updating Scenes
    * `update(id, scene)` has been deprecated, will be removed in `5.x`, use `updateScene(scene)` instead
    * `deleteScene(id)` can accept a scene id or a `Scene` object as the `id` parameter
    * `activateScene(id)` can accept a scene id value or a `Scene` object
    * `updateLightState(id, lightId, sceneLightState)` can take an id value or `Scene`/`Light` for the `id` and `lightId` values respectively

- Sensors API:
    * `get(id)` has been depreciated use `getSensor(id)` instead
    * `getSensor(id)` will accept a `Sensor` Object as the `id` or  the integer `id` value as parameter.
    * `updateName(id, name)` has been deprecated, will be removed in `5.x`, use `reanmeSensor(sensor)` instead
    * `renameSensor(sensor)` has been added to allow updating of the name only for a sensor (makes API consistent with `lights` and `sensors`)
    * `getSensorByName(name)` added to get sensors by `name`

- Rules API:
    * The following API functions will accept a Rule Object as the `id` parameter as well as an integer value:
        * `get(id)`
        * `deleteRule(id)`
    * Added `getRuleByName(name)` function to get rules by `name`
    * Rule Actions were common to the new `Schedules`, so have been moved from `v3.model.ruleActions` to `v3.model.actions`. 
        Use of `v3.model.ruleActions` is considered deprecated. 
        
- Schedules API:
    * The schedules API is finally properly implemented, along with all the various Hue Bridge TimePatterns
        * `model.timePatterns` provides an interface with creating the various timePatterns, consult the [documentation](./docs/timePatterns.mc) for details
       
    * The previous `schedules.update(id, schedule)` function has been removed and replaced with `schedules.update(schedule)`. 
        
        _I am fairly sure that the previous version was most likely never used (base on the implmenetation as it would 
        have likely errored). With this knowledge, it was not deprecated and just removed. If you are impacted by this change, please raise an Issue._ 

- ResourceLinks API:
    * New  API interacting with `ResourceLinks` via, `api.resourceLinks`, see [documentation](./docs/resourcelinks.md) for more details.

- Configuration API:
    * `get()` has been deprecated, use `getConfiguration()` instead
    * `update()` has bee depricated, use `updateConfiguration()` instead

- All creation function calls to the bridge will now return the created model object. This change makes it consistent as 
    some calls would return the object, others would return the id but no other data.
    
    This changes return object from the promise on the following calls:
    * `api.rules.createRule()`
    * `api.scenes.createScene()`
    * `api.sensors.createSensor()`

- Type system from the `LightState` definitions is now used in all Bridge Object Models to define the attributes/properties 
    obtained from the Bridge.
    
    This provides a consistent validation mechanism to all bridge related attributes data. As part of this being used in 
    the models, some validation is performed at the time of setting a value instead of waiting on when sending it to the 
    hue bridge (some things still have to wait be sent to the bridge) so the validation is closer to the point of call.

- Added ability to serialize a model object into JSON and then restore it to a corresponding object from the JSON 
    payload. This was requested to aid in server/client side code situations, as the creation of the model objects are 
    not directly exposed in the library by design. Related to issue #132

- Creating Sensors (CLIP variety) has changed as the classes for the sensor objects are no longer directly accessible. 
    All `CLIPxxx` sensors need to be built from the `v3.model.createCLIP[xxx]Sensor()` function for the desired type, 
    e.g. `v3.model.createCLIPGenericStatusSensor()` for a `CLIPGenericStatus` sensor. 
    
    The function call to instantiate the sensors also no longer take an object to set various attributes of the sensor,
    you need to call the approriate setter on the class now to set the attribute, e.g. `sensor.manufacturername = 'node-hue-api-sensor';`
    
- TypeScript definitions added to the library

- Adding more in-depth tests to further increase coverage around types and models, and adding more edge case API level tests

## 3.4.3
- Long term fix for supporting older bridge types and creating new users. Issue #147

## 3.4.2
- Temporary fix for older bridges that do not support the entertainment API. Issue #147

## 3.4.1
- Fixing issue with the lookup for the Hue motion sensor, issue #146

## 3.4.0
- Adding an ability to get an insecure connection to the Hue Bridge as there are some usecases where this library is
    being used against software emulated bridges and not real Hue Bridge hardware, Issue #142
- Deprecated the use of `create()` in favour of more explicit `createRemote()`, `createLocal()` and `createInsecureLocal()`

## 3.3.2
- Fixes issue with 'Dimmable pluginpin unit' lights not being matched to a Dimmable light, Issue #141

## 3.3.1
- Added support of `On/Off` types in lights returned from bridge.

## 3.3.0
- Adding convenience function for activating Scenes on the [Scenes API](./docs/scenes.md#activatescene)

## 3.2.1
- Fixing error in code for getting lights by a name #138

## 3.2.0
- Adding support for Rules API, see [rules documentation](./docs/rules.md) for details

## 3.1.4
- Fixing issues with ListType and using Objects for LightState, Issue #134

## 3.1.3
- Fixing error with setting `transitiontime` in light state, Issue #133

## 3.1.2
- Fixing error in Remote API binding, Issue #131, not passing a Remote Bridge Id

## 3.1.1
- Fixing issue with accept headers typo in endpoints
- Adding debug support for diagnosing issues with local certificate validation on the bridge connection

## 3.1.0
- Added support for the Hue Remote API and the necessary Authentication support for dealing with OAuth Tokens.

## 3.0.0
- Official release of the v3 API

## 3.0.0-alpha
- Complete re-write of the library to remove outdated dependencies and introduce updated JavaScript objects, available
  via the `require('node-hue-api').v3` object.
  
- Provides a mostly backwards compatible interface with `2.x` code bases. 

## 2.4.2
- Fixing documentation issues around transition times #109
- Added `transition_milliseconds` and `transitionTime_milliseconds` functions to complete the pairs between multiples of 100 and real milliseconds

## 2.4.1
- Fixing engine name from `nodejs` to `node`, fixes #104

## 2.4.0
- Adding fix to make library work in Electron, #101
- Updating documentation for invalid users and obtaining configuration #99
- Update dependencies to remove deprecation warnings

## 2.3.0
- Fixing issues with scenes where the `recycle` option has become a required parameter. Fixes #97
- Initial addition of a `sensors` and `getSensors` function for obtaining a list of all sensors paired with the bridge

## 2.2.0
- Adding handling for all scheduled event time formats
- Updated the results for `lights()` and `groups()` to return all information that the bridge provides, e.g. the current
states. Fixes #82
- Adding documentation around making the `2.x` versions work under Node.js 0.10.x

## 2.1.0
- Added `lightStatusWithRGB()` to provide an approximation of the RGB color value of a lamp, issue #77

## 2.0.1
- Changed upper bound on brightness to 254, issue #75

## 2.0.0
- Removed the ability to specify a username when creating a new user, issue #63
- Updated the Schedules API to conform with the latest changes in the Schedules API in the Hue Bridge. This is a breaking
change, refer to the documentation in the README.md for specifics

## 2.0.0-RC1
- Replaced `request` with `axios` due to request having grown massively in size and only a simplified http request
library is required that supports promises
- Updated all dependencies to latest versions
- Scenes API changes to support `1.11` version of the Hue Bridge Software, this produced some breaking changes, read
the API documentation in the README.md for specifics

## 1.2.0
- Fixes issue #60, correcting the `hsl` light state calculations and adding `hsb` light state option
- Fixes issue #57, `parseUri` library removed as there are issues with this when using npm version 3+

## 1.1.2
- Fixes issue #55, upnp searches re-register the exit handler repeatedly causing issues if you use upnp search multiple
times during program execution

## 1.1.1
- Fixes issue #52, respecting the LOCATION value from SSDP lookups

## 1.1.0
- Added support for increment values in light state, issue #54

## 1.0.5
- Fixes issue #46 scene id was missing from body sent to the bridge for activation requests

## 1.0.4
- Fixes issue #45 creating a scene resulted in a NaN id for the scene created

## 1.0.3
- Fixes issue #44 generating an incorrect error when the id for `setLightState()` is not valid

## 1.0.2
- Fixes issue #41 with sending group light states via the LightState object

## 1.0.1
- `lights()` and `getLights()` results now include details of the lights (modelid, type, swversion and uniqueid)

## 1.0.0
- Massive refactoring of `LightState` which is a breaking change from version `0.2.7`
- LightState convenience functions to support simpler creation of new states
- Modified the way that RGB is converted to an XY value for light state objects
- Removed deprecated `HueApi.connect()` function
- Added more convenience functions to `HueApi` to provide multiple language options and make functions
consistent (e.g. `lightState()` and `getLightState()`)
- Added scene API support
- Updated HTTP request library to 2.51.0
- Added timezone retrieval from the bridge
- Greatly increased test case coverage

## 0.2.7
- Added functions `nupnpSearch` and `upnpSearch` for bridge discovery and deprecated old search function references
- Updated the Groups API and documentation to support latest Hue Bridge software version
- `LightGroup 0` name now provided from the bridge, rather than called `All Lights`
- Provided separate functions for the different types of groups that are now possible in Bridge API version 1.4+
- Added advanced option to specify the port number for the bridge
- Added convenience `getVersion` function to obtain software and API versions of the bridge

## 0.2.6
- Fixes a bug introduced in 0.2.5 that would remove the rgb state value from a LightState object thereby making
different to what was originally set if using it in multiple `setLightState()` calls

## 0.2.5
- Fixes for RGB conversion into XY co-ordinates for lamps to give better accuracy compared to previous implementation using HSL

## 0.2.4
- Added ability to configure the timeout when communicating with the Hue Bridge

## 0.2.3
- Updated endpoint for hue discovery to use https
- Swapped out q-io http for request 2.36.0
- Fixed error in the discovery XML processing

## 0.2.1
- Corrected typo in the transitionTime for the parameters to pass the light

## 0.2.0
- Updated to support promises or callbacks for all API methods
- Major refactoring to support API methods as Traits (makes maintaining end points easier and provides hooks for validating schedule commands)
- Expanded test coverage to cover all the exposed API methods (including promises and callbacks)
- Change to http promise invocation to support Trait end points
- ``locateBridges()`` replaced with Phillips API backend call for increased speed
- original 0.1.x version of ``locateBridges()`` changed to ``searchForBridges()``
- Removed the groupId from ``setLightState()`` and introduced a ``setGroupLightState()`` function to support groups
- Added ``searchForNewLights()`` and ``newLights()`` functions to deal with adding and discovering new lights on the Bridge

## 0.1.4
- Working version of API with support for Phillips Hue Bridge Firmware 1.0
- Schedules support implemented
- Works with promises only
