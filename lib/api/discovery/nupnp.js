'use strict';

const http = require('../http/HttpClientFetch')
  , caChain = require('./ca-chain')
  , ApiError = require('../../ApiError')
;

module.exports.nupnp = function () {

  return http.request({
      url: 'https://discovery.meethue.com',
      json: true,
      httpsAgent: caChain.getDiscoveryMeetHueHttpsAgent()
    })
    .catch(err => {
      throw new ApiError(`Problems resolving hue bridges, ${err.message}`);
    })
    .then(response => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new ApiError(`Status code unexpected when using N-UPnP endpoint: ${response.status}`);
      }
    });
};