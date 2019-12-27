'use strict';

const UPnP = require('./UPnP')
  , nupnp = require('./nupnp')
  , bridgeValidator = require('./bridge-validation')
;


module.exports.upnpSearch = function (timeout) {
  const upnp = new UPnP();

  return upnp.search(timeout).then(loadDescriptions);
};

module.exports.nupnpSearch = function () {
  return nupnp.nupnp().then(loadConfigurations);
};

module.exports.description = function (ipAddress) {
  return loadDescriptions([{internalipaddress: ipAddress}])
    .then(results => {
      if (results) {
        return results[0];
      }
      return null;
    });
};

function loadDescriptions(results) {
  const promises = results.map(result => {
    return bridgeValidator.getBridgeDescription(result);
  });

  return Promise.all(promises);
}

function loadConfigurations(results) {
  const promises = results.map(result => {
    return bridgeValidator.getBridgeConfig(result);
  });

  return Promise.all(promises);
}