import {model} from '@peter-murray/hue-bridge-model';
import { RuleIdPlaceholder } from '../../placeholders/RuleIdPlaceholder';
import { ApiBodyPayload, ApiEndpoint } from './ApiEndpoint';
import { extractUpdatedAttributes, parseErrors, wasSuccessful } from '../../../util';
import { ApiError } from '../../../ApiError';
import { KeyValueType } from '../../../commonTypes';

const instanceChecks = model.instanceChecks

const RULE_ID_PLACEHOLDER = new RuleIdPlaceholder();

type RuleIdResult = {id: string}

const rulesApi = {

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
    .postProcess(extractUpdatedAttributes),

  deleteRule: new ApiEndpoint()
    .delete()
    .acceptJson()
    .uri('/<username>/rules/<id>')
    .placeholder(RULE_ID_PLACEHOLDER)
    .pureJson()
    .postProcess(validateRuleDeletion),
};

export {rulesApi};

function createAllRulesResult(result: KeyValueType): model.Rule[] {
  let rules: model.Rule[] = [];

  Object.keys(result).forEach(function (id) {
    const rule = model.createFromBridge('rule', id, result[id]);
    rules.push(rule);
  });

  return rules;
}

function createGetRuleResult(data: KeyValueType | model.Rule, requestParameters: KeyValueType): model.Rule {
  const id = RULE_ID_PLACEHOLDER.getValue(requestParameters);
  return model.createFromBridge('rule', id, data);
}

function validateRuleDeletion(result: any): boolean {
  if (!wasSuccessful(result)) {
    const parsed = parseErrors(result);
    throw new ApiError(parsed? parsed.join(', '): `Unexpected result: ${JSON.stringify(result)}`);
  }
  return true;
}

function createRulePayload(parameters: KeyValueType): ApiBodyPayload {
  const rule = parameters.rule;

  if (!rule) {
    throw new ApiError('No rule provided');
  } else if (!instanceChecks.isRuleInstance(rule)) {
    throw new ApiError('Must provide a valid Rule object');
  }

  const body = rule.getHuePayload();
  validateRulePayloadForBridge(body);

  return {
    type: 'application/json',
    body: body
  };
}

function createRuleUpdatePayload(parameters: KeyValueType): ApiBodyPayload {
  const rule = parameters.rule;

  if (!rule) {
    throw new ApiError('No rule provided');
  } else if (!instanceChecks.isRuleInstance(rule)) {
    throw new ApiError('Must provide a valid Rule object');
  }

  const hueRule = rule.getHuePayload()
    , body: KeyValueType = {
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

function getCreateRuleResult(result: KeyValueType): RuleIdResult {
  const hueErrors = parseErrors(result); //TODO not sure if this still gets called as the request handles some of this

  if (hueErrors) {
    throw new ApiError(`Error creating rule: ${hueErrors[0].description}`, hueErrors[0]);
  }

  return {id: result[0].success.id};
}

function validateRulePayloadForBridge(rule: KeyValueType): void {
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