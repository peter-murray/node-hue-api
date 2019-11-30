'use strict';

const Type = require('./Type')
  , timePatterns = require('../model/timePatterns')
  , BridgeTime = require('../model/timePatterns/BridgeTime')
  , ApiError = require('../ApiError')
;


module.exports = class TimePatternType extends Type {

  constructor(config) {
    super(Object.assign({type: 'timePattern'}, config));
  }

  getValue(value) {
    const checkedValue = super.getValue(value)
      , isValueDefined = Type.isValueDefined(checkedValue)
      , optional = this.optional
    ;

    // If we are optional and have no value, prevent further checks as they will fail
    if (optional && !isValueDefined) {
      return checkedValue;
    }

    if (value instanceof BridgeTime) {
      return value.toString();
    } else if (timePatterns.isTimePattern(value)) {
      return timePatterns.createFromString(value).toString();
    } else {
      //TODO may need to cater for a string
      throw new ApiError(`Cannot convert value "${value}" to a valid TimePatten`);
    }
  }

  _convertToType(val) {
    return timePatterns.createFromString(`${val}`);
  }
};