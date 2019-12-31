'use strict';

const ApiError = require('../ApiError');

/**
 * @typedef {import('./http/RemoteApi')} RemoteApi
 * @type {HueApiConfig}
 */
module.exports = class HueApiConfig {

  constructor(config, transport, remoteApi) {
    this._config = config;
    this._remoteApi = remoteApi;
    this._transport = transport;

    this._isRemote = !!config.remote && !!remoteApi;
  }

  /**
   * Is the connection to the hue bridge remote.
   * @returns {boolean}
   */
  get isRemote() {
    return this._isRemote;
  }

  /**
   * Gets the transport implementation that is used to conenct with the Hue Bridge
   * @returns {Object}
   */
  get transport() {
    return this._transport;
  }

  /**
   * Gets the remote API in use that was used to bootstrap the remote connection.
   * @returns {RemoteApi}*
   * @throws ApiError if the connection is local network.
   */
  get remote() {
    if (this.isRemote) {
      return this._remoteApi;
    } else {
      throw new ApiError('This API has not been set up as a remote API');
    }
  }

  /**
   * Gets the current username used to connect/interact with the Hue Bridge.
   * @returns {String} The bridge username.
   */
  get username() {
    return this._config.username;
  }

  /**
   * Gets the client id for the remote OAuth connection.
   * @returns {String} The clientId for the remote connection
   * @throws ApiError if the connection is not remote.
   */
  get clientId() {
    this._requireRemote();
    return this._config.clientId;
  }

  /**
   * Gets the client secret for the remote OAuth connection.
   * @returns {String} The client secret for the remote connection.
   * @throws ApiError if the connection is not remote.
   */
  get clientSecret() {
    this._requireRemote();
    return this._config.clientSecret;
  }

  /**
   * The Base URL for communication with the bridge.
   * @returns {String} The base URL for the hue bridge.
   */
  get baseUrl() {
    return this._config.baseUrl;
  }

  /**
   * Gets the client key for the entertainment API/streaming endpoints
   * @returns {String}
   * @throws ApiError if the connection is not local network.
   */
  get clientKey() {
    this._requireLocal();
    return this._config.clientkey;
  }

  /**
   * Gets the current access token.
   * @returns {String}
   * @throws ApiError if the connection is not remote.
   */
  get accessToken() {
    this._requireRemote();
    return this._remoteApi.accessToken;
  }

  /**
   * Gets the expiry timestamp of the access token.
   * @returns {number} The timestamp for the expiry or -1 if not known
   */
  get accessTokenExpiry() {
    this._requireRemote();
    return this._remoteApi.accessTokenExpiry;
  }

  /**
   * Gets the current refresh token.
   * @returns {String}
   * @throws ApiError if the connection is not remote.
   */
  get refreshToken() {
    this._requireRemote();
    return this._remoteApi.refreshToken;
  }

  /**
   * Gets the expiry timestamp of the refresh token.
   * @returns {number} The timestamp for the expiry or -1 if not known
   */
  get refreshTokenExpiry() {
    this._requireRemote();
    return this._remoteApi.refreshTokenExpiry;
  }

  _requireRemote() {
    if (!this.isRemote) {
      throw new ApiError('The function is only valid on a remote Hue API instance');
    }
  }

  _requireLocal() {
    if (this.isRemote) {
      throw new ApiError('The function is only valid on a local Hue API instance');
    }
  }
};