import { ApiError } from '../ApiError';
import { RemoteApi } from './http/RemoteApi';
import { Transport } from './http/Transport';

export type ConfigParameters = {
  baseUrl: string,
  username?: string,
  clientId?: string,
  clientSecret?: string,
  clientKey?: string,
  remote?: boolean
}

export class HueApiConfig {

  private _config: ConfigParameters;

  private readonly _remoteApi?: RemoteApi;

  private readonly _transport: Transport;

  private readonly _isRemote: boolean;

  constructor(config: ConfigParameters, transport: Transport, remoteApi?: RemoteApi) {
    this._config = config;
    this._remoteApi = remoteApi;
    this._transport = transport;

    this._isRemote = !!config.remote && remoteApi != undefined;
  }

  /**
   * Is the connection to the hue bridge remote.
   */
  get isRemote(): boolean {
    return this._isRemote;
  }

  /**
   * Gets the transport implementation that is used to connect with the Hue Bridge
   */
  get transport(): Transport {
    return this._transport;
  }

  /**
   * Gets the remote API in use that was used to bootstrap the remote connection.
   * @throws ApiError if the connection is local network.
   */
  get remote(): RemoteApi {
    if (this.isRemote) {
      // @ts-ignore
      return this._remoteApi;
    } else {
      throw new ApiError('This API has not been set up as a remote API');
    }
  }

  /**
   * Gets the current username used to connect/interact with the Hue Bridge.
   */
  get username(): string| undefined {
    return this._config.username;
  }

  /**
   * Gets the client id for the remote OAuth connection.
   * @throws ApiError if the connection is not remote.
   */
  get clientId(): string | undefined {
    this._requireRemote();
    // @ts-ignore
    return this._config.clientId;
  }

  /**
   * Gets the client secret for the remote OAuth connection.
   * @throws ApiError if the connection is not remote.
   */
  get clientSecret(): string | undefined {
    this._requireRemote();
    return this._config.clientSecret;
  }

  /**
   * The Base URL for communication with the bridge.
   * @returns The base URL for the hue bridge.
   */
  get baseUrl(): string {
    return this._config.baseUrl;
  }

  /**
   * Gets the client key for the entertainment API/streaming endpoints
   * @throws ApiError if the connection is not local network.
   */
  get clientKey(): string | undefined {
    this._requireLocal();
    return this._config.clientKey;
  }

  /**
   * Gets the current access token.
   * @returns {String}
   * @throws ApiError if the connection is not remote.
   */
  get accessToken(): string | undefined {
    return this.getRequiredRemote().accessToken;
  }

  /**
   * Gets the expiry timestamp of the access token.
   * @returns {number} The timestamp for the expiry or -1 if not known
   */
  get accessTokenExpiry(): number | undefined {
    return this.getRequiredRemote().accessTokenExpiry;
  }

  /**
   * Gets the current refresh token.
   * @throws ApiError if the connection is not remote.
   */
  get refreshToken(): string | undefined {
    return this.getRequiredRemote().refreshToken;
  }

  /**
   * Gets the expiry timestamp of the refresh token.
   * @returns {number} The timestamp for the expiry or -1 if not known
   */
  get refreshTokenExpiry(): number | undefined {
    return this.getRequiredRemote().refreshTokenExpiry;
  }

  private getRequiredRemote(): RemoteApi {
    this._requireRemote();
    // The above call will throw an error if we are not remote
    return this._remoteApi as RemoteApi;
  }

  private _requireRemote(): void {
    if (!this.isRemote) {
      throw new ApiError('The function is only valid on a remote Hue API instance');
    }
  }

  private _requireLocal(): void {
    if (this.isRemote) {
      throw new ApiError('The function is only valid on a local Hue API instance');
    }
  }
}