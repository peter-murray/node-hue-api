'use strict';

const LIGHT_STATE_PARAMETERS = require('./stateParameters')
  , ApiError = require('../../hue-api/errors');


module.exports = class States {

  constructor() {
    if (arguments.length === 0) {
      throw new ApiError('You must provide some Light State Attributes');
    }

    const states = {};

    function appendStateParameter(name) {
      const parameter = LIGHT_STATE_PARAMETERS[name];
      if (!parameter) {
        throw new ApiError(`Unknown Light State Parameter: ${name}`);
      }
      states[name] = parameter;
    }

    Array.from(arguments).forEach(state => {
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
    //TODO perform the validation against the allowed states?
    return Object.assign({}, this._state);
  }


  getAllowedStateNames() {
    const names = [];

    Object.keys(this._allowedStates).forEach(stateDefinition => {
      // names.push(stateDefinition.name);
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
};