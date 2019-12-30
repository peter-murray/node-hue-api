'use strict';

module.exports = class Remote {

  constructor(hueApi) {
    this._hueApi = hueApi;
  }

  /**
   * Exchanges the code for a token on the remote API.
   * @param code The code to exchange for a new token.
   * @returns {String} The token from the remote API.
   */
  getToken(code) {
    return this._getRemoteApi().getToken(code);
  }

  /**
   * Will refresh the OAuth tokens on the remote API, exchaning the existing ones for new ones.
   * @returns {Object} An object containing the new access and refresh tokens.
   */
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

  /**
   * Creates a new remote user for the Hue Bridge.
   *
   * @param remoteBridgeId {String} The is of the hue bridge on the remote portal
   * @param deviceType {String} The user device type identifier.
   */
  createRemoteUser(remoteBridgeId, deviceType) {
    return this._getRemoteApi().createRemoteUsername(remoteBridgeId, deviceType);
  }

  /**
   * @typedef {Object} RemoteAccessCredentials
   * @property {String} cientId
   * @property {String} clientSecret
   * @property {Object} tokens
   * @property {Object} [tokens.access]
   * @property {String} tokens.access.value
   * @property {String} tokens.access.expiresAt
   * @property {Object} [tokens.refresh]
   * @property {String} tokens.refresh.value
   * @property {String} tokens.refresh.expiresAt
   * @property {String} username
   */

  /**
   * Obtains the remote access credentials that are in use for the remote connection.
   * @returns {RemoteAccessCredentials}
   */
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

  /** @private */
  _getHueApi() {
    return this._hueApi;
  }

  /** @private */
  _getRemoteApi() {
    return this._getHueApi()._getRemote();
  }
};