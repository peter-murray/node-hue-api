'use strict';

const v3 = require('../../../index').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const LightState = v3.lightStates.LightState;

// Set this to your username for the bridge
const USERNAME = require('../../../test/support/testValues').username;

// The target Light ID of the light to flash when the Rule is triggered
const LIGHT_ID = 1;

//
// Creating a Rule requires it to have at least one RuleCondition and one RuleAction which are built against
// existing objects in the Hue Bridge.
//
// The following will create a very contrived Rule that will trigger when the implicit group '0', that is the group that
// is always present on all bridges representing all the lights, has any lights turned on.
//
// The Action that is performed is that the first light in the system, light id = LIGHT_ID will perform a short alert
// sequence before returning its original state.
//

v3.discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    const rule = new v3.model.createRule();
    rule.name = 'node-hue-api test rule';
    rule.recycle = true;

    // All lights group has any light turn on
    rule.addCondition(v3.model.ruleConditions.group(0).when().anyOn().equals(true));

    // The light with id LIGHT_ID
    rule.addAction(v3.model.ruleActions.light(LIGHT_ID).withState(new LightState().alertShort()));

    return api.rules.createRule(rule)
      .then(rule => {
        // Display the details for the rule we created
        console.log(`Created a Rule\n ${rule.toStringDetailed()}`);

        // Now remove it, disable this line if you want the rule to remain after running this code
        return api.rules.deleteRule(rule.id);
      });
  })
  .catch(err => {
    console.error(err);
  })
;