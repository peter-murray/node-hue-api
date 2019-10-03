'use strict';

const ApiEndpoint = require('./endpoint')
  , RuleIdPlaceholder = require('../placeholders/RuleIdPlaceholder')
  , Rule = require('../../../bridge-model/rules/Rule')
  , ApiError = require('../../../ApiError')
  , util = require('../util')
;

module.exports = {

  getAll: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/rules')
    .pureJson()
    .postProcess(buildRuleResults),

  getRule: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('<username>/rules/<id>')
    .placeholder(new RuleIdPlaceholder())
    .pureJson()
    .postProcess(buildRuleResult),

  createRule: new ApiEndpoint()
    .post()
    .acceptJson()
    .uri('/<username>/rules')
    .pureJson()
    .payload(buildRulePayload)
    .postProcess(buildCreateRuleResult),

  updateRule: new ApiEndpoint()
    .put()
    .acceptJson()
    .uri('/<username>/rules/<id>')
    .placeholder(new RuleIdPlaceholder())
    .pureJson()
    .payload(buildRuleUpdatePayload)
    .postProcess(util.extractUpdatedAttributes),

  deleteRule: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/rules/<id>')
    .placeholder(new RuleIdPlaceholder())
    .pureJson()
    .postProcess(validateRuleDeletion),
};



function buildRuleResults(result) {
  let rules = [];

  Object.keys(result).forEach(function (id) {
    rules.push(new Rule(result[id], id));
  });

  return rules;
}

function buildRuleResult(data, requestParameters) {
  if (requestParameters) {
    return new Rule(data, requestParameters.id);
  } else {
    return new Rule(data);
  }
}

function validateRuleDeletion(result) {
  if (!util.wasSuccessful(result)) {
    throw new ApiError(util.parseErrors(result).join(', '));
  }
  return true;
}

function buildRulePayload(parameters) {
  const rule = parameters.rule;

  if (!rule) {
    throw new ApiError('No rule provided');
  } else if (!(rule instanceof Rule)) {
    throw new ApiError('Must provide a valid Rule object');
  }

  // Recycle can only be set upon creation
  const body = {
    name: clipName(rule.name),
    recycle: rule.recycle || false,
  };

  body.conditions = rule.getConditionsPayload();
  body.actions = rule.getActionsPayload();

  if (!body.name) {
    throw new ApiError('A name must be provided for the Rule');
  }

  if (!body.conditions || body.conditions.length < 1) {
    throw new ApiError('A Rule must have at least one condition');
  }

  if (!body.actions || body.actions.length < 1) {
    throw new ApiError('A Rule must have at least one action');
  }

  return {
    type: 'application/json',
    body: body
  };
}

function buildRuleUpdatePayload(parameters) {
  const rule = parameters.rule;

  if (!rule) {
    throw new ApiError('No rule provided');
  } else if (!(rule instanceof Rule)) {
    throw new ApiError('Must provide a valid Rule object');
  }

  const body = {
    name: clipName(rule.name)
  };

  body.conditions = rule.getConditionsPayload();
  body.actions = rule.getActionsPayload();

  if (!body.conditions || body.conditions.length < 1) {
    throw new ApiError('A Rule must have at least one condition');
  }

  if (!body.actions || body.actions.length < 1) {
    throw new ApiError('A Rule must have at least one action');
  }

  return {
    type: 'application/json',
    body: body
  };
}

function buildCreateRuleResult(result) {
  const hueErrors = util.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating rule: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: result[0].success.id};
}

//TODO should look to use parameters on the Rule instance to capture this earlier
function clipName(name) {
  if (name) {
    if (name.length > 32) {
      return name.substring(0, 31);
    }
  }
  return name;
}