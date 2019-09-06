'use strict';

const ApiError = require('../ApiError');

module.exports = class HueApiConfig {

  constructor(config, transport, remoteApi) {
    this._config = config;
    this._remoteApi = remoteApi;
    this._transport = transport;

    this._isRemote = !! config.remote && !!remoteApi;
  }

  get isRemote() {
    return this._isRemote;
  }

  get transport() {
    return this._transport;
  }

  get remote() {
    if (this.isRemote) {
      return this._remoteApi;
    } else {
      throw new ApiError('This API has not been set up a remote API');
    }
  }

  get username() {
    return this._config.username;
  }

  get clientId() {
    this.requireRemote();
    return this._config.clientId;
  }

  get clientSecret() {
    this.requireRemote();
    return this._config.clientSecret;
  }

  get baseUrl() {
    return this._config.baseUrl;
  }

  get clientKey() {
    this.requireLocal();
    return this._config.clientkey;
  }

  get accessToken() {
    this.requireRemote();
    return this._remoteApi.accessToken;
  }

  get accessTokenExpiry() {
    this.requireRemote();
    return this._remoteApi.accessTokenExpiry;
  }

  get refreshToken() {
    this.requireRemote();
    return this._remoteApi.refreshToken;
  }

  get refreshTokenExpiry() {
    this.requireRemote();
    return this._remoteApi.refreshTokenExpiry;
  }

  requireRemote() {
    if (!this.isRemote) {
      throw new ApiError('The function in only valid on a remote Hue API instance');
    }
  }

  requireLocal() {
    if (this.isRemote) {
      throw new ApiError('The function in only valid on a local Hue API instance');
    }
  }
};