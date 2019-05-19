'use strict';

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

var bridgeDiscovery = require('./hue-api/bridge-discovery')
  , Hue = require('./hue-api')
  , lightState = require('./hue-api/lightstate')
  , scheduledEventBuilder = require('./hue-api/scheduledEventBuilder')
  , scene = require('./hue-api/sceneBuilder')
  , timer = require('./hue-api/timer')
  , ApiError = require('./api/ApiError')
;


function deprecated(fn, message) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    console.error(message);
    return fn.apply(this, args);
  };
}

module.exports = {
  HueApi: Hue,
  BridgeApi: Hue,
  api: Hue,

  //TODO document this, it is currently broken though
  connect: function (config) {
    return new Hue(config);
  },

  lightState: lightState,
  scheduledEventBuilder: scheduledEventBuilder, //TODO this was scheduledEvent
  scene: scene,
  timer: timer,

  upnpSearch: bridgeDiscovery.networkSearch,
  nupnpSearch: bridgeDiscovery.locateBridges,

  locateBridges: deprecated(bridgeDiscovery.locateBridges
    , '\'locateBridges\' is deprecated, please use \'nupnpSearch\' instead'),

  searchForBridges: deprecated(
    bridgeDiscovery.networkSearch
    , '\'searchForBridges\' is deprecated, please use \'upnpSearch\' instead'
  ),

  ApiError: ApiError
};