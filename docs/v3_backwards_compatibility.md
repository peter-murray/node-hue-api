# v3.x Breaking Changes to Backwards Compatibility

With the release of `v3` version of the `node-hue-api`, backwards compatibility with existing code has been attempted
whilst completely rewriting the underlying code to support new features of JavaScript and removal of out of date 
dependencies.

The new API is available under the `v3` object, `require('node-hue-api').v3` whilst the pre-existing top level objects
have been left in place for backwards compatibility (although now with added nag messages to warn about deprecation).

The older backwards compatibility layer will remain for all `3.x` releases of the library before being removed from the
`4.x` releases.
 
Whilst a lot of work went into providing backwards compatibility, there are some change that could not easily be avoided
or would result in a massive amount of effort to shim them to provide 100% backwards compatibility. These changes are
listed below and are based on the old test suite run against the `3.x` release to identify areas where calling code 
needed to be updated.


# Breaking Changes to existing endpoints

* [discovery](#discovery)
* [description](#description)
* [groups](#groups)
  * [getGroup()](#getGroup)
* [LightState](#LightState)
* [Scenes](#scenes)
  * [createScene()](#createScene)
  * [updateScene()](#updateScene)
* [Schedules](#schedules)
* [Timer](#timer)


## discovery

The old deprecated functions `searchForBridges()` and `locateBridges()` have been removed.


## description

The functions `description()` and `getDescription()` return a different object as the result.


## groups

All Group functions that return objects for the group will have integrer based `id` attributes instead of being `String`s.

### getGroup
The `getGroup()` function no longer returns an object with a `lastAction` attribute.

Attempting to get a group that does not exist, will still error, but the error message will be of a different form. 
Also passing invalid group IDs, that are not integers (or can be converted to one) will fail with a new form or error.  


## LightState

There is a shim in place to allow for the use of the old style LightState functions. This shim will create a new API 
version of a LightState object that the new API functions with.

The purpose of this is to provide a drop in shim to allow older code to work without having to be modified, but you are 
strongly encouraged to utilize the new `LightState` object available using `require('node-hue-api').v3.lightstates.LightState'`
as this removes a number of overloaded function names that were unnecessary from the old API.

There will be some new errors generated when attempting to set values that fall outside the allowed ranges of the light,
e.g. When setting a hue to be < 0.


## Scenes

The old Scene object was more of a Builder pattern object. This has now been replaced with a builder object that builds 
`Scene`s using the new `Scene` object from the updated API. The existing APIs support taking this object so no code 
should need to change.

If you need the actual Scene object that this is creating, then you need to call `getScene()` to get the `Scene` which 
can be used as is with the older API functions.

### createScene
The function `createScene()` used to support the creation of a Scene using an array of light ids and a name. This is no
longer supported due to changes in the underlying Hue API.

### updateScene
The function `updateScene()` used to support an ability to snapshot the existing scene member state by passing a `null` 
scene object to the function invocation. This is no longer supported and you must provided the updated `Scene` object 
with the desired states stored in it. 


## Schedules
The schedules and scheduled events have undergone updates due to changes in the Hue API and adoption of the `v3` objects
underneath.

The `time` attribute is not deprecated in the Philips Hue REST API, so all calls to `time` should be replaced by `localtime`,
which is the new field that replaced `time`.

When building a schedule, there is only limited support for the following time objects:

* `RecurringTime`
* `AbsoluteTime`
* `Timer`

More will be coming in a later update. If you need support for another time type, then raise an issue and it will be 
prioritized.

You cannot pass in any other forms of time currently, so it is not possible to pass in something like `new Date().getTIme()` 
or `Date.now()` anymore (although these were never particularly useful in practice). 

If you want access to the underlying `Schedule` then you will need to call `getSchedule()`, this is not required for the 
API functions, it will handle this automatically.


## Timer
The reference to `timer` has been removed, as it was part of the initial attempt to add some of the scheduling object 
types and was probably not used in practice.

This is now supported by passing a Timer patterned string into a schedule event.