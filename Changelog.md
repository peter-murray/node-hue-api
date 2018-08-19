# Change Log

## 2.4.3
- Adding sensor API endpoints for `setSensorName()` `sensorStatus()` and `sensors()` from PR #121

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
