import { OAuthTokens, Token } from './http/OAuthTokens';
import { Api } from './Api';

type RemoteAccessCredentials = {
  clientId: string
  clientSecret: string
  tokens: {
    access?: Token,
    refresh?: Token,
  }
  username: string
}

export class Remote {

  private _hueApi: Api;

  constructor(hueApi) {
    this._hueApi = hueApi;
  }

  /**
   * Exchanges the code for a token on the remote API.
   * @param code The code to exchange for a new token.
   * @returns The token from the remote API.
   */
  getToken(code: string): Promise<OAuthTokens> {
    return this._getRemoteApi().getToken(code);
  }

  /**
   * Will refresh the OAuth tokens on the remote API, exchanging the existing ones for new ones.
   * @returns The new access and refresh tokens.
   */
  refreshTokens(): Promise<OAuthTokens> {
    const self = this
      , remoteApi = self._getRemoteApi()
    ;

    return remoteApi.refreshTokens(remoteApi.refreshToken)
      .then((tokens: OAuthTokens) => {
        // Update the authentication details for existing connections
        self._getHueApi()._getTransport().refreshAuthorizationHeader(tokens.accessToken);
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
  getRemoteAccessCredentials(): RemoteAccessCredentials {
    const config = this._getHueApi()._getConfig();

    const result: RemoteAccessCredentials = {
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
}