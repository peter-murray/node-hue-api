'use strict';

const LIGHT_STATE_PARAMETERS = require('./stateParameters')
  , ApiError = require('../../ApiError')
  , types = require('../../types')
;

const PERCENTAGE = types.uint8({name: 'percentage', min: 0, max: 100})
  , DEGREES = types.uint8({name: 'degrees', min: 0, max: 360})
;


module.exports = class States {

  constructor() {
    if (arguments.length === 0) {
      throw new ApiError('You must provide some Light State Attributes');
    }

    const states = {};

    function appendStateParameter(name) {
      const parameter = LIGHT_STATE_PARAMETERS[name];
      if (!parameter) {
        throw new ApiError(`Unknown Light State Parameter: "${name}"`);
      }
      states[name] = parameter;
    }

    const argsArray = flatten(Array.from(arguments));
    argsArray.forEach(state => {
      if (Array.isArray(state)) {
        state.forEach(appendStateParameter);
      } else {
        appendStateParameter(state);
      }
    });

    this._allowedStates = states;
    this._state = {};
  }


  reset() {
    this._state = {};
    return this;
  }


  getPayload() {
    return Object.assign({}, this._state);
  }


  getAllowedStateNames() {
    const names = [];

    Object.keys(this._allowedStates).forEach(stateDefinition => {
      names.push(stateDefinition);
    });

    return names;
  }


  populate(data) {
    const self = this;

    if (data) {
      Object.keys(data).forEach(key => {
        if (self._allowedStates[key]) {
          self._setStateValue(key, data[key]);
        }
      });
    }

    return self;
  }


  _setStateValue(definitionName, value) {
    const self = this
      , stateDefinition = self._allowedStates[definitionName]
    ;

    if (stateDefinition) {
      this._state[definitionName] = stateDefinition.getValue(value);
    } else {
      throw new ApiError(`Attempted to set a state '${definitionName}' that is not one of the allowed states`);
    }

    return self;
  }

  _convertPercentageToStateValue(value, stateName, isFloat) {
    return this._convertToStateValue(PERCENTAGE, value, stateName, isFloat);
  }

  _convertDegreesToStateValue(value, stateName, isFloat) {
    return this._convertToStateValue(DEGREES, value, stateName, isFloat);
  }

  _convertToStateValue(range, value, stateName, isFloat) {
    const stateDefinition = this._allowedStates[stateName]
      , validatedValue = range.getValue(value)
    ;

    if (validatedValue === range.getMinValue()) {
      return stateDefinition.getMinValue();
    } else if (validatedValue === range.getMaxValue()) {
      return stateDefinition.getMaxValue();
    } else {
      if (isFloat) {
        return (stateDefinition.getRange() * validatedValue) / range.getMaxValue();
      }
      return Math.round((stateDefinition.getRange() * validatedValue) / range.getMaxValue());
    }
  }
};

//TODO this is now in the utils package
function flatten(array) {
  const flattened = [];
  !(function flat(array) {
    array.forEach(function (el) {
      if (Array.isArray(el)) flat(el);
      else flattened.push(el);
    });
  })(array);
  return flattened;
}