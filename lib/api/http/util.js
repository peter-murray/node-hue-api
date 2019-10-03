'use strict';

const ApiError = require('../../ApiError.js')
  , HueError = require('../../HueError') //TODO consider remove the use of this here now
;

module.exports = {
  parseErrors: parseErrors,
  wasSuccessful: wasSuccessful,
  extractUpdatedAttributes: extractUpdatedAttributes,
};


/**
 * Parses a JSON response looking for the errors in the result(s) returned.
 * @param results The results to look for errors in.
 * @returns {Array} Of errors found.
 */
function parseErrors(results) {
  let errors = [];

  if (Array.isArray(results)) {
    results.forEach(result => {
      if (!result.success) {
        errors = errors.concat(this.parseErrors(result));
      }
    });
  } else {
    if (results.error) {
      // Due to the handling of remote and local errors, we need to differentiate description and message in the errors,
      // as the remote API uses both, whilst local uses only description. -- TODO need to review this
      if (results.error.description && !results.error.message) {
        const payload = Object.assign({message: results.error.description}, results.error);
        errors.push(new HueError(payload));
      } else {
        errors.push(new HueError(results.error));
      }
    }
  }
  return errors.length > 0 ? errors : null;
}


/**
 * Parses a JSON response checking for success on all changes.
 * @param result The JSON object to parse for success messages.
 * @returns {boolean} true if all changes were successful.
 */
function wasSuccessful(result) {
  let success = true,
    idx,
    len;

  if (Array.isArray(result)) {
    for (idx = 0, len = result.length; idx < len; idx++) {
      success = success && wasSuccessful(result[idx]);
    }
  } else {
    success = result.success !== undefined;
  }
  return success;
}


function extractUpdatedAttributes(result) {
  if (wasSuccessful(result)) {
    const values = {};
    result.forEach(update => {
      const success = update.success;
      Object.keys(success).forEach(key => {
        const attribute = /.*\/(.*)$/.exec(key)[1];
        values[attribute] = true; //success[key];
      });
    });
    return values;
  } else {
    throw new ApiError('Error in response'); //TODO extract the error
  }
}



