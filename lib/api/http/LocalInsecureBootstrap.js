'use strict';

const url = require('url')
  , axios = require('axios')
  , Transport = require('./Transport')
  , Api = require('../Api')
;

const SUPPRESS_WARNING = process.env.NODE_HUE_API_USE_INSECURE_CONNECTION != null;

module.exports = class LocalInsecureBootstrap {

  constructor(hostname, port) {
    this._baseUrl = url.format({protocol: 'http', hostname: hostname, port: port || 80});
    this._hostname = hostname;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  get hostname() {
    return this._hostname;
  }

  connect(username, clientkey) {
    const baseUrl = this.baseUrl;

    if (!SUPPRESS_WARNING) {
      console.log('WARNING: You are using this library in an insecure way!\n'
        + 'The Hue bridge supports HTTPS connections locally and it is highly recommended that you use an HTTPS\n'
        + 'method to communicate with the bridge.'
      );
    }

    return axios.get(`${baseUrl}/api/config`)
      .then(() => {
        const apiBaseUrl = `${baseUrl}/api`
          , transport = new Transport(username, axios.create({baseURL: apiBaseUrl}))
          , config = {
            remote: false,
            baseUrl: apiBaseUrl,
            clientkey: clientkey,
            username: username,
          }
        ;

        return new Api(config, transport);
      });
  }
};

