'use strict';

const COLOR_GAMUTS = {
  'A': {
    red: {x: 0.704, y: 0.296},
    green: {x: 0.2151, y: 0.7106},
    blue: {x: 0.138, y: 0.08},
  },

  'B': {
    red: {x: 0.675, y: 0.322},
    green: {x: 0.409, y: 0.518},
    blue: {x: 0.167, y: 0.04},
  },

  'C': {
    red: {x: 0.692, y: 0.308},
    green: {x: 0.17, y: 0.7},
    blue: {x: 0.153, y: 0.048},
  },
};

module.exports = COLOR_GAMUTS;

module.exports.getColorGamut = (values) => {
  return COLOR_GAMUTS[values];
};