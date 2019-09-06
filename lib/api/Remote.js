'use strict';

module.exports = class Remote {

  constructor(hueApi) {
    this._hueApi = hueApi;
  }

  getToken(code) {
    return this._getRemoteApi().getToken(code);
  }

  refreshTokens() {
    const self = this
      , remoteApi = self._getRemoteApi()
    ;

    return remoteApi.refreshTokens(remoteApi.refreshToken)
      .then(tokens => {
        // Update the authentication details for existing connections
        self._getHueApi()._getTransport().refreshAuthorizationHeader(tokens.access);
        return tokens;
      });
  }

  createRemoteUser(remoteBridgeId, deviceType) {
    return this._getRemoteApi().createRemoteUsername(remoteBridgeId, deviceType);
  }

  getRemoteAccessCredentials() {
    const config = this._getHueApi()._getConfig();

    const result = {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      username: config.username,
      tokens: {},
    };

    if (config.accessToken) {
      result.tokens.access = {
        value: config.accessToken,
        expiresAt: config.accessTokenExpiry
      };
    }

    if (config.refreshToken) {
      result.tokens.refresh = {
        value: config.refreshToken,
        expiresAt: config.refreshTokenExpiry
      };
    }

    return result;
  }

  _getHueApi() {
    return this._hueApi;
  }

  _getRemoteApi() {
    return this._getHueApi()._getRemote();
  }
};