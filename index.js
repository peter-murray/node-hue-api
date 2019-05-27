'use strict';

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

const Hue = require('./hue-api')

  , scheduledEventBuilder = require('./hue-api/scheduledEventBuilder')
  , scene = require('./hue-api/sceneBuilder') //TODO replaced by actual Scene object
  // , timer = require('./hue-api/timer') //TODO replaced by a lot of classes


  , lightState = require('./lib/bridge-model/lightstate/LightState')
  , discovery = require('./lib/api/index').discovery
  , ApiError = require('./lib/ApiError')
;


module.exports = {
  HueApi: Hue,
  BridgeApi: Hue,
  api: Hue,

  lightState: lightState,
  scheduledEventBuilder: scheduledEventBuilder, //TODO this was scheduledEvent
  scene: scene,
  // timer: timer,

  upnpSearch: discovery.upnpSearch,
  nupnpSearch: discovery.nupnpSearch,

  ApiError: ApiError
};