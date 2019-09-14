'use strict';

const axios = require('axios')
  , RemoteApi = require('./RemoteApi')
  , Transport = require('./Transport')
  , Api = require('../Api')
  , ApiError = require('../../ApiError')
;

module.exports = class RemoteBootstrap {

  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.remoteApi = new RemoteApi(clientId, clientSecret);
  }

  getAuthCodeUrl(deviceId, appId, state) {
    if (! deviceId) {
      throw new ApiError('A unique deviceid is required for your application when accessing the Remote API');
    }

    if (! state) {
      throw new ApiError('A state value must be provided to mitigate against cross-site request forgeries');
    }

    if (! appId) {
      throw new ApiError('An Application ID (appId parameter) must be provided that matches the AppId for the remote application you registered with the Hue Portal');
    }

    return `${this.remoteApi.baseUrl}/oauth2/auth?clientid=${this.clientId}&state=${state}&deviceid=${deviceId}&appid=${appId}&response_type=code`;
  }

  connectWithCode(code, username, timeout, deviceType, remoteBridgeId) {
    const self = this;

    return self.remoteApi.getToken(code)
      .then(tokens => {
        if (username) {
          return Promise.resolve(username);
        } else {
          return self.remoteApi.createRemoteUsername(remoteBridgeId, deviceType);
        }
      })
      .then(username => {
        return self._getRemoteApi(username, timeout);
      });
  }

  connectWithTokens(accessToken, refreshToken, username, timeout, deviceType) {
    const self = this;

    self.remoteApi.setAccessToken(accessToken);
    self.remoteApi.setRefreshToken(refreshToken);

    let promise;
    if (username) {
      promise = Promise.resolve(username);
    } else {
      promise = self.remoteApi.createRemoteUsername(deviceType);
    }

    return promise.then(username => {
      return self._getRemoteApi(username, timeout);
    });
  }

  _getRemoteApi(username, timeout) {
    const self = this
      , baseUrl = `${self.remoteApi.baseUrl}/bridge`
      , config = {
        remote: true,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        baseUrl: baseUrl,
        username: username,
      }
    ;

    const axiosConfig = {
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${self.remoteApi.accessToken}`
        },
        timeout: getTimeout(timeout)
      }
      , transport = new Transport(username, axios.create(axiosConfig))
      , api = new Api(config, transport, self.remoteApi)
    ;
    return Promise.resolve(api);
  }
};


function getTimeout(timeout) {
  return timeout || 12000; // 12 Seconds
}