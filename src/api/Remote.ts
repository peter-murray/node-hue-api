import { OAuthTokens, Token, Tokens } from './http/OAuthTokens';
import { Api } from './Api';
import { ApiError } from '../ApiError';

type RemoteAccessCredentials = {
  clientId: string
  clientSecret: string
  tokens: {
    access?: Partial<Token>,
    refresh?: Partial<Token>,
  }
  username: string
}

type OptionalRemoteAccessCredentials = Partial<RemoteAccessCredentials>

export class Remote {

  private _hueApi: Api;

  constructor(hueApi: Api) {
    this._hueApi = hueApi;
  }

  /**
   * Exchanges the code for a token on the remote API.
   * @param code The code to exchange for a new token.
   * @returns The token from the remote API.
   */
  getToken(code: string): Promise<Partial<Tokens>> {
    return this._getRemoteApi().getToken(code);
  }

  /**
   * Will refresh the OAuth tokens on the remote API, exchanging the existing ones for new ones.
   * @returns The new access and refresh tokens.
   */
  refreshTokens(): Promise<Partial<Tokens>> {
    const self = this
      , remoteApi = self._getRemoteApi()
    ;

    if (!remoteApi.refreshToken) {
      return Promise.reject(new ApiError('Cannot refresh tokens without a refresh token.'));
    }

    return remoteApi.refreshTokens(remoteApi.refreshToken)
      .then((tokens: Tokens) => {
        // Update the authentication details for existing connections
        self._getHueApi()._getTransport().refreshAuthorizationHeader(tokens.accessToken.value);
        return tokens;
      });
  }

  /**
   * Creates a new remote user for the Hue Bridge.
   *
   * @param remoteBridgeId The is of the hue bridge on the remote portal
   * @param deviceType The user device type identifier.
   */
  createRemoteUser(remoteBridgeId: string, deviceType: string): Promise<string> {
    return this._getRemoteApi().createRemoteUsername(remoteBridgeId, deviceType);
  }

  /** Obtains the remote access credentials that are in use for the remote connection. */
  getRemoteAccessCredentials(): OptionalRemoteAccessCredentials {
    const config = this._getHueApi()._getConfig();

    const result: OptionalRemoteAccessCredentials = {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      username: config.username,
      tokens: {},
    };

    if (config.accessToken) {
      // @ts-ignore it is set above
      result.tokens.access = {
        value: config.accessToken,
        expiresAt: config.accessTokenExpiry
      };
    }

    if (config.refreshToken) {
      // @ts-ignore it is set above
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
}