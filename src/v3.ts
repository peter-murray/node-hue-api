import { model } from '@peter-murray/hue-bridge-model';
import { v3Model } from './v3Model';
import { deprecatedFunction } from './util';
import * as api from './api';
import { description, nupnpSearch, upnpSearch } from './api/discovery';

// Definition of the v3 API for node-hue-api
const v3 = {
  api: api,

  discovery: {
    upnpSearch: (timeout: number) => {
      deprecatedFunction(
        '6.x',
        `require('node-hue-api').v3.discovery.upnpSearch()`,
        `Use require('node-hue-api').discovery.upnpSearch()`);
      return upnpSearch(timeout);
    },

    nupnpSearch: () => {
      deprecatedFunction(
        '6.x',
        `require('node-hue-api').v3.discovery.nupnpSearch()`,
        `Use require('node-hue-api').discovery.nupnpSearch()`);
      return nupnpSearch();
    },

    description: (ipAddress: string) => {
      deprecatedFunction(
        '6.x',
        `require('node-hue-api').v3.discovery.description(ipAddress)`,
        `Use require('node-hue-api').discovery.description(ipAddress)`);
      return description(ipAddress);
    },
  },

  //TODO think about removing this and deferring to the model
  lightStates: model.lightStates,

  model: v3Model,

  // //TODO remove
  // sensors: sensorsObject(
  //   'Sensors are now contained in the v3.model interface\n' +
  //   'You can use the v3.model.createCLIP[xxx]Sensor() where [xxx] is the type of Sensor to instantiate a sensor.'
  // ),
  //
  // //TODO remove
  // Scene: classRemoved(
  //   'Scenes are no longer exposed as a class.\n' +
  //   'Create a Scene using v3.model.createLightScene() or v3.model.createGroupScene()'
  // ),
  //
  // //TODO remove
  // rules: rulesObject(
  //   'Rules are now exposed under the v3.model interface.\n' +
  //   'Create a rule using v3.model.createRule()\n' +
  //   'Create a RuleCondition using v3.model.ruleConditions.[sensor|group]()\n' +
  //   'Create a RuleAction using v3.mode.ruleActions.[light|group|sensor|scene]\n'
  // ),
};
export { v3 };

// function sensorsObject(msg: string) {
//   return {
//     clip: {
//       GenericFlag: classRemoved(msg),
//       OpenClose: classRemoved(msg),
//       GenericStatus: classRemoved(msg),
//       Humidity: classRemoved(msg),
//       Lightlevel: classRemoved(msg),
//       Presence: classRemoved(msg),
//       Switch: classRemoved(msg),
//       Temperature: classRemoved(msg),
//     }
//   }
// }
//
// function rulesObject(msg) {
//   return {
//     Rule: classRemoved(msg),
//     conditions: {
//       group: functionRemoved(msg),
//       sensor: functionRemoved(msg),
//     },
//     actions: {
//       light: functionRemoved(msg),
//       group: functionRemoved(msg),
//       scene: functionRemoved(msg),
//     },
//   };
// }

// function functionRemoved(msg: string) {
//   return function () {
//     throw new ApiError(msg);
//   };
// }
//
// function classRemoved(msg: string) {
//   return class RemovedClass {
//     constructor() {
//       throw new ApiError(msg);
//     }
//   };
// }