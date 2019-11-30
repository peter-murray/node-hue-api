# Light

All Lights on the Bridge are built into a `Light` instance.

The Hue Bridge has multiple types of lights which are:

* `On Off Light`
* `Dimmable Light`
* `Color Light` 
* `Color Temperature Light` 
* `Extended Color Light`  

Each instance of a `Light` will have different properties depending upon their capabilities of the underlying type.





* [Light Properties and Functions](#light-properties-and-functions)
    * [id](#id)
    * [name](#name)
    * [type](#type)
    * [modelid](#modelid)
    * [manufacturername](#manufacturername)
    * [uniqueid](#uniqueid)
    * [productid](#productid)
    * [swversion](#swversion)
    * [swupdate](#swupdate)
    * [state](#state)
    * [capabilities](#capabilites)
    * [coloeGamut](#colorgamut)
    * [getSupportedStates()](#getsupportedstates)
    * [toString()](#tostring)
    * [toStringDetailed()](#tostringdetailed)



## Light Properties and Functions


## id
The id for the light in the Bridge.

* `get`


## name
The name for the light.

* `get`
* `set`

## type
The type of the light.

* `get`

The known types of Lights (there may be more, and also variant of the strings):

    * `On Off Light`
    * `Dimmable Light`
    * `Color Light` 
    * `Color Temperature Light` 
    * `Extended Color Light`  


## modelid
The model id of the light

* `get`

## manufacturername
The manufacturer name of the light.

* `get`

## uniqueid
The unique id of the light in the Hue Bridge.

* `get`

## productid
The product id for the light

* `get`

## swversion
The software version number, if applicable for the light.

* `get`

## swupdate
The software update object for the light.

* `get`

The Object if present for a light (not all support software updates) is of the form:

For a light that can be software updated:
```json
{
  "state": "noupdates",
  "lastinstall": "2019-09-23T22:12:54"
}
```
   
For a light that does not support software updates: 
```json
{
  "state": "notupdatable",
  "lastinstall": null
}
```

## state
The state of the light when it was retrieved from the Hue Bridge.

* `get`

This is an Object representation of a LightState, but is left as a raw Object.


## capabilites
An Object representing all the capabilities of the Light. The details for the capabilities varies depending upon the 
Light product and manufacturer. Older lights may report nothing whereas new Hue lights used for Entertainment Streaming
will report a lot of details in their capabilities.

* `get`

An example of an Extended Color Light capabilities:
```json
"capabilities": {
    "certified": true,
    "control": {
        "mindimlevel": 5000,
        "maxlumen": 250,
        "colorgamuttype": "B",
        "colorgamut": [
            [
                0.675,
                0.322
            ],
            [
                0.409,
                0.518
            ],
            [
                0.167,
                0.04
            ]
        ],
        "ct": {
            "min": 153,
            "max": 500
        }
    },
    "streaming": {
        "renderer": true,
        "proxy": true
    }
}
``` 

## colorGamut
Obtains the matched Color Gamut for the Light. This can be loaded from the Light capabilities object, or
via a matching against the light modelid.

Only lights that support color will report a colorGamut (white lights will not have a color gamut).

* `get`

The result will either be `null` or an Object consisting of `red`, `green` and `blue` keys set to an Object with `x`, `y` values:

```js
{
  red: {x: 0.692, y: 0.308},
  green: {x: 0.17, y: 0.7},
  blue: {x: 0.153, y: 0.048}
}
```


## getSupportedStates()
The function `getSupportedStates()` will return an `Array` of `String` values that are the known states that can be set
on the light.

Typically you would not need to use this, as the `LightState` object would be used to set the LightState on a Light in
the API, but this can be used to help limit the setting that you can build into a LightState in a UI, or 
programmatically.

An example of this for an Extended Color Light is:
```js
[
  "on",
  "bri",
  "hue",
  "sat",
  "effect",
  "xy",
  "ct",
  "alert",
  "colormode",
  "mode",
  "reachable",
  "transitiontime",
  "bri_inc",
  "sat_inc",
  "hue_inc",
  "ct_inc",
  "xy_inc"
]
```

An example for a Dimmable Light is:
```js
[
  "on",
  "bri",
  "alert",
  "mode",
  "reachable",
  "transitiontime",
  "bri_inc"
]
```

## toString()
The `toString()` function will obtain a simple `String` representation of the Light.

e.g.
```text
Light
  id: 10
```

## toStringDetailed()
The `toStringDetailed()` function will obtain a more detailed representation of the Light object.

e.g.
```text
Light
  id: 14
  state: {"on":false,"bri":254,"alert":"select","mode":"homeautomation","reachable":false}
  swupdate: {"state":"noupdates","lastinstall":"2018-12-13T20:43:31"}
  type: "Dimmable light"
  name: "Hallway Entrance"
  modelid: "LWB004"
  manufacturername: "Philips"
  productname: "Hue white lamp"
  capabilities: {"certified":true,"control":{"mindimlevel":2000,"maxlumen":750},"streaming":{"renderer":false,"proxy":false}}
  config: {"archetype":"sultanbulb","function":"functional","direction":"omnidirectional","startup":{"mode":"powerfail","configured":true}}
  uniqueid: "00:17:xx:xx:xx:xx:xx:xx-0b"
  swversion: "5.127.1.26420"
```