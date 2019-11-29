'use strict';

module.exports = {

  getTimePattern: (name) => {
    const two_digits = '[0-9]{2}'
      , prefix = name || ''
    ;

    return `(?<${prefix}hours>${two_digits}):(?<${prefix}minutes>${two_digits}):(?<${prefix}seconds>${two_digits})`
  },

  getDatePattern: (name) => {
    const two_digits = '[0-9]{2}'
      , four_digits = '[0-9]{4}'
      , prefix = name || ''
    ;
    return `(?<${prefix}year>${four_digits})-(?<${prefix}month>${two_digits})-(?<${prefix}day>${two_digits})`
  },

  weekdays: {
    MONDAY: 64,
    TUESDAY: 32,
    WEDNESDAY: 16,
    THURSDAY: 8,
    FRIDAY: 4,
    SATURDAY: 2,
    SUNDAY: 1,

    WEEKDAY: 124,
    WEEKEND: 3,
    ALL: 127,
  }
};
