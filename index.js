'use strict';

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

const v3 = require('./lib/v3')
  , discovery = require('./lib/api/discovery')
  , ApiError = require('./lib/ApiError')
;

module.exports = {
  v3: v3,
  discovery: discovery,

  // This was present in the old API, may need to deprecate it
  ApiError: ApiError,
};
