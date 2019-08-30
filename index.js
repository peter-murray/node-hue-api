'use strict';

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

const v3 = require('./lib/v3')
  , ApiError = require('./lib/ApiError')
  , oldApi = require('./hue-api/shim')
;

module.exports = {
  v3: v3,

  // This was present in the old API, may need to deprecate it
  ApiError: ApiError,

  // Older API for backwards compatibility, will be removed in v4.x
  api: oldApi.api,
  HueApi: oldApi.api,
  BridgeApi: oldApi.api,
  lightState: oldApi.lightState,
  scheduledEvent: oldApi.scheduledEvent,
  scene: oldApi.scene,
  upnpSearch: oldApi.upnpSearch,
  nupnpSearch: oldApi.nupnpSearch,
};
