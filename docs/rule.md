# Rule Objects

The Hue Bridge supports Rules to define complex automation activities. The `Rule` object can be built up to support a 
number of `RuleConditions` which when all evaluating to `true` will trigger one or more `RuleActions` to modify states
of Lights, Groups, CLIP Sensors or Schedules.

* [Creating a New Rule](#creating-a-rule)
* [Rule Properties](#rule-properties)
    * [id](#id)
    * [name](#name)
    * [owner](#owner)
    * [lasttriggered](#lasttriggered)
    * [timestriggered](#timestriggered)
    * [status](#status)
    * [recycle](#recycle)
    * [conditions](#conditions)
    * [actions](#actions)
    * [toString()](#tostring)
    * [toStringDetailed()](#tostringdetailed)
* [addCondition()](#addconditioncondition)
* [removeConditionAt(idx)](#removeconditionatidx)
* [clearConditions()](#clearconditions)
* [addAction()](#addactionaction)
* [removeActionAt(idx)](#removeactionatidx)
* [clearActions()](#clearactions)


## Creating a Rule

You can create a `Rule` by using the `new` operator.

```js
const Rule = require('node-hue-api').v3.rules.Rule;
const myRule = new Rule();
```

All Rules MUST have at least one `RuleCondition` and `RuleAction` associated with them for the Bridge to consider them
valid. You can add these to a `Rule` using the [`addAction(action)`](#addactionaction) and [`addCondition(condition)`](#addactionaction) 
functions on the `Rule`.

Consult the [`RuleAction`](./ruleAction.md) and [`RuleCondition`](./ruleCondition.md) documentation for creating the 
various types of Actions and Conditions for a Rule.


## Rule Properties

* [id](#id)
* [name](#name)
* [owner](#owner)
* [lasttriggered](#lasttriggered)
* [timestriggered](#timestriggered)
* [status](#status)
* [recycle](#recycle)
* [conditions](#conditions)
* [actions](#actions)
* [toString()](#tostring)
* [toStringDetailed()](#tostringdetailed)

### id
Get the `id` for the Scene.
* `get`

### name
Get/Set a name for the Scene.
* `get`
* `set`

### owner
Gets the owner of the Scene.
* `get`

### lasttriggered
Gets the last triggered time for the Rule.
* `get`

### timestriggered
Gets the number of times that the Rule has been triggered
* `get`

### status
Gets the status of the Rule, which can be `enabled`, `resourcedeleted` and possibly other states, but these are not
documented via the Hue API.
* `get`

### recycle
Get/Set the `recyle` attribute of the Rule. This is used to flag scenes that can be automatically deleted by the bridge.
If the `recycle` state is set to `false` the Hue bridge will keep the scene until an application removes it.
* `get`
* `set`

### conditions
Gets the `RuleCondition`s that are set on the Rule. These are the conditions that all must evaluate to `true` to 
trigger the rule's `RuleAction`s.
* `get` 

### actions
Gets the `RuleAction`s that are set on the Rule. These are the actions that will be triggered if the all the `RuleCondtion`s
evaluate to `true`.
* `get`


### toString()
The `toString()` function will obtain a simple `String` representation of the Scene.


### toStringDetailed()
The `toStringDetailed()` function will obtain a more detailed representation of the Scene object.


## addCondition(condition)
The `addCondition(condition)` function will add a new `RuleCondition` to the existing conditions on the `Rule`.

* `condition`: The new `RuleCondition` to be added.

Consult the [RuleCondition](./ruleCondition.md) documentation on creating a `RuleCondition` instance.
 

## removeConditionAt(idx)
The `removeConditionAt(idx)` function will remove the `RuleCondition` that is at the specified index `idx` from the Array 
of `RuleConditions` on the `Rule`.

* `idx`: The index of the `RuleCondition` in the Rule to remove.


## clearConditions()
The `clearConditions()` function will reset all the conditions on the Rule to an empty `Array`. You will need to add at
least one `RuleCondition` after do this for the Rule to be valid.


## addAction(action)
The `AddAction(action)` function will add a new `RuleAction` to the existing actions on the `Rule`.

* `action`: The new `RuleAction` to be added.

Consult the [RuleAction](./ruleAction.md) documentation on creating a `RuleAction` instance.

## removeActionAt(idx)
The `removeActionAt(idx)` function will remove the `RuleAction` at the specified `idx` index value from the 
`RuleActions`  on the `Rule`.

* `idx`: The index of the `RuleAction` in the Rule to remove.


## clearActions()
The `clearActions()` function will reset all the actions on the Rule to an empty `Array`. You will need to add at least 
one `RuleAction` after this for the Rule to be valid.