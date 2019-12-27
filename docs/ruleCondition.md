# RuleCondition

A `RuleCondition` is an object that defines a condition that can be used to trigger a `Rule` in the Hue Bridge.

There are a number of different types of RuleConditions that can be built and to aid in this, the API provides a 
fluent interface for building up the various `RuleCondition`s for `Rule`s.


* [Condition Builders](#condition-builders)
* [SensorCondition Builder](#sensorcondition-builder)
    * [when(attribute)](#whenattribute)
        * [Sensor Attribute Operator](#sensor-attribute-operator)
    * [getRuleCondition()](#getrulecondition)
    * [Examples](#sensorcondition-examples)
* [GroupCondition Builder](#groupcondition-builder)
    * [when()](#when)
        * [Group Attribute Selector](#group-attribute-selector)
        * [Group Attribute Operator](#group-attribute-operator)
    * [getRuleCondition()](#getrulecondition-1)
    * [Examples](#groupcondition-examples)


## Condition Builders

A `RuleCondition` can be built using the `v3.model.ruleCconditions` Object, currently this allows for the creation of 
conditions for `Sensors` and `Groups`.


## SensorCondition Builder

A `SensorCondition` builder can be created using the `v3.model.ruleConditions.sensor(sensor)` function.

* `sensor`: The `Sensor` obtained from bridge via the API that you wish to use in a condition.

You have to provide a `Sensor` object from the Hue Bridge (you can use the [Sensors API](./sensors.md) to get an 
instance of the one you desire).

```js
const v3 = require('node-hue-api').v3
  , conditions = v3.model.ruleConditions;

const mySensor = await v3.sensors.get(sesnorId);
const mySensorCondition = conditions.sensor(mySensor);
// Then build the condition using the functions/properties on the SensorConditions
```

### when(attribute)
The `whne(attribute)` function specifies the target attribute of the sensor to set the condition on. The attributes vary
on the Sensors based on what type of sensor that it is.

* `attribute`: The String name of the attribute for the `Sensor` that you are applying the condition to

For example a `CLIPGenericFlag` has an attribute of `flag` that is a `boolean` flag that can be monitored.

This function will return an `Object` that allows you to select the appropriate `RuleOperator` by invoking an appropriate 
function, see below for more details.

#### Sensor Attribute Operator

* `equals(val)`: The specified attribute equals `val`, compatible with `boolean` and `int` attributes
* `greaterThan(val)`: The specified attribute is greater than `val`, compatible with `int` attributes
* `lessThan(val)`: The specified attribute is less than `val`, compatible with `int` attributes
* `changed()`: The specified attribute has changed
* `changedDelayed(val)`: The specified attribute changed within a `val` interval period (a delayed change)
* `stable(val)`: The specified attribute has not changed in a specified `val` interval
* `notStable(val)`: The specified attribute has changed in a specified `val` interval
* `in(val)`: Current time is within the specified interval, triggered on starttime
* `notIn(val)`: Current time is not with the specified interval, triggered on endtime

Any of these functions when called will return the `SensorCondition` object that you started with.

### getRuleCondition()
The `getRuleCondition()` function will generate the `RuleCondition` instance that has been built from the various 
calls that you have made via the fluent API for the builder.

This will return a `RuleCondition` if the provided configuration is valid. Otherwise it will throw and `ApiError`.

Note: Not every aspect of the condition can be checked at this point, and as such the final validation will be performed
via the Hue Bridge when the `RuleCondition` is saved/updated on a `Rule`.


### SensorCondition Examples

The following are code examples of setting up various SensorConditions.

Create a `RuleCondition` that will trigger on a `flag` attribute change on a CLIPGenericFlag Sensor (i.e. trigger on every change): 
```js
const v3 = require('node-hue-api').v3
  , conditions = v3.model.ruleConditions
;

// Create a SensorCondition that will trigger on a flag attribute change for the CLIPGenericFlag Sensor:
const sensorCondition = conditions.sensor(aFlagSensor).when('flag').changed();
const ruleCondition = sensorCondition.getRuleCondition();
```

Create a RuleCondition that will trigger when the `flag` attribute changes to `true` for a CLIPGenericFlag Sensor:
```js
const v3 = require('node-hue-api').v3
  , conditions = v3.model.ruleConditions
;

// Create a SensorCondition that will trigger on the flag attribute being true CLIPGenericFlag Sensor:
const sensorCondition = conditions.sensor(aFlagSensor).when('flag').equals(true);
const ruleCondition = sensorCondition.getRuleCondition();
```


## GroupCondition Builder

A `GroupCondition` builder can be created using the `v3.model.ruleConditions.group(id)` function.

* `id`: The id for the group (or the Group instance) that you wish to build the condition on

You can pass in either the id value for the group or a `Group` instance from the API to start building the condition.

### when()
The `when()` function obtains the Attribute selector for the group which allows you to select the desired Group attribute
that the condition will be built from.

#### Group Attribute Selector
There are only two attributes for a group that can be used to build a condition on which are exposed via the following
functions:

* `allOn()`: Boolean attribute that is `true` when ALL the lights in a group are on
* `anyOn()`: Boolean attribute that is `true` when ANY of the lights in a group are on

Either of these functons will return an Operator Selector object that will allow you to set the operator (and possible value)
on the condition that you are building.

#### Group Attribute Operator  

* `equals(val)`: The attribute equals the specified `val`
* `changed()`: The attribute is changed
* `changedDelayed(val)`: The attribute is a delayed changed within a period `val`
 
Any of these functions will return the `GroupCondition` that you started with. 
 
 
### getRuleCondition()
The `getRuleCondition()` function will generate the `RuleCondition` instance that has been built from the various 
calls that you have made via the fluent API for the builder.

This will return a `RuleCondition` if the provided configuration is valid. Otherwise it will throw and `ApiError`.

Note: Not every aspect of the condition can be checked at this point, and as such the final validation will be performed
via the Hue Bridge when the `RuleCondition` is saved/updated on a `Rule`.

### GroupCondition Examples

The following are code examples of setting up various GroupConditions.

Create a `GroupCondition` that will trigger when any light is on in a group: 
```js
const v3 = require('node-hue-api').v3
  , conditions = v3.model.ruleConditions
;

// Create a SensorCondition that will trigger on a flag attribute change for the CLIPGenericFlag Sensor:
const groupCondition = conditions.group(groupId).when().anyOn().equals(true);
const ruleCondition = groupCondition.getRuleCondition();
```
