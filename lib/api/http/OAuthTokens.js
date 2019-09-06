'use strict';

module.exports = class OAuthTokens {

  constructor(other) {
    this._data = {
      accessToken: {
        value: null,
        expiresAt: -1
      },
      refreshToken: {
        value: null,
        expiresAt: -1
      }
    };

    if (other) {
      this._setAccessToken(other.accessToken, other.accessTokenExpiresAt);
      this._setRefreshToken(other.refreshToken, other.refreshTokenExpiresAt);
    }
  }

  _setAccessToken(token, expiresAt) {
    this._data.accessToken.value = token;
    this._data.accessToken.expiresAt = expiresAt || -1;
  }

  _setRefreshToken(token, expiresAt) {
    this._data.refreshToken.value = token;
    this._data.refreshToken.expiresAt = expiresAt || -1;
  }

  get refreshToken() {
    return this._data.refreshToken.value;
  }

  get accessToken() {
    return this._data.accessToken.value;
  }

  get accessTokenExpiresAt() {
    return this._data.accessToken.expiresAt;
  }

  get refreshTokenExpiresAt() {
    return this._data.refreshToken.expiresAt;
  }

  toString() {
    return JSON.stringify(this._data, null, 2);
  }
};