# Change Log

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
