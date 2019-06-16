'use strict';

const axios = require('axios/index')
  , caChain = require('./ca-chain')
  , ApiError = require('../../ApiError')
;

module.exports.nupnp = function () {

  return axios.get('https://discovery.meethue.com', {
      headers: {accept: 'application/json'},
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