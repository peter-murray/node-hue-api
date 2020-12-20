import * as httpClient from './HttpClientFetch';
import { ApiError } from '../../ApiError';
import { HttpClientFetch, RequestConfig } from './HttpClientFetch';
import { OAuthTokens } from './OAuthTokens';
import {wasSuccessful} from '../../util';

import crypto = require('crypto');

// This class is a bit different to the other endpoints currently as they operate in a digest challenge for the most
// part and also operate off a different base url compared with the local/remote endpoints that make up the rest of the
// bridge API commands.

export class RemoteApi {

  private _config: {
    clientId: string,
    clientSecret: string,
    baseUrl: string,
  };

  private _tokens: OAuthTokens;

  constructor(clientId: string, clientSecret: string) {
    this._config = {
      clientId: clientId,
      clientSecret: clientSecret,
      baseUrl: 'https://api.meethue.com'
    };

    this._tokens = new OAuthTokens();
  }

  get clientId(): string {
    return this._config.clientId;
  }

  get clientSecret(): string {
    return this._config.clientSecret;
  }

  get baseUrl(): string {
    return this._config.baseUrl;
  }

  get accessToken(): string {
    return this._tokens.accessToken;
  }

  get accessTokenExpiry(): number | undefined {
    return this._tokens.accessTokenExpiresAt;
  }

  get refreshToken(): string {
    return this._tokens.refreshToken;
  }

  get refreshTokenExpiry(): number | undefined {
    return this._tokens.refreshTokenExpiresAt;
  }

  setAccessToken(token: string, expiry?: number): RemoteApi {
    this._tokens._setAccessToken(token, expiry);
    return this;
  }

  setRefreshToken(token: string, expiry?: number): RemoteApi {
    this._tokens._setRefreshToken(token, expiry);
    return this;
  }

  /**
   * Builds the digest response to pass to the remote API for the provided request details.
   */
  getDigestResponse(realm: string, nonce: string, method: string, path: string): string {
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
   * @returns {string} The value to be used for the "Authorization" Header.
   */
  getAuthorizationHeaderDigest(realm: string, nonce: string, method: string, path: string): string {
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
  getAuthorizationHeaderBasic(): string {
    const clientId = this.clientId
      , clientSecret = this.clientSecret
      , encoded = Buffer.from(`${clientId}:${clientSecret}`, 'ascii').toString('base64')
    ;
    return `Basic ${encoded}`;
  }

  /**
   * Exchanges the code for OAuth tokens.
   * @param code The authorization code that is provided as part of the OAuth flow.
   * @returns The OAuth Tokens obtained from the remote portal.
   */
  getToken(code: string): Promise<OAuthTokens> {
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

    return httpClient.request(requestConfig)
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
   * Refreshes the existing tokens by exchanging the current refresh token for new access and refresh tokens.
   *
   * After calling this the old tokens will no longer be valid. The new tokens obtained will be injected back into the
   * API for future calls.
   *
   * You should ensure you save the new tokens in place of the previous ones that you used to establish the original
   * remote connection.
   *
   * @param refreshToken The refresh token to exchange for new tokens.
   * @returns The new refreshed tokens.
   */
  refreshTokens(refreshToken: string): Promise<OAuthTokens> {
    const self = this
      , requestConfig: RequestConfig = {
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

    return httpClient.request(requestConfig)
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
   * @param remoteBridgeId The id of the hue bridge in the remote portal, usually 0.
   * @param deviceType The user device type identifier (this is shown to the end users on the remote access portal). If not specified will default to 'node-hue-api-remote'.
   * @returns The new remote username.
   */
  createRemoteUsername(remoteBridgeId?: number | string, deviceType?: string): Promise<string> {
    const self = this
      , accessToken = self.accessToken
    ;

    if (Number.isNaN(Number.parseInt(remoteBridgeId as string))) {
      // default to bridge id 0 (as this will be the case for most users
      remoteBridgeId = 0;
    }

    if (!accessToken) {
      throw new ApiError('No current valid access token, you need to fetch an access token before continuing.');
    }

    const remoteApi: HttpClientFetch = httpClient.create({
      baseURL: self.baseUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    });

    // return remoteApi.put(`/bridge/${remoteBridgeId}/config`, {'linkbutton': true})
    return remoteApi.request({
      url: `/bridge/${remoteBridgeId}/config`,
      method: 'PUT',
      data: {'linkbutton': true},
    }).then(res => {
      if (!wasSuccessful(res.data)) {
        throw new ApiError(`Issue with activating remote link button, attempt was not successful: ${JSON.stringify(res.data)}`);
      }

      // return remoteApi.post('/bridge', {devicetype: deviceType || 'node-hue-api-remote'})
      return remoteApi.request({
        url: '/bridge',
        data: {devicetype: deviceType || 'node-hue-api-remote'},
        method: 'POST'
      }).then(res => {
        if (wasSuccessful(res.data)) {
          return res.data[0].success.username;
        } else {
          throw new ApiError(`Failed to create a remote whitelist user: ${JSON.stringify(res.data)}`);
        }
      });
    });
  }


  //TODO deal with err object
  private _respondWithDigest(err: any, requestConfig: RequestConfig) {
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

    return httpClient.request(requestConfig);
  }

  private _processTokens(start: number, data: TokenResponse) {
    this.setAccessToken(data.access_token, start + (data.access_token_expires_in * 1000));
    this.setRefreshToken(data.refresh_token, start + (data.refresh_token_expires_in * 1000));

    return new OAuthTokens(this._tokens);
  }
};

type TokenResponse = {
  access_token: string,
  access_token_expires_in: number,
  refresh_token: string,
  refresh_token_expires_in: number,
}

//TODO define the type of the response in the error header
type AuthDetails = {
  nonce: string
  realm: string
}
function getAuthenticationDetailsFromHeader(response: any): AuthDetails {
  if (!response || !response.headers) {
    throw new ApiError('Response object is missing headers property');
  }

  if (!response.headers['www-authenticate']) {
    throw new ApiError('Response is missing the "www-authenticate" header');
  }

  const wwwAuthenticate: string = response.headers['www-authenticate'];

  const realmResult = /realm="(.*?)"/.exec(wwwAuthenticate)
  if (!realmResult) {
    throw new ApiError(`Realm was not found in www-authenticate header '${wwwAuthenticate}'`);
  }

  const nonceResult = /nonce="(.*?)"/.exec(wwwAuthenticate)
  if (!nonceResult) {
    throw new ApiError(`Nonce was not found in www-authenitcate header '${wwwAuthenticate}'`)
  }

  return {
    realm: realmResult[1],
    nonce: nonceResult[1],
  };
}
