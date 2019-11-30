# Rules API

The `rules` API provides a manes of interacting with Rules in the Hue Bridge.

Rules are complex event triggers that consist of a one or more conditions that must be satisfied, which when they are
will trigger one or more actions for devices connected to the bridge.

The Actions can consist of Group, Light or Sensor state changes.

It is possible to build up some very complex logic/triggering with the use of rules, and with the use of CLIP Sensors 
you can potentially build up some interesting automation scenarios. 


The Rules API interacts with specific [`Rule`](./rule.md) objects from the Bridge.


* [getAll()](#getall)
* [getRule(id)](#getrule)
* [getRuleByName(name)](#getrulebyname)
* [createRule(rule)](#createrule)
* [deleteRule(id)](#deleterule)
* [updateRule(rule)](#updaterule)


## getAll()
The `getAll()` function will obtain all the Rules that are defiend in the Hue Bridge.

```js
api.rules.getAll()
  .then(allRules => {
    // Display the Rules
    allRules.forEach(rule => {
      console.log(rule.toStringDetailed())
    });
  });
```

This function call will resolve to an `Array` of `Rule` objects. 

A complete code sample for this function is available [here](../examples/v3/rules/getAllRules.js).


## getRule()
The `getRule(id)` function will obtain the specified Rule with the given `id`.

* `id`: The id for the rule, or a `Rule` instance to get from the Hue Bridge.

```js
api.rules.getRule(1)
  .then(rule => {
    // Display the Rule
    console.log(rule.toStringDetailed());
  });
```

This function will return a `Rule` object for the specified `id`.

A complete code sample for this function is available [here](../examples/v3/rules/getRule.js).


## getRuleByName()
The `getRuleByName(name)` function will obtain all the `Rule`s from the bridge that have the specified `name`.

* `name`: The name of the `Rule`s to get from the Hue Bridge.

```js
api.rules.getRuleByName('Opened door')
  .then(allRules => {
    // Display the Rules
    allRules.forEach(rule => {
      console.log(rule.toStringDetailed());
    });
  });
```

This function will return an `Array` of `Rule` objects for all of the `Rule`s that matched the specided `name`.

A complete code sample for this function is available [here](../examples/v3/rules/getRuleByName.js).



## createRule()
The `createRule(rule)` function will create a new `Rule` in the Hue Bridge.

* `rule`: The `Rule` that is to be created in the Bridge, consult the documentation on [`Rule` objects](rule.md) to work out how to define a `Rule`

```js
// You need to have created the myRule instance using code before invoking this
api.rules.createRule(myRule)
  .then(result => {
    // Will get an instance of a Rule object 
    console.log(`Created Rule: ${result.toStringDetailed()}`);
  })
  .catch(err => {
    console.error(`Rule was not valid: ${err.message}`);
  });
```

The function will return the created `Rule` object, otherwise will throw an `ApiError`.

_Note: It is not possible to completely validate all the possible combinations of attributes in a `Rule` as to whether or not 
it is valid before trying to create it in the Hue Bridge.
The library will perform a number of checks around eliminating common and obvious issues when building a `Rule`, but 
the ultimate check is made by the bridge, but I have seen some very generic error messages in testing when there are 
issues in the Rule definition._ 

A complete code sample for this function is available [here](../examples/v3/rules/createRule.js).


## deleteRule()
The `deleteRule(id)` function will delete the specified rule from the Bridge.

* `id`: The id for the Rule to remove or the `Rule` instance that you previously obtained from the bridge via a [`getAll()`](#getall) or [`get(id)`](#get) call

```js
api.rules.deleteRule(id)
  .then(result => {
    console.log(`Deleted Rule? ${result}`);
  });
```

The function will return `true` upon successful deletion.

A complete code sample for this function is available [here](../examples/v3/rules/deleteRule.js).



## updateRule()
The `updateRule(rule)` function allows you to modify an existing `Rule` in the Hue Bridge.

* `rule`: The `Rule` that you wish to update, with the modifications already performed on it, this would have been retrieved previously from the Hue Bridge

```js
// The rule instance should have been retrieved and modified before calling this code
api.rules.updateRule(rule)
  .then(result => {
    // show the updated attributes on the rule
    console.log(`Updated Rule Attributes: ${JSON.stringify(result)}`);
  });
```

_Note: The library will not perform checks currently against the existing state of the `Rule` on the Bridge and the provided `Rule`
and will update the `name`, `actions` and `conditions` to match the `rule` state passed in._

The only attributes of an existing `Rule` that you can update currently are:

* `name`: limited to 32 characters, will be truncated if it exceeds this length
* `actions`: The `RuleAction`s for the Rule, all previous values will be overwritten
* `conditions`: The `RuleCondition`s for the Rule, all previous values will be overwritten

The function will return a JSON object consisting of the attributes it updated along with a `Boolean` value if the field was updated:

```js
{
  'name': true,
  'actions': true,
  'conditions': true
}
```