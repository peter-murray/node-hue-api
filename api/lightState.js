'use strict';

const deepExtend = require('deep-extend');


const states = {

  on: {
    name: 'on',
    type: 'bool',
    optional: true
  },

  bri: {
    name: 'bri',
    type: 'uint8',
    minValue: 1,
    maxValue: 254,
    optional: true
  },

  hue: {
    name: 'hue',
    type: 'uint16',
    minValue: 0,
    maxValue: 65535,
    optional: true
  },

  sat: {
    name: 'sat',
    type: 'uint8',
    minValue: 0,
    maxValue: 254,
    optional: true
  },

  xy: {
    name: 'xy',
    type: 'list',
    listType: {
      name: 'xyValue',
      type: 'float',
      minValue: 0,
      maxValue: 1,
      optional: false
    },
    optional: true
  },

  ct: {
    name: 'ct',
    type: 'uint16',
    minValue: 153,
    maxValue: 500,
    optional: true
  },

  effect: {
    name: 'effect',
    type: 'string',
    defaultValue: 'none',
    validValues: ['none', 'colorloop'],
    optional: true
  },

  transitiontime: {
    name: 'transitiontime',
    type: 'uint16',
    defaultValue: 4,
    minValue: 0,
    maxValue: 65535,
    optional: true
  },

  bri_inc: {
    name: 'bri_inc',
    type: 'int8',
    minValue: -254,
    maxValue: 254,
    optional: true
  },

  sat_inc: {
    name: 'sat_inc',
    type: 'int8',
    minValue: -254,
    maxValue: 254,
    optional: true
  },

  hue_inc: {
    name: 'hue_inc',
    type: 'int16',
    minValue: -65534,
    maxValue: 65534,
    optional: true
  },

  ct_inc: {
    name: 'ct_inc',
    type: 'int16',
    minValue: -65534,
    maxValue: 65534,
    optional: true
  },

  xy_inc: {
    name: 'xy_inc',
    type: 'list',
    listType: {
      name: 'xyValue',
      type: 'float',
      minValue: -0.5,
      maxValue: 0.5,
      optional: false
    },
    optional: true
  }
};

const alertState = {
  alert: {
    name: 'alert',
    type: 'string',
    defaultValue: 'none',
    validValues: ['none', 'select', 'lselect'],
    optional: true
  }
};

const sceneState = {
  scene: {
    name: 'scene',
    type: 'string',
    optional: true
  }
};


module.exports = {

  create: function() {
    return new LightState(deepExtend({}, states));
  },

  createWithAlert: function() {
    return new LightState(deepExtend({}, states, alertState));
  },

  createWithScene: function() {
    return new LightState(deepExtend({}, states, sceneState));
  }
};


const LightState = function(states) {
  this._definitions = states;
};




LightState.prototype.on = function() {
  this._setStateValue(states.on, true)
};

LightState.prototype.off = function() {
  this._setStateValue(states.on, false)
};


LightState.prototype._setStateValue = function(definition, value) {
  this._states = deepExtend(
      this._states,
      getDefinitionValue(definition, value)
  );
};




function getDefinitionValue(definition, value) {

  if (definition.type === 'bool') {
    return {
      name: definition.name,
      value: Boolean.parse(value)
    }
  }

}






LightState.prototype.definitions = function() {
  const self = this
      , definitions = self._definitions
  ;

  if (! definitions) {
    self._definitions = buildStates(self.values);
    definitions = self._definitions;
  }

  return definitions;
};

LightState.prototype.populate = function(data) {
  if (data) {


  }
};

function build(values) {
  let states = {};

  values.forEach((value) => {
    states[value.name] = value;
  });

  return states;
}
