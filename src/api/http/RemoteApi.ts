import * as httpClient from './HttpClientFetch';
import { ApiError } from '../../ApiError';
import { FetchResult, HttpClientFetch, HTTPHeaders, RequestConfig } from './HttpClientFetch';
import { OAuthTokens, Tokens } from './OAuthTokens';
import { wasSuccessful } from '../../util';

import { createHash } from 'crypto';

// This class is a bit different to the other endpoints currently as they operate in a digest challenge for the most
// part and also operate off a different base url compared with the local/remote endpoints that make up the rest of the
// bridge API commands.

export class RemoteApi {

  private _config: {
    clientId: string,
    clientSecret: string,
    baseUrl: URL,
  };

  private _tokens: OAuthTokens;

  constructor(clientId: string, clientSecret: string) {
    this._config = {
      clientId: clientId,
      clientSecret: clientSecret,
      baseUrl: new URL('https://api.meethue.com'),
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
    return this._config.baseUrl.href;
  }

  get accessToken(): string | undefined {
    return this._tokens.accessTokenValue;
  }

  get accessTokenExpiry(): number | undefined {
    return this._tokens.accessTokenExpiresAt;
  }

  get refreshToken(): string | undefined {
    return this._tokens.refreshTokenValue;
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
      , hashOne = createHash('md5').update(`${clientId}:${realm}:${clientSecret}`).digest('hex')
      , hashTwo = createHash('md5').update(`${method.toUpperCase()}:${path}`).digest('hex')
      , hash = createHash('md5').update(`${hashOne}:${nonce}:${hashTwo}`).digest('hex');

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
  getToken(code: string): Promise<Tokens> {
    const self = this
      , config = {
        baseURL: self.baseUrl,
        headers: {
          'Accept': 'application/json'
        },
        responseType: 'json',
      }
      , requestConfig = {
        url: '/v2/oauth2/token',
        method: 'POST',
        params: {
          code: code,
          grant_type: 'authorization_code'
        },
        validateStatus: (status: number) => {
          return status === 401;
        }
      }
      , start = Date.now()
    ;

    const http = httpClient.create(config);

    return http.request(requestConfig)
      .then(res => {
        return self._respondWithDigest(http, res, requestConfig);
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
   * @returns Promise<Tokens> The new refreshed tokens.
   */
  refreshTokens(refreshToken: string): Promise<Tokens> {
    const self = this
      , config = {
        baseURL: self.baseUrl,
        headers: {
          'Accept': 'application/json'
        },
        responseType: 'json',
      }
      , requestConfig: RequestConfig = {
        url: '/v2/oauth2/token',
        method: 'POST',
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        },
        validateStatus: (status: number) => {
          return status === 401;
        }
      }
      , start = Date.now()
    ;

    const http = httpClient.create(config);

    return http.request(requestConfig)
      .then(res => {
        return self._respondWithDigest(http, res, requestConfig);
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
      }
    });

    // return remoteApi.put(`/bridge/${remoteBridgeId}/config`, {'linkbutton': true})
    return remoteApi.request({
      url: `/bridge/${remoteBridgeId}/config`,
      method: 'PUT',
      data: {'linkbutton': true},
      json: true,
    }).then(res => {
      if (!wasSuccessful(res.data)) {
        throw new ApiError(`Issue with activating remote link button, attempt was not successful: ${JSON.stringify(res.data)}`);
      }

      // return remoteApi.post('/bridge', {devicetype: deviceType || 'node-hue-api-remote'})
      return remoteApi.request({
        url: '/bridge',
        data: {devicetype: deviceType || 'node-hue-api-remote'},
        method: 'POST',
        json: true,
      }).then(res => {
        if (wasSuccessful(res.data)) {
          return res.data[0].success.username;
        } else {
          throw new ApiError(`Failed to create a remote whitelist user: ${JSON.stringify(res.data)}`);
        }
      });
    });
  }

  private _respondWithDigest(http: HttpClientFetch, res: FetchResult, requestConfig: RequestConfig) {
    // We need this information to build the digest Authorization header and get the nonce that we can use for the
    // request that will be properly validated and issue us the authorization tokens.
    const status = res.status;
    if (status !== 401) {
      throw new ApiError(`Did not get the expected 401 response from the remote API that contains the www-authenticate details needed to proceed, got status ${status}`);
    }

    const wwwAuthenticate = getAuthenticationDetailsFromHeader(res.headers)
      , digestHeader = this.getAuthorizationHeaderDigest(wwwAuthenticate.realm, wwwAuthenticate.nonce, requestConfig.method, requestConfig.url)
    ;

    requestConfig.headers = {
      'Authorization': digestHeader
    };
    requestConfig.validateStatus = undefined;

    return http.request(requestConfig);
  }

  private _processTokens(start: number, data: TokenResponse): Tokens {
    this.setAccessToken(data.access_token, start + (data.expires_in * 1000));
    this.setRefreshToken(data.refresh_token, start + (data.expires_in * 1000));

    // We have just set the tokens
    return {
      // @ts-ignore
      accessToken: this._tokens.accessToken,
      // @ts-ignore
      refreshToken: this._tokens.refreshToken,
    };
  }
}

type TokenResponse = {
  access_token: string,
  expires_in: number,
  refresh_token: string,
  token_type: string,
}

//TODO define the type of the response in the error header
type AuthDetails = {
  nonce: string
  realm: string
}

function getAuthenticationDetailsFromHeader(headers?: HTTPHeaders): AuthDetails {
  // if (!response || !response.headers) {
  //   throw new ApiError('Response object is missing headers property');
  // }

  if (!headers) {
    throw new ApiError('No headers provided');
  }

  if (!headers['www-authenticate']) {
    throw new ApiError('Response is missing the "www-authenticate" header');
  }

  const wwwAuthenticate: string = headers['www-authenticate'];

  const realmResult = /realm="(.*?)"/.exec(wwwAuthenticate);
  if (!realmResult) {
    throw new ApiError(`Realm was not found in www-authenticate header '${wwwAuthenticate}'`);
  }

  const nonceResult = /nonce="(.*?)"/.exec(wwwAuthenticate);
  if (!nonceResult) {
    throw new ApiError(`Nonce was not found in www-authenitcate header '${wwwAuthenticate}'`);
  }

  return {
    realm: realmResult[1],
    nonce: nonceResult[1],
  };
}
