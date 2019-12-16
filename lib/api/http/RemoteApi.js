'use strict';

const crypto = require('crypto')
  , axios = require('axios')
  , ApiError = require('../../ApiError')
  , OAuthTokens = require('./OAuthTokens')
  , util = require('../../util')
;

// This class is a bit different to the other endpoints currently as they operate in a digest challenge for the most
// part and also operate off a different base url compared with the local/remote endpoints that make up the rest of the
// bridge API commands.
/**
 * @typedef {import('./OAuthTokens')} OAuthTokens
 *
 * @type {RemoteApi}
 */
module.exports = class RemoteApi {

  constructor(clientId, clientSecret) {
    this._config = {
      clientId: clientId,
      clientSecret: clientSecret,
      baseUrl: 'https://api.meethue.com'
    };

    this._tokens = new OAuthTokens();
  }

  /**
   * Get the clientID for the connection.
   * @returns {String} The clientID of the remote connection.
   */
  get clientId() {
    return this._config.clientId;
  }

  /**
   * Gets the clientSecret value for the connection.
   * @returns {String} THe client secret for the remote connection.
   */
  get clientSecret() {
    return this._config.clientSecret;
  }

  /**
   * Gets the base URL for the connection.
   * @returns {string}
   */
  get baseUrl() {
    return this._config.baseUrl;
  }

  /**
   * Gets the Access Token for the remote connection
   * @returns {String} The access token.
   */
  get accessToken() {
    return this._tokens.accessToken;
  }

  /**
   * Gets the expiry timestamp value for the expiry of the access token.
   * @returns {number|null|undefined}
   */
  get accessTokenExpiry() {
    return this._tokens.accessTokenExpiresAt;
  }

  /**
   * Gets the Refresh Token for the remote connection, that can be exchanged for new refreshed tokens
   * @returns {String} The refresh token.
   */
  get refreshToken() {
    return this._tokens.refreshToken;
  }

  /**
   * Gets the expiry timestamp value for the expiry of the refresh token.
   * @returns {number|null|undefined}
   */
  get refreshTokenExpiry() {
    return this._tokens.refreshTokenExpiresAt;
  }

  /**
   * Sets the access token for the remote connection
   * @param {String} token The access token.
   * @param {number=} expiry The timestamp value of the expiry of the access token, optional
   * @returns {RemoteApi}
   */
  setAccessToken(token, expiry) {
    this._tokens._setAccessToken(token, expiry);
    return this;
  }

  /**
   * Sets the refresh token for the remote connection
   * @param {String} token The refresh token.
   * @param {number=} expiry The timestamp value of the expiry of the refresh token, optional
   * @returns {RemoteApi}
   */
  setRefreshToken(token, expiry) {
    this._tokens._setRefreshToken(token, expiry);
    return this;
  }

  /**
   * Builds the digest response to pass to the remote API for the provided request details.
   * @param {String} realm
   * @param {String} nonce
   * @param {String} method HTTP method for the request
   * @param {String} path The path for the request
   * @returns {String} The digest hash value for the provided data
   */
  getDigestResponse(realm, nonce, method, path) {
    const clientId = this.clientId
      , clientSecret = this.clientSecret
      , hashOne = crypto.createHash('md5').update(`${clientId}:${realm}:${clientSecret}`).digest('hex')
      , hashTwo = crypto.createHash('md5').update(`${method.toUpperCase()}:${path}`).digest('hex')
      , hash = crypto.createHash('md5').update(`${hashOne}:${nonce}:${hashTwo}`).digest('hex');

    if (!clientId) {
      throw new ApiError('clientId has not been provided, unable to build a digest response');
    }

    if (!clientSecret) {
      throw new ApiError('clientSecret has not been provided, unable to build a digest response');
    }

    return hash;
  }

  /**
   * Constructs the digest authorization header value from the provided details.
   * @param {String} realm
   * @param {String} nonce
   * @param {String} method
   * @param {String} path
   * @returns {string} The value to be used for the "Authorization" Header.
   */
  getAuthorizationHeaderDigest(realm, nonce, method, path) {
    const clientId = this.clientId
      , response = this.getDigestResponse(realm, nonce, method, path)
    ;
    return `Digest username="${clientId}", realm="${realm}", nonce="${nonce}", uri="${path}", response="${response}"`;
  }

  /**
   * Constructs the basic authorization header value from the provided details.
   *
   * This is really poor for security, it is only included to complete the implementation of the APIs, you are strongly
   * advised to use the digest authorization instead.

   * @returns {string} The value to be used for the "Authorization" Header.
   */
  getAuthorizationHeaderBasic() {
    const clientId = this.clientId
      , clientSecret = this.clientSecret
      , encoded = Buffer.from(`${clientId}:${clientSecret}`, 'ascii').toString('base64')
    ;
    return `Basic ${encoded}`;
  }

  /**
   * Exchanges the code for OAuth tokens.
   * @param code The authorization code that is provided as part of the OAuth flow.
   * @returns {Promise<OAuthTokens>} The OAuth Tokens obtained from the remote portal.
   */
  getToken(code) {
    const self = this
      , requestConfig = {
        baseURL: self.baseUrl,
        url: '/oauth2/token',
        method: 'POST',
        params: {
          code: code,
          grant_type: 'authorization_code'
        },
        headers: {
          'Accept': 'application/json'
        },
        responseType: 'json'
      }
      , start = Date.now()
    ;

    return axios.request(requestConfig)
      .catch(err => {
        return self._respondWithDigest(err, requestConfig);
      })
      .then(res => {
        if (res.status === 200) {
          return self._processTokens(start, res.data);
        } else {
          throw new ApiError(`Unexpected status code from getting token: ${res.status}`);
        }
      });
  }

  /**
   * Refreshes the existing tokens by exchangin the current refresh token for new access and refresh tokens.
   *
   * After calling this the old tokens will no longer be valid. The new tokens obtained will be injected back into the
   * API for future calls.
   *
   * You should ensure you save the new tokens in place of the previous ones that you used to establish the original
   * remote connection.
   *
   * @param refreshToken The refresh token to exchange for new tokens.
   * @returns {Promise<OAuthTokens>} The new refreshed tokens.
   */
  refreshTokens(refreshToken) {
    const self = this
      , requestConfig = {
        baseURL: self.baseUrl,
        url: '/oauth2/refresh',
        method: 'POST',
        data: `refresh_token=${refreshToken}`,
        params: {
          grant_type: 'refresh_token'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        responseType: 'json'
      }
      , start = Date.now()
      ;

    return axios.request(requestConfig)
      .catch(err => {
        return self._respondWithDigest(err, requestConfig);
      })
      .then(res => {
        if (res.status === 200) {
          return self._processTokens(start, res.data);
        } else {
          throw new ApiError(`Unexpected status code from refreshing tokens: ${res.status}`);
        }
      });
  }

  /**
   * Creates a new remote user
   * @param {number=} remoteBridgeId The id of the hue bridge in the remote portal, usually 0.
   * @param {String=} deviceType The user device type identifier (this is shown to the end users on the remote access portal). If not specified will default to 'node-hue-api-remote'.
   * @returns {Promise<String>} The new remote username.
   */
  createRemoteUsername(remoteBridgeId, deviceType) {
    const self = this
      , accessToken = self.accessToken
    ;

    if (Number.isNaN(Number.parseInt(remoteBridgeId))) {
      // default to bridge id 0 (as this will be the case for most users
      remoteBridgeId = 0;
    }

    if (!accessToken) {
      throw new ApiError('No current valid access token, you need to fetch an access token before continuing.');
    }

    const remoteApi = axios.create({
      baseURL: self.baseUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    });

    return remoteApi.put(`/bridge/${remoteBridgeId}/config`, {'linkbutton': true})
      .then(res => {
        if (!util.wasSuccessful(res.data)) {
          throw new ApiError(`Issue with activating remote link button, attempt was not successful: ${JSON.stringify(res.data)}`);
        }

        return remoteApi.post('/bridge', {devicetype: deviceType || 'node-hue-api-remote'})
          .then(res => {
            if (util.wasSuccessful(res.data)) {
              return res.data[0].success.username;
            } else {
              throw new ApiError(`Failed to create a remote whitelist user: ${JSON.stringify(res.data)}`);
            }
          });
      });
  }

  /** @private */
  _respondWithDigest(err, requestConfig) {
    // We need this information to build the digest Authorization header and get the nonce that we can use for the
    // request that will be properly validated and issue us the authorization tokens.
    if (!err.response) {
      throw new ApiError(`Did not get expected error response from remote API: ${err.message}`);
    }

    const status = err.response.status;
    if (status !== 401) {
      throw new ApiError(`Did not get the expected 401 response from the remote API that contains the www-authenticate details needed to proceed, got status ${status}`);
    }

    const wwwAuthenticate = getAuthenticationDetailsFromHeader(err.response)
      , digestHeader = this.getAuthorizationHeaderDigest(wwwAuthenticate.realm, wwwAuthenticate.nonce, requestConfig.method, requestConfig.url)
    ;

    requestConfig.headers = {
      'Authorization': digestHeader
    };

    return axios.request(requestConfig);
  }

  /** @private */
  _processTokens(start, data) {
    this.setAccessToken(data.access_token, start + (data.access_token_expires_in * 1000));
    this.setRefreshToken(data.refresh_token, start + (data.refresh_token_expires_in * 1000));

    return new OAuthTokens(this._tokens);
  }
};

function getAuthenticationDetailsFromHeader(response) {
  if (!response || !response.headers) {
    throw new ApiError('Response object is missing headers property');
  }

  if (!response.headers['www-authenticate']) {
    throw new ApiError('Response is missing the "www-authenticate" header');
  }

  const wwwAuthenticate = response.headers['www-authenticate']
    , realm = /realm="(.*?)"/.exec(wwwAuthenticate)[1]
    , nonce = /nonce="(.*?)"/.exec(wwwAuthenticate)[1]
  ;

  return {
    realm: realm,
    nonce: nonce,
  };
}
