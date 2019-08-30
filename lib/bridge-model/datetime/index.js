'use strict';

const dateTimeUtil = require('./DateTimeUtil')
  , ApiError = require('../../ApiError')
;

module.exports.create = function(str) {
  let matched = null;

  Object.keys(dateTimeUtil.regex).forEach(key => {
    const regex = dateTimeUtil.regex[key];
    if (!matched) {
      if (regex.test(str)) {
        matched = key;
      }
    }
  });

  if (! matched) {
    throw new ApiError(`Could not match string '${str}' to a valid Hue Time Pattern`);
  }

  // TODO this would not survive minification
  const time = new (require(`./${matched}`));
  time.fromString(str);
  return time;
};