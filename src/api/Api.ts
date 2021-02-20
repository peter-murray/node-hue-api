import { Remote } from './Remote';
import { Cache } from './Cache';
import { ConfigParameters, HueApiConfig } from './HueApiConfig';
import { RemoteApi } from './http/RemoteApi';
import { Transport } from './http/Transport';
import { Capabilities } from './Capabilities';
import { Configuration } from './Configuration';
import { Groups } from './Groups';
import { Lights } from './Lights';
import { ResourceLinks } from './ResourceLinks';
import { Rules } from './Rules';
import { Scenes } from './Scenes';
import { Schedules } from './Schedules';
import { Sensors } from './Sensors';
import { Users } from './Users';

import { model } from '@peter-murray/hue-bridge-model';
type Light = model.Light

type ApiImplementationMap = {
  capabilities: Capabilities,
  configuration: Configuration,
  lights: Lights,
  groups: Groups,
  sensors: Sensors,
  schedules: Schedules,
  scenes: Scenes,
  users: Users,
  rules: Rules,
  resourceLinks: ResourceLinks,
  remote?: Remote,
}

export class Api {

  private readonly _config: HueApiConfig;

  private _api: ApiImplementationMap;

  private _syncPromise?: Promise<any>;

  private _lastSyncTime: number = -1;

  private _state?: Cache = undefined;

  constructor(config: ConfigParameters, transport: Transport, remote?: RemoteApi) {
    this._config = new HueApiConfig(config, transport, remote);

    this._api = {
      capabilities: new Capabilities(this),
      configuration: new Configuration(this),
      lights: new Lights(this),
      groups: new Groups(this),
      sensors: new Sensors(this),
      schedules: new Schedules(this),
      scenes: new Scenes(this),
      users: new Users(this),
      rules: new Rules(this),
      resourceLinks: new ResourceLinks(this)
    };

    // Add the remote API if this is a remote instance of the API
    if (this._config.isRemote) {
      this._api.remote = new Remote(this);
    }

    //TODO initial investigation in to the Streaming API for Entertainment
    // if (config.clientkey) {
    //   self.entertainment = new EntertainmentApi(self);
    // }

    // Load the initial state upon first connection
    this.syncWithBridge();
  }

  get capabilities(): Capabilities {
    return this._api.capabilities;
  }

  get configuration(): Configuration {
    return this._api.configuration;
  }

  get lights(): Lights {
    return this._api.lights;
  }

  get groups(): Groups {
    return this._api.groups;
  }

  get sensors(): Sensors {
    return this._api.sensors;
  }

  get schedules(): Schedules {
    return this._api.schedules;
  }

  get scenes(): Scenes {
    return this._api.scenes;
  }

  get users(): Users {
    return this._api.users;
  }

  get rules(): Rules {
    return this._api.rules;
  }

  get resourceLinks(): ResourceLinks {
    return this._api.resourceLinks;
  }

  /**
   * Obtains the remote API endpoints, this will only be present if you have a remote connection established.
   */
  get remote(): Remote | undefined {
    return this._api.remote;
  }

  /**
   * Obtains the previously cached state that was obtained from the bridge.
   */
  getCachedState(): Promise<Cache | undefined> {
    const self = this;

    if (self.isSyncing() && self._syncPromise) {
      return self._syncPromise.then(() => {
        return self._state;
      });
    } else {
      return Promise.resolve(self._state);
    }
  }

  /**
   * Checks to see if the API is still syncing with the Hue bridge.
   */
  isSyncing() {
    return this._syncPromise != undefined;
  }

  /**
   * The timestamp of the last sync for the cached state.
   */
  getLastSyncTime(): number {
    return this._lastSyncTime;
  }

  /**
   * Performs an async synchronization activity with the hue bridge to cache the state of things like lights, etc...
   */
  syncWithBridge(): void {
    const self = this;

    if (!self.isSyncing()) {
      let dataSync: Promise<any>;

      if (self._config.username) {
        // We can only sync if there is a username passed to us, which will not be the case if we are creating the user
        // first.
        dataSync = self.configuration.getAll();
      } else {
        // We can only obtain the open config when no user is passed in
        dataSync = self.configuration.getUnauthenticatedConfig();
      }

      self._syncPromise = dataSync.then(data => {
        self._state = new Cache(data);
        self._lastSyncTime = new Date().getTime();
        self._syncPromise = undefined;
      }).catch(err => {
        // This is an informational message for now as we do not yet want to blow up as it is difficult to see the
        // context of this reported error from users so far.
        console.error(`Failed to async load the bridge configuration data; ${err}`);
        self._syncPromise = undefined;
      });
    }
  }

  getLightDefinition(id: number | string): Promise<Light | undefined> {
    return this.getCachedState()
      .then(() => {
        return this._state?.getLight(id);
      });
  }

  _getConfig(): HueApiConfig {
    return this._config;
  }

  _getTransport(): Transport {
    return this._config.transport;
  }

  _getRemote(): RemoteApi {
    return this._config.remote;
  }
};