# Light States

There are three variations of the `LightState` object that are used by different parts of the API:

* [`LightState`](#lightstate) for interacting with `Light`s directly
* [`SceneLightState`](#scenelightstate) for interacting with `Scene` Lights
* [`GroupLightState`](#grouplightstate) for interacting with `Group` Lights

These Light State objects all share common base properties and then have some specialized functionality as required by 
the underlying Hue Bridge API.

* [Creating a LightState](#creating-a-lightstate)
* [Common LightState Properties](#common-lightstate-properties)
* [LightState](#lightstate)
* [SceneLightState](#scenelightstate)
* [GroupLightState](#grouplightstate)


## Creating a LightState
To create any one of the variations of `LightState`s you can import them using:

```js
// LightState fo r interacting with Lights
const LightState = require('node-hue-api').v3.lightStates.LightState;

// LightState for interacting with Scene Lights
const SceneLightState = require('node-hue-api').v3.lightStates.GroupLightState;

// LightState for interacting with Group Lights
const GroupLightState = require('node-hue-api').v3.lightStates.GroupLightState;
``` 

Once you have the desired LightState implementation, you can build a light state using parameters specific to that 
Light State, for example:

```js
const LightState = require('node-hue-api').v3.lightStates.LightState;

const myLightState = new LightState();

// Do stuff with myLightState
myLightState
  .on()
  .white(153, 100);
```


The `LightState` object is a convenience object to aid in building up a valid LightState that can be applied to a Light.


## Common LightState Properties

All implementations of Light State objects have these properties/functions.

All of the Light State functions that set values on the state object will return the Light State object itself, allowing 
for chaining of function calls to build up the light state in a more fluent manner.

For example to create and then populate a `LightState` with the desired state:
```js
myLightState = new LightState()
  .on(true)
  .brightness(50)
  .saturation(65)
  .alertShort();
```


* [reset()](#reset)
* [getPayload()](#getpaylaod)
* [populate()](#populate)
* [on(value)](#on)
* [off()](#off)
* [bri(value)](#bri)
    * [brightness(value)](#brightness)
* [hue(value)](#hue)
* [sat(value)](#sat)
    * [saturation(value)](#saturation)
* [xy(x, y)](#xy)
* [ct(value)](#ct)
* [alert(value)](#alert)
    * [alertNone()](#alertnone)
    * [alertShort()](#alertshort)
    * [alertLong()](#alertlong)
* [bri_inc(value)](#briinc)
* [sat_inc(value)](#satinc)
* [hue_inc(value)](#hueinc)
* [ct_inc(value)](#ctinc)
* [xy_inc(value)](#xyinc)
* [effect(value)](#effect)
    * [effectColorLoop()](#effectcolorloop)
    * [effectNone()](#effectnone)
* [transitiontime(value)](#transitiontime)
    * [transition(value)](#transition)
    * [transitionInMillis(value)](#transitioninmillis)
    * [transitionSlow(value)](#transitionslow)
    * [transitionFast(value)](#transitionfast)
    * [transitionInstant(value)](#transitioninstant)
    * [transitionDefault(value)](#transitiondefault)




### reset()
The function `reset()` will clear all the existing settings on a LightState.


### getPayload()
The function `getPayload()` will transform the LightState settings into a payload JSON object that the Hue Bridge can set.

This function can be useful to capture a snapshot of the current settings in a `LightState`.

You should not need to call this yourself as the API will perform the necessary conversions using the targeted light device
before passing the payload to the Hue Bridge.

_Note, this function is not chainable as it returns a JSON payload for the state._


### populate()
The function `populate(data)` will populate the state values of the `LightState` object using the `data` object it is 
called with.

For each property key in the `data` object that is matched to a valid state property in the LightState, the corresponding
value from the `data` object will be set.

For example calling this function with a `data` object of the form:

```json
{
  "on": true,
  "ct": 153,
  "some_other_value": 100
}
```

Will result in the matched state values of `on` and `ct` being set to `true` and `153` respectively. The value 
`some_other_value` in the `data` object will be ignored.

This function can be used along with `getPayload()` to copy an existing `LightState` object using the following code:
```js
const myLightState = new LightState().on.ct(200);

// Create a copy of myLightState
const copiedLightState = new LightState();
copiedLightState.populate(myLightState.getPayload());
```


### on()
The `on(value)` function will set the state to the boolean value of `value`, or if `value` is not specified, will 
implicitly set a value of `true`.

* `value`: The on state of the light, `true` or not specified for on and `false` for off.


### off()
The function `off()` is a convenience function that will set the Light state to the equivalent of `on(false)`.


### bri()
The function `bri(value)` will set the `bri` attribute to `value`.

* `value`: the brightness value to set the light to. Brightness is a scale from `1` (the minimum the light is capable of) to `254` (the maximum).

_Note: a brightness of `1` is not off._


### brightness()
The `brightness(value)` function will set a brightness percentage value for the light.

* `value`: A percentage value for the brightness between `0` and `100`. _Note that `0%` will correspond to a bri value of `1`, which is not off_.


### hue()
The `hue(value)` function will set a hue value for the light.

* `value`: The hue value is a wrapping value between `0` and `65535`. Both `0` and `65535` are red, `25500` is green and `46920` is blue 


### sat()
The `sat(value)` function will set a saturation value for the light.

* `value`: the saturation of the light. `0` is the least saturated (white) and `254` is the most saturated (colored)


### saturation()
The `saturation(value)` function will set a saturation as a percentage value.

* `value`: The percentage for the saturation between `0` and `100`.


### xy()
The `xy(x, y)` function will set an x,y cooridinate in the CIE color space.

* `x`: x cooordinate between `0` and `1`
* `y`: y coorordinate between `0` and `1`

_Note: You can pass the xy value in as a `Array` as well, e.g. `xy([x, y])`._

If you pass in values outside the CIE color space for the target light, the closest color to the coordinates will be 
chosen by the Hue Bridge.


### ct()
The `ct(value)` function will set the Mired color temperature for the light.

* `value`: The Mired color temperature, between `153` (6500K) and `500` (2000K) 


### bri_inc()
The `bri_inc(value)`, increments or decrements the value of the brightness. The `bri_inc` is ignored if the `bri` attribute is provided.

* `value`: An increment or decrement value between `-254` and `254`. A value of `0` stops any ongoing transition.

### sat_inc()
The `sat_inc(value)`, increments or decrements the value of the saturation. The `sat_inc` is ignored if the `sat` attribute is provided.

* `value`: An increment or decrement value between `-254` and `254`. A value of `0` stops any ongoing transition.


### hue_inc()
The `hue_inc(value)`, increments or decrements the value of the brightness. The `hue_inc` is ignored if the `hue` attribute is provided.

* `value`: An increment or decrement value between `-65534` and `65534`.

_Note: the hue value is a wrapped attribute in the bridge. This means once the increment/decrement value is applied, if 
it is out of the hue range of `0` to `65535` the result will wrap, e.g. an existing hue value of `65535` incremented by
`1` will wrap to `0`._


### ct_inc()
The `ct_inc(value)` function increments or decrements the value of the `ct`. `ct_inc` is ignored if the `ct` attribute is provided.

* `value`: An increment or decrement value between `-65534` and `65534`. A value of `0` stops any ongoing transition.


### xy_inc()
The `xy_inc(x_inc, y_inc)` function will increment or decrement an existing x,y cooridinate in the CIE color space. The `xy_inc` 
attribute is ignored if an `xy` value is set.

* `x`: x increment or decrement between `-0.5` and `0.5` setting a value of `0` will stop any ongoing transition
* `y`: y increment or decrement `-0.5` and `0.5` setting a value of `0` will stop any ongoing transition

_Note: You can pass the xy value in as a `Array` as well, e.g. `xy_inc([x_inc, y_inc])`._

If you pass in values outside the CIE color space for the target light, the closest color to the coordinates will be 
chosen by the Hue Bridge.


### effect ()
The `effect(value)` will set the effect on the light.

* `value`: The effect to set which can be `colorloop` or `none`. Setting `colorloop` will cycle through all the hues 
    that the light supports using the existing brightness and saturation settings.

_Note: setting this to `none` will clear any looping._


### effectColorLoop()
The `effectColorLoop()` function will set an `effect` of `colorloop` for the light.


### effectNone()
The `effectNone()` function will set an `effect` of `none` for the light.



### transitiontime()
The `transitiontime(value)` will set the duration of any transition from the lights current state to the new state.

* `value`: An integer value as a multiple of `100ms`, e.g. `4` corresponds to `400ms` and `10` to `1 second`.


### transition()
The `transition(value)` function will set the duration of any transition from the lights current stat to a new state in 
milliseconds.

* `value`: The value in milliseconds for the transition, e.g. `4000` for `4000ms`


### transtionInMiilis()
The `transition(value)` function will set the duration of any transition from the lights current stat to a new state in 
milliseconds.

* `value`: The value in milliseconds for the transition, e.g. `4000` for `4000ms`


### transitionSlow()
The `transitionSlow()` function will set a slow transition for the light state change of `800ms`.


### transtionFast()
The `transitionFast()` function will set a fast transition for the list state change of `200ms`


### transtionInstant()
The `transitionInstant()` function will set an instance transition time of `0ms`.


### transitionDefault()
The `transitionDefault()` function will set the Bridge default transition time of `400ms`.


### alert()
The `alert(value)` function will allow you to set a temporary alert state on the light.

* `value`: One of `none`, `select` (one breathe cycle), `lselect` (breathe cycles for 15 seconds or until cleared using `none` alert state).

_Note: you are not required to reset this state to `none` unless you want to stop the current state. Also the light will 
report the previously set value for this when retrieved, which is not necessarily the current state._

### alertNone()
The `alertNone()` function will clear the current `alert` state, setting it to `none`.

### alertShort()
The `alertShort()` function will set the current `alert` state to `select`.

### alertLong()
The `alertLong()` function will set the current `alert` state to `lselect`.








## LightState

`LightState` is used for defining a Light State that can be used directly on a `Light` instance via the [`lights` api](./lights.md).

In addition to the [common properties](#common-lightstate-properties) for a Light State it also has:

* [white(temp, bri)](#white)
* [hsb(hue, saturation, brightness)](#hsb)
* [hsl(hue, saturation, luminosity)](#hsl)
* [rgb(red, green, blue)](#rgb)

### white()
The `white(temp, bri)` function will set the state to white, using the provided `temp` and `brightness` values.

* `temp` is the `ct` value also known as the Mired color temperature and can be set to a value between `153` and `500` 
    (corresponding to 6500K and 2000K respectively). This is the same as [ct()](#ct)
* `bri` is the brightness expressed as a percentage from `0` to `100`. Note, `0%` does not mean off in this case, it will correspond to 
    the lowest bri value for the light. This is the same as [breightness()](#brightness)


### hsb()
The `hsb(hue, saturation, brightness)` function will set an `hsb` value on the light.

* `hue`: is the hue value expressed as a degree value between `0` and `360`.
* `saturation`: is the saturation expressed as a percentage from `0` to `100`. This is the same as [saturation()](#saturation)
* `brightness` is the brightness expressed as a percentage from `0` to `100`. Note, `0%` does not mean off in this case, it will correspond to 
    the lowest bri value for the light. This is the same as [breightness()](#brightness)


### hsl()
The `hsl(hue, saturation, luminosity)` function will set an `hsl` value on the light.

* `hue`: is the hue value expressed as a degree value between `0` and `360`.
* `saturation`: is the saturation expressed as a percentage from `0` to `100`. This is the same as [saturation()](#saturation)
* `luminosity`: is the luminsoty value between `0` and `100`.

_Note: that there is conversion in play with this value, so it is an approximation to what the light can display._


### rgb()
The `rgb(red, green, blue)` will set an RGB value on the light.

* `red`: the red value between `0` and `255`
* `green`: the green value between `0` and `255`
* `blue`: the blue value between `0` and `255`

_Note: You can pass the rgb value in as a `Array` as well, e.g. `rbg([255, 0, 0])`._


_Note: That these values are converted in to a value that the light can display, as such, you might not get a perfect match
to your expected RGB color. This is limited by what colors that the light can actually support and there is a lot of 
mathematics going on in the background to map this to the light color space._



## SceneLightState

The `SceneLightState` is to be used for setting LightStates of Lights contained within a [`Scene`](./scene.md). This 
state object only has the [common properties](#common-lightstate-properties)



## GroupLightState

The `GroupLightState` is to be used with the triggering of LightStates of Lights in a `Group`.

In addition to the [common properties](#common-lightstate-properties) for a Light State it also has:

* [scene(name)](#scene)


### scene()
The `scene(value)` function allows for the scene name to be set on the `Group` that you wish to trigger.

* `name`: A string for the identifier of the scene to trigger for the `Group`.

When using this property of a `GroupLightState` to set a state on a `Group`, you will get the intersection of the lights
associated with the `Group` and the target `Scene`'s lights attribute.






