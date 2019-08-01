'use strict';

const Hue = require('./index')
  , ScheduledEventBuilder = require('./ScheduledEventBuilder')
  , SceneBuilder = require('./SceneBuilder')
  , LightStateShim = require('./LightStateShim')

  // The new APIs
  , discovery = require('../lib/api/discovery')
;

/*

This module provides the necessary shimming to make the original 2.x version of the code base some what compatible with
the new v3 API, thereby preventing the user base from having to rewrite all their code on day one of the release of 3.x.

 */

const UPNP_SEARCH_WARNING = 'Function is deprecated, use require(\'node-hue-api\').discovery.upnpSearch() instead'
  , NUPNP_SEARCH_WARNING = 'Function is deprecated, use require(\'node-hue-api\').discovery.nupnpSearch() instead'
;

let patched = false;

function patchPromise() {
  if (!patched) {
    // This will mess with the Global Promise, which is less than ideal but is the only way to provide 'Q' like promise compatibility
    Promise.prototype.done = function () {
      console.error('\nThe promises used by this library are now native JavaScript promises, not Q promises.\n' +
        'Please remove the use of the ".done()" function in your promise chains.\n'
      );
    };

    Promise.prototype.fail = Promise.prototype.catch;
    patched = true;
  }
}

function api() {
  console.error(
    '********************************************************************************\n' +
    'Backwards compatibility shim for node-hue-api.\n\n' +
    'This shim provides a limited backporting of the features available in the updated API in v3.x.\n' +
    'This will be removed in v4.x of node-hue-api.\n\n' +
    'You need to migrate your code to use the new API available via import\n' +
    '  require("node-hue-api").v3\n\n' +
    'Please consult the documentation at https://github.com/peter-murray/node-hue-api for the documentation on the new API.\n' +
    '********************************************************************************\n'
  );
  patchPromise();
  return Hue.apply(Hue, arguments);
}


function searchDeprecated(fn, message) {
  return function () {
    patchPromise();
    console.error(message);
    return fn.apply(this, Array.from(arguments));
  };
}


module.exports = {
  HueApi: api,
  BridgeApi: api,
  api: api,

  //TODO deprecate
  lightState: {
    create: function (values) {
      return new LightStateShim(values);
    },
  },

  //TODO deprecate
  scheduledEvent: {
    create: createScheduledEvent
  },

  //TODO deprecate
  scene: {
    create: createScene
  },

  searchForBridges: searchDeprecated(discovery.upnpSearch, UPNP_SEARCH_WARNING),
  upnpSearch: searchDeprecated(discovery.upnpSearch, UPNP_SEARCH_WARNING),

  locateBridges: searchDeprecated(discovery.upnpSearch, NUPNP_SEARCH_WARNING),
  nupnpSearch: searchDeprecated(discovery.upnpSearch, NUPNP_SEARCH_WARNING),
};


function createScheduledEvent() {
  let builder,
    arg;

  if (arguments.length === 0) {
    builder = new ScheduledEventBuilder();
  } else {
    arg = arguments[0];
    if (arg instanceof ScheduledEventBuilder) {
      builder = arg;
    } else {
      builder = new ScheduledEventBuilder();

      // try to populate the new schedule using any values that match schedule properties
      if (arg.name) {
        builder.withName(arg.name);
      }

      if (arg.description) {
        builder.withDescription(arg.description);
      }

      if (arg.time || arg.localtime) {
        builder.at(arg.time || arg.localtime);
      }

      if (arg.command) {
        builder.withCommand(arg.command);
      }

      if (arg.status) {
        builder.withEnabledState(arg.status);
      }
    }
  }

  return builder;
}

function createScene() {
  let scene
    , arg
  ;

  if (arguments.length === 0) {
    scene = new SceneBuilder();
  } else {
    arg = arguments[0];

    if (arg instanceof SceneBuilder) {
      scene = arg;
    } else {
      scene = new SceneBuilder();

      // try to populate the new scene using any values that match scene properties
      if (arg.name) {
        scene.withName(arg.name);
      }

      if (arg.lights) {
        scene.withLights(arg.lights);
      }

      if (arg.transitionTime) {
        scene.withTransitionTime(arg.transitionTime);
      }

      if (arg.data || arg.appData) {
        scene.withAppData(arg.data || arg.appData);
      }

      if (arg.picture) {
        scene.withPicture(arg.picture);
      }
    }
  }
  return scene;
}