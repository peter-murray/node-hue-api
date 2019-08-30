'use strict';

const patterns = {
  time: '(\\d{2}):(\\d{2}):(\\d{2})',
  weekday: 'W([0-9]{1,3})',
  date: '(\\d{4})-(\\d{2})-(\\d{2})'
};


module.exports = {

  patterns: patterns,

  regex: {
    RecurringTime: new RegExp(`${patterns.weekday}/T${patterns.time}`),
    AbsoluteTime: new RegExp(`${patterns.date}T${patterns.time}`),
    Timer: new RegExp(`PT${patterns.time}`),

    //TODO expand once classes are implemented
  },



  timerRecurringCount: new RegExp(`R\\d{2}/PT${patterns.time}`),
  timerRecurring: new RegExp(`R/PT${patterns.time}`),
  timerRecurringRandomized: new RegExp(`R\\d{2}/PT${patterns.time}A${patterns.time}`),
  timerRecurringCountRandom: new RegExp(`R\\d{2}/PT${patterns.time}A${patterns.time}`),

  randomized: new RegExp(`${patterns.date}T${patterns.time}A${patterns.time}`),

  recurringRandomized: new RegExp(`${patterns.weekday}/T${patterns.time}A${patterns.time}`),

  timerRandom: new RegExp(`PT${patterns.time}A${patterns.time}`),
};
