import { KeyValueType } from '../../commonTypes';

export type Token = {
  value: string,
  expiresAt: number
}

export type Tokens = {
  accessToken: Token,
  refreshToken: Token,
}

export type OptionalTokens = Partial<Tokens>

export class OAuthTokens {

  private _accessTokenValue: Partial<Token>;

  private _refreshTokenValue: Partial<Token>;

  constructor(other?: OAuthTokens) {
    this._accessTokenValue = {};
    this._refreshTokenValue = {};

    if (other) {
      if (other.accessTokenValue) {
        this._setAccessToken(other.accessTokenValue, other.accessTokenExpiresAt);
      }

      if (other.refreshTokenValue) {
        this._setRefreshToken(other.refreshTokenValue, other.refreshTokenExpiresAt);
      }
    }
  }

  _setAccessToken(token: string, expiresAt?: number) {
    this._accessTokenValue.value = token;
    this._accessTokenValue.expiresAt = expiresAt;
  }

  _setRefreshToken(token: string, expiresAt?: number) {
    this._refreshTokenValue.value = token;
    this._refreshTokenValue.expiresAt = expiresAt;
  }

  get refreshTokenValue(): string | undefined {
    return this._refreshTokenValue?.value;
  }

  get accessTokenValue(): string | undefined {
    return this._accessTokenValue?.value;
  }

  /**
   * Gets the access token expiry if known
   * @returns the timestamp value of the expiry of the access token, or -1 os not known
   */
  get accessTokenExpiresAt(): number {
    if (this._accessTokenValue?.expiresAt !== undefined) {
      return this._accessTokenValue.expiresAt;
    }
    return -1;
  }

  /**
   * Gets the refresh token expiry if known
   * @returns the timestamp value of the expiry of the refresh token, or -1 os not known
   */
  get refreshTokenExpiresAt(): number {
    if (this._refreshTokenValue?.expiresAt !== undefined) {
      return this._refreshTokenValue.expiresAt;
    }
    return -1;
  }

  get accessToken(): Token | undefined {
    if (this.accessTokenValue) {
      return {value: this.accessTokenValue, expiresAt: this.accessTokenExpiresAt}
    }
    return undefined;
  }

  get refreshToken(): Token | undefined {
    if (this.refreshTokenValue) {
      return {value: this.refreshTokenValue, expiresAt: this.refreshTokenExpiresAt}
    }
    return undefined;
  }

  toString(): string {
    const data: KeyValueType = {}
      , refresh = this.refreshToken
      , access = this.accessToken
    ;

    if (access) {
      data.accessToken = this.accessToken;
    }

    if (refresh) {
      data.refreshToken = this.refreshToken
    }

    return JSON.stringify(data, null, 2);
  }
}