# LightState
The `LightState` object is a convenience object to aid in building up a valid LightState that can be applied to a Light.


## Creating a LightState
To create a LightState object you can perform the following:

```js
const LightState = require('node-hue-api').v3.lightstates.LightState;

const myLightState = new LightState();

// Do stuff with myLightState
myLightState
  .on()
  .white(153, 100);
```

The LightState object has a number of utility functions that will allow you to build up a state for a light. Each function
will return the original LightState, so that these can be chained to very simply build up a complex light state.

The functions available for constructing a LightState are:

* [reset()](#reset)
* [getPayload()](#getpaylaod)
* [populate()](#populate)

* [on](#on)
* [off](#off)
* []()
* []()
* []()
* []()
* []()


* [white(temp, bri)](#white)


## reset()
The function `reset()` will clear all the existing settings on a LightState.


## getPayload()
The function `getPayload()` will transform the LightState settings into a payload JSON object that the Hue Bridge can set.

This function can be useful to capture a snapshot of the current settings in a `LightState`.

You should not need to call this yourself as the API will perform the necessary conversions using the targeted light device
before passing the payload to the Hue Bridge.

_Note, this function is not chainable as it returns a JSON payload for the state._


## populate()
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


## on()
The function `on(on)` will set the state to the boolean value of `on`, or if `on` is not specified, will implicitly set 
a value of `true`.



## off()
The function `off()` is a convenience function that will set the Light state to the equivalent of `on(false)`.



## bri()
The function `bri(value)` will set the `bri` attribute to `value`.

The allowed range of `value` is from `1` to `254`.


## hue()


## sat()


## xy()


## ct()


## effect ()


## transitiontime()



## brightness()



## saturation()



## effectColorLoop()


## effectNone()


## transition()
millis


## transitionSlow()


## transtionFast()


## transtionInstant()


## transtionInMiilis()


## transitionDefault()
4


## alert()


## bri_inc()


## sat_inc()


## hue_inc()


## ct_inc()


## xy_inc()


## alertLong()


## alertShort()


## alertNone()


## white()

`white(temp, bri)` will set the state to white, using the provided `temp` and `brightness` values.

* `temp` is the `ct` value also known as the Mired color temperature and can be set to a value between 153 and 500 
    (corresponding to 6500K and 2000K respectively)
* `bri` is the brightness expressed as a percentage from 0 to 100. Note, 0% does not mean off in this case, it will correspond to 
    the lowest bri value for the light.



## hsb()


## rgb()