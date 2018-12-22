'use strict';

const ApiError = require('../hue-api/errors');


module.exports = {
  boolean: function(config) {
    return new BoolType(config);
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
  }
};


class Type {
  constructor(config) {
    this.name = config.name;
    this.type = config.type;
    this.isOptional = config.optional || true;
    this.defaultValue = config.defaultValue;
  }

  isOptional() {
    return this.isOptional;
  }

  getDefaultValue() {
    return this.defaultValue || null;
  }

  hasDefaultValue() {
    return this.defaultValue !== null && this.defaultValue !== undefined && this.defaultValue !== Number.NaN;
  }
}


class BoolType extends Type {

  constructor(config) {
    super(config);
    this.type = 'boolean';
  }

  getValue(value) {
    return Boolean(value);
  }
}


class ListType extends Type {

  constructor(props) {
    if (props.minEntries === null || props.minEntries === undefined) {
      throw new ApiError('minEntries is required for a list type');
    }

    if (props.maxEntries === null || props.maxEntries === undefined) {
      throw new ApiError('maxEntries is required for a list type');
    }

    super(props);
    this.minEntries = props.minEntries;
    this.maxEntries = props.maxEntries;

    //TODO validate that this value is a type
    this.valueType = props.type;
  }

  getValue() {
    //TODO need to check the optional flag
    let listValues;

    if (arguments.length === 1) {
      if (Array.isArray(arguments[0])) {
        listValues = arguments[0];
      } else {
        throw new ApiError('Unexpected list type value');
      }
    } else {
      listValues = Array.from(arguments);
    }

    // Validate the number of entries
    const length = listValues.length;
    if (length < this.minEntries && length > this.maxEntries) {
      throw new ApiError(`The number of entries for the list, "${length}" is outside the range of min=${this.minEntries} max=${this.maxEntries}`);
    }

    // Validate the values in the list
    const result = [];
    for (var idx in listValues) {
      result.push(this.valueType.getValue(listValues[idx]));
    }
    return result;
  }
}


class RangedNumberType extends Type {

  constructor(config, typeMin, typeMax) {
    super(config);

    if (config.min !== undefined && config.min !== null) {
      this.min = config.min;
    } else {
      this.min = typeMin;
    }

    if (config.max !== undefined && config.max != null) {
      this.max = config.max;
    } else{
      this.max = typeMax;
    }
  }

  isValueValid(value) {
    if (RangedNumberType.isValueDefined(value)) {
      return value >= this.min && value <= this.max;
    } else {
      return false;
    }
  }

  static isValueDefined(value) {
    return value !== null && value !== undefined && value !== Number.NaN;
  }

  getValue(value) {
    if (this.hasDefaultValue() && !RangedNumberType.isValueDefined(value)) {
      return this.getDefaultValue();
    } else {
      if (this.isValueValid(value)) {
        return value;
      } else {
        throw new ApiError(`Value, '${value}' is not within allowed limits: min=${this.min} max=${this.max}`);
      }
    }
  }

  getMinValue() {
    return this.min;
  }

  getMaxValue() {
    return this.max;
  }

  getRange() {
    // return this.max - this.min; //TODO brightness has a lower bound of 1, which can generate quirks
    return this.max;
  }
}


class IntegerType extends RangedNumberType {

  constructor(config, type, typeMin, typeMax) {
    super(config, typeMin, typeMax);
    this.type = type || 'integer';
  }
}


class UInt8Type extends IntegerType {
  constructor(config) {
    super(config, 'uint8', 0, 255);
  }
}


class Int8Type extends IntegerType {
  constructor(config) {
    super(config, 'int8', -255, 255);
  }
}


class UInt16Type extends IntegerType {
  constructor(config) {
    super(config, 'uint16', 0, 65535);
  }
}


class Int16Type extends IntegerType {
  constructor(config) {
    super(config, 'int16', -65535, 65535);
  }
}


class FloatType extends RangedNumberType {
  constructor(config) {
    super(config, Number.MIN_VALUE, Number.MAX_VALUE);
    this.type = 'float';
  }
}


class ChoiceType extends Type {
  constructor(config) {
    super(config);

    this.allowedValues = config.validValues;
    this.defaultValue = config.defaultValue;
  }

  getValue(val) {
    if (!val) {
      if (this.defaultValue) {
        return this.defaultValue;
      } else {
        throw new ApiError('No value provided and no sensible default for type');
      }
    } else {
      if (this.allowedValues.indexOf(val) > -1) {
        return val;
      } else {
        throw new ApiError(`Value '${val}' is not one of the allowed values [${this.allowedValues}]`);
      }
    }
  }
}


