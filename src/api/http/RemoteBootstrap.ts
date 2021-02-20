import { create } from './HttpClientFetch';
import { RemoteApi } from './RemoteApi';
import { Api } from '../Api';
import { Transport } from './Transport';

export class RemoteBootstrap {

  private readonly clientId: string;

  private readonly clientSecret: string;

  private remoteApi: RemoteApi;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.remoteApi = new RemoteApi(clientId, clientSecret);
  }

  /**
   * Obtains the AuthCode URL that can be used to request OAuth tokens for your user/application details
   * @param deviceId The device ID of the remote application.
   * @param appId The application ID of the remote application.
   * @param state A unique state value that will be provided back to you in the reponse payload to prevent against cross-site forgeries.
   * @returns The URL that can be used to start the exchange for OAuth tokens.
   */
  getAuthCodeUrl(deviceId: string, appId: string, state: string): string {
    // if (! deviceId) {
    //   throw new ApiError('A unique deviceid is required for your application when accessing the Remote API');
    // }
    //
    // if (! state) {
    //   throw new ApiError('A state value must be provided to mitigate against cross-site request forgeries');
    // }
    //
    // if (! appId) {
    //   throw new ApiError('An Application ID (appId parameter) must be provided that matches the AppId for the remote application you registered with the Hue Portal');
    // }
    return `${this.remoteApi.baseUrl}/oauth2/auth?clientid=${this.clientId}&state=${state}&deviceid=${deviceId}&appid=${appId}&response_type=code`;
  }

  /**
   * Connects to the Remote API using the provided access code, exchanging it for valid OAuth tokens that can be used
   * to connect again in the future.
   *
   * This function is used to bootstrap the first connection to the remote API for a new application.
   *
   * @param code The authorization code obtained from the callback made by the remote portal to your application
   * @param username The username for the remote application.
   * @param timeout The timeout for the access token request to the remote API, defaults to 12 seconds
   * @param deviceType The device type for the application connection.
   * @param remoteBridgeId The id of the bridge in the remote portal, defaults to 0.
   */
  connectWithCode(code: string, username?: string, timeout?: number, deviceType?: string, remoteBridgeId?: number): Promise<Api> {
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

  /**
   * Connects to the Remote API using the provided OAuth tokens that were previously obtained.
   * @param accessToken The OAuth access token.
   * @param refreshToken The OAuth refresh token.
   * @param username The remote username used to connect with hue bridge
   * @param timeout The timeout for the access token request to the remote API, defaults to 12 seconds
   * @param deviceType The device type for the application connection.
   */
  connectWithTokens(accessToken: string, refreshToken: string, username?: string, timeout?: number, deviceType?: string): Promise<Api> {
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

  private _getRemoteApi(username: string, timeout?: number) {
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

    const clientConfig = {
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${self.remoteApi.accessToken}`
        },
        timeout: getTimeout(timeout)
      }
      , transport = new Transport(create(clientConfig), username)
      , api = new Api(config, transport, self.remoteApi)
    ;
    return Promise.resolve(api);
  }
};


function getTimeout(timeout: number | undefined) {
  return timeout || 12000; // 12 Seconds
}