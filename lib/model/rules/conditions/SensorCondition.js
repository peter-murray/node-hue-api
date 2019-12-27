'use strict';

const RuleCondition = require('./RuleCondition')
  , Sensor = require('../../sensors/Sensor')
  , ApiError = require('../../../ApiError')
  , conditionOperators = require('./operators/index')
;

module.exports = class SensorCondition {

  constructor(sensor) {
    if (!(sensor instanceof Sensor)) {
      throw new ApiError('You must provide a valid Sensor object');
    }
    this._sensor = sensor;
    this._sensorStateAttribute = null;
    this._operator = null;
    this._value = null;
  }

  when(attribute) {
    const self = this;

    validateSensorAttribute(this._sensor, attribute);
    this._sensorStateAttribute = attribute;

    return new SelectOperator(self);
  }

  getRuleCondition() {
    validateState(this);

    const data = {
      address: `/sensors/${this._sensor.id}/state/${this._sensorStateAttribute}`,
      operator: this._operator,
      value: this._value
    };
    return new RuleCondition().populate(data);
  }

  _setOperator(value) {
    this._operator = conditionOperators.getOperator(value);
    return this;
  }

  _setRequiredValue(value) {
    if (value === null || value === undefined) {
      throw new ApiError('A value is required when using this operator');
    }

    this._value = value;
    return this;
  }
};


function validateState(condition) {
  let message = null;

  if (!condition._sensor) {
    message = 'a sensor is required';
  } else if (!condition._sensorStateAttribute) {
    message = 'a state of the sensor is required';
  } else if (!condition._operator) {
    message = 'an operator for the sensor state value is required';
  }
  //TODO some operators require a value, others do not, might need to validate that here too, should have a function on the operator to check is a value is required

  if (message) {
    throw new ApiError(`Invalid Condition, ${message}`);
  }
}


function validateSensorAttribute(sensor, attributeName) {
  if (!sensor) {
    throw new ApiError('No Sensor provided to get attribute from');
  }

  const allAttributes = sensor.getStateAttributeNames();
  if (allAttributes.indexOf(attributeName) > -1) {
    return attributeName;
  } else {
    throw new ApiError(`Attribute '${attributeName}' not found in sensor attributes, ${JSON.stringify(allAttributes)}`);
  }
}


class SelectOperator {

  constructor(sensorCondition) {
    this._sensorCondition = sensorCondition;
  }

  equals(val) {
    const sensorCondition = this._sensorCondition;

    sensorCondition._setOperator('eq');
    // bool or int
    sensorCondition._setRequiredValue(val);
    return sensorCondition;
  }

  greaterThan(val) {
    const sensorCondition = this._sensorCondition;

    sensorCondition._setOperator('gt');
    // int
    sensorCondition._setRequiredValue(val);
    return sensorCondition;
  }

  lessThan(val) {
    const sensorCondition = this._sensorCondition;

    sensorCondition._setOperator('lt');
    // int
    sensorCondition._setRequiredValue(val);
    return sensorCondition;
  }

  changed() {
    const sensorCondition = this._sensorCondition;

    sensorCondition._setOperator('dx');
    return sensorCondition;
  }

  changedDelayed(interval) {
    const sensorCondition = this._sensorCondition;

    sensorCondition._setOperator('ddx');
    sensorCondition._setRequiredValue(interval);
    return sensorCondition;
  }

  stable(interval) {
    const sensorCondition = this._sensorCondition;

    sensorCondition._setOperator('stable');
    sensorCondition._setRequiredValue(interval);
    return sensorCondition;
  }

  notStable(interval) {
    const sensorCondition = this._sensorCondition;

    sensorCondition._setOperator('not stable');
    sensorCondition._setRequiredValue(interval);
    return sensorCondition;
  }

  in(interval) {
    const sensorCondition = this._sensorCondition;

    //start time, only valid for /config/localtime
    sensorCondition._setOperator('in');
    sensorCondition._setRequiredValue(interval);
    return sensorCondition;
  }

  notIn(interval) {
    const sensorCondition = this._sensorCondition;

    // end time, only valid for /config/localtime
    sensorCondition('not in');
    sensorCondition._setRequiredValue(interval);
    return sensorCondition;
  }
}