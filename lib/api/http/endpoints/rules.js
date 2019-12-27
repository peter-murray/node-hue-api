'use strict';

const ApiEndpoint = require('./endpoint')
  , RuleIdPlaceholder = require('../../../placeholders/RuleIdPlaceholder')
  , model = require('../../../model')
  , ApiError = require('../../../ApiError')
  , util = require('../../../util')
;

const RULE_ID_PLACEHOLDER = new RuleIdPlaceholder();

module.exports = {

  getAll: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('/<username>/rules')
    .pureJson()
    .postProcess(createAllRulesResult),

  getRule: new ApiEndpoint()
    .get()
    .acceptJson()
    .uri('<username>/rules/<id>')
    .placeholder(RULE_ID_PLACEHOLDER)
    .pureJson()
    .postProcess(createGetRuleResult),

  createRule: new ApiEndpoint()
    .post()
    .acceptJson()
    .uri('/<username>/rules')
    .pureJson()
    .payload(createRulePayload)
    .postProcess(getCreateRuleResult),

  updateRule: new ApiEndpoint()
    .put()
    .acceptJson()
    .uri('/<username>/rules/<id>')
    .placeholder(RULE_ID_PLACEHOLDER)
    .pureJson()
    .payload(createRuleUpdatePayload)
    .postProcess(util.extractUpdatedAttributes),

  deleteRule: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/rules/<id>')
    .placeholder(RULE_ID_PLACEHOLDER)
    .pureJson()
    .postProcess(validateRuleDeletion),
};


function createAllRulesResult(result) {
  let rules = [];

  Object.keys(result).forEach(function (id) {
    const rule = model.createFromBridge('rule', id, result[id]);
    rules.push(rule);
  });

  return rules;
}

function createGetRuleResult(data, requestParameters) {
  const id = RULE_ID_PLACEHOLDER.getValue(requestParameters);
  return model.createFromBridge('rule', id, data);
}

function validateRuleDeletion(result) {
  if (!util.wasSuccessful(result)) {
    throw new ApiError(util.parseErrors(result).join(', '));
  }
  return true;
}

function createRulePayload(parameters) {
  const rule = parameters.rule;

  if (!rule) {
    throw new ApiError('No rule provided');
  } else if (!model.isRuleInstance(rule)) {
    throw new ApiError('Must provide a valid Rule object');
  }

  const body = rule.getHuePayload();
  validateRulePayloadForBridge(body);

  return {
    type: 'application/json',
    body: body
  };
}

function createRuleUpdatePayload(parameters) {
  const rule = parameters.rule;

  if (!rule) {
    throw new ApiError('No rule provided');
  } else if (!model.isRuleInstance(rule)) {
    throw new ApiError('Must provide a valid Rule object');
  }

  const hueRule = rule.getHuePayload()
    , body = {
      name: hueRule.name,
      conditions: hueRule.conditions,
      actions: hueRule.actions
    };

  validateRulePayloadForBridge(body);

  return {
    type: 'application/json',
    body: body
  };
}

function getCreateRuleResult(result) {
  const hueErrors = util.parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating rule: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: result[0].success.id};
}

function validateRulePayloadForBridge(rule) {
  if (!rule.name) {
    throw new ApiError('A name must be provided for the Rule');
  }

  if (!rule.conditions || rule.conditions.length < 1) {
    throw new ApiError('A Rule must have at least one condition');
  }

  if (!rule.actions || rule.actions.length < 1) {
    throw new ApiError('A Rule must have at least one action');
  }
}