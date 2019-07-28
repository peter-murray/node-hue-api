# Configuration API

The `configuration` API provides a means of interacting with the Hue Bridge configuration. Some of these options do not
require you to have an existing user, as in the creation of a new user account, but most of them do.


* [getAll()](#getAll)
* [get()](#get)
* [update(data)](#update)
* [pressLinkButton()](#pressLinkButton)



## getAll
The `getAll()` function will get the complete configuration and states from the
Hue Bridge.

This includes the bridge configuration and a number of other items:

* `lights`: JSON representation of the Lights in the bridge
* `sensors`: JSON representation of the Sensors in the bridge
* `rules`: JSON representation of all the Rules in the bridge
* `schedules`: JSON representation of the Schedules in the bridge
* `resourcelinks`: Resource links used by the Bridge
* `config`: The configuration of the bridge.

```js
api.configuration.getAll()
  .then(config => {
    // Display the full configuration from the bridge
    console.log(JSON.stringify(config, null, 2));
  })
;
```

A complete code sample is available [here](../examples/v3/configuration/getAllConfiguration.js).



## get
The `get()` function will obtain just the configuration of the Hue Bridge.

The result will be an `Object` with all the configuration options of the Bridge. These change depending upon
the software version of the bridge.

```js
api.configuration.get()
  .then(config => {
    // Display the configuration from the bridge
    console.log(JSON.stringify(config, null, 2));
  })
;
```

A complete code sample is available [here](../examples/v3/configuration/getConfiguration.js).



## update
The `update(data)` function will attempt to update the specified configuration on
the Hue Bridge.

The data parameter is a key value `Object` that contains the keys and associated
values that you wish to set in the Bridge configuration.

To get an up to date list of options (some of which may not be modifiable), check
the result from the `get()` function, as these values change over time when the
Hue Bridge is updated.

If you attempt to set an unmodifiable option, then an `ApiError` will be generated.

```js
api.configuration.update({proxyport: 8080})
  .then(result => {
    console.log(`Updated proxy port? ${result}`);
  })
;
```

The function call will resolve with a `Boolean` indicating the success status.

A complete code sample is available [here](../examples/v3/configuration/update.js).



## pressLinkButton
The `pressLinkButton()` function is an older API call, in later versions the Hue Bridge has disabled the ability
to modify this value via the `configuration` API.

This used to be a way to virtually press the link button. Now for security, you have to actually press the link button on
the Bridge.