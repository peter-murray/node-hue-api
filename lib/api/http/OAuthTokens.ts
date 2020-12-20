
export type Token = {
  value: string,
  expiresAt: number
}

type Tokens = {
  accessToken: Token,
  refreshToken: Token,
}

export class OAuthTokens {

  private readonly _data: Tokens;

  constructor(other?: OAuthTokens) {
    this._data = {
      accessToken: {
        value: undefined,
        expiresAt: -1
      },
      refreshToken: {
        value: undefined,
        expiresAt: -1
      }
    };

    if (other) {
      this._setAccessToken(other.accessToken, other.accessTokenExpiresAt);
      this._setRefreshToken(other.refreshToken, other.refreshTokenExpiresAt);
    }
  }

  _setAccessToken(token: string, expiresAt?: number) {
    this._data.accessToken.value = token;
    this._data.accessToken.expiresAt = expiresAt || -1;
  }

  _setRefreshToken(token: string, expiresAt?: number) {
    this._data.refreshToken.value = token;
    this._data.refreshToken.expiresAt = expiresAt || -1;
  }

  get refreshToken(): string {
    return this._data.refreshToken.value;
  }

  get accessToken(): string {
    return this._data.accessToken.value;
  }

  /**
   * Gets the access token expiry if known
   * @returns the timestamp value of the expiry of the access token, or -1 os not known
   */
  get accessTokenExpiresAt(): number {
    return this._data.accessToken.expiresAt;
  }

  /**
   * Gets the refresh token expiry if known
   * @returns the timestamp value of the expiry of the refresh token, or -1 os not known
   */
  get refreshTokenExpiresAt(): number {
    return this._data.refreshToken.expiresAt;
  }

  toString(): string {
    return JSON.stringify(this._data, null, 2);
  }
};