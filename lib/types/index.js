'use strict';

const StringType = require('./StringType')
  , BooleanType = require('./BooleanType')
  , ChoiceType = require('./ChoiceType')
  , UInt8Type = require('./UInt8Type')
  , UInt16Type = require('./UInt16Type')
  , Int8Type = require('./Int8Type')
  , Int16Type = require('./Int16Type')
  , FloatType = require('./FloatType')
  , ListType = require('./ListType')
  , ObjectType = require('./ObjectType')
;

module.exports = {
  boolean: function(config) {
    return new BooleanType(config);
  },

  uint8: function(config) {
    return new UInt8Type(config);
  },

  uint16: function(config) {
    return new UInt16Type(config);
  },

  int8: function(config) {
    return new Int8Type(config);
  },

  int16: function(config) {
    return new Int16Type(config);
  },

  float: function(config) {
    return new FloatType(config);
  },

  list: function(config) {
    return new ListType(config);
  },

  choice: function(config) {
    return new ChoiceType(config);
  },

  string: function(config) {
    return new StringType(config);
  },

  object: function(config) {
    return new ObjectType(config);
  },

  timePattern: function(config) {
    //TODO need to require this here as the underlying time patterns use this module to define parts of the time formats which creates a cyclic dependency around this module
    const TimePatternType = require('./TimePatternType');
    return new TimePatternType(config);
  },
};
