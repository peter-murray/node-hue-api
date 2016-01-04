"use strict";

var deepExtend = require("deep-extend")
  ;

var minuteValidator = limitValue(0, 59)
  , hourValidator = limitValue(0, 23)
  , secondValidator = limitValue(0, 59)
  , countValidator = limitValue(0, 99)
  ;

var Timer = function() {
};

module.exports.create = function() {
  return new Timer();
};

Timer.prototype.time = function(hh, mm, ss) {
  return this.hour(hh).minute(mm).second(ss);
};

Timer.prototype.hour = function(hh) {
  if (hh >= 24) {
    hh = 0;
  }

  deepExtend(this, {hh: hourValidator(hh)});
  return this;
};

Timer.prototype.minute = function(mm) {
  deepExtend(this, {mm: minuteValidator(mm)});
  return this;
};

Timer.prototype.second = function(ss) {
  deepExtend(this, {ss: secondValidator(ss)});
  return this;
};

Timer.prototype.randomize = function(hh, mm, ss) {
  return this.randomizeHour(hh).randomizeMinute(mm).randomizeSecond(ss);
};

Timer.prototype.randomizeHour = function(hh) {
  deepExtend(this, {random: {hh: hourValidator(hh)}});
  return this;
};

Timer.prototype.randomizeMinute = function(mm) {
  deepExtend(this, {random: {mm: minuteValidator(mm)}});
  return this;
};

Timer.prototype.randomizeSecond = function(ss) {
  deepExtend(this, {random: {ss: secondValidator(ss)}});
  return this;
};

Timer.prototype.recurring = function(count) {
  if (count === null || count === undefined) {
    deepExtend(this, {recurring: "forever"});
  } else {
    deepExtend(this, {recurring: countValidator(count)});
  }
  return this;
};



function limitValue(min, max) {
  return function(val) {
    if (val < min) {
      return min;
    }

    if (val > max) {
      return max;
    }

    return val;
  }
}