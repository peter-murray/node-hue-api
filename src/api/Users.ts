import { ApiDefinition } from './http/ApiDefinition';
import { configurationApi, CreatedUser } from './http/endpoints/configuration';
import { model } from '@peter-murray/hue-bridge-model';
import { KeyValueType } from '../commonTypes';
import { Cache } from './Cache';
import { Api } from './Api';

export type UserRecord = {
  username: string,
  [key: string]: any
}

export class Users extends ApiDefinition {

  constructor(hueApi: Api) {
    super(hueApi);
  }

  getAll(): Promise<UserRecord[]> {
    return getAllUsersAsArray(this);
  }

  getUser(username: string): Promise<UserRecord | undefined> {
    return this.getAll()
      .then(users => {
        if (users.length > 0) {
          const filtered = users.filter(user => {
            return user.username === username;
          });

          if (filtered) {
            return filtered[0];
          }
        }

        return undefined;
      });
  }

  // /**
  //  * @deprecated Use getUserByName(username) instead
  //  * @param username {string}
  //  */
  // get(username) {
  //   util.deprecatedFunction('5.x', 'users.get(username)', 'Use users.getUser(username) instead.');
  //   return this.getUser(username);
  // }

  getUserByName(appName: string, deviceName?: string): Promise<UserRecord[]> {
    let nameToMatch: string;

    if (deviceName) {
      nameToMatch = `${appName}#${deviceName}`;
    } else {
      nameToMatch = appName;
    }

    return getAllUsersAsArray(this)
      .then(users => {
        return users.filter(user => user.name === nameToMatch);
      });
  }

  // /**
  //  * @deprecated use getUserByName(appName, deviceName) instead.
  //  * @param appName {string}
  //  * @param deviceName {string}
  //  * @returns {Promise<Object[]>}
  //  */
  // getByName(appName, deviceName) {
  //   util.deprecatedFunction('5.x', 'users.getByName(appName, deviceName)', 'Use users.getUserByName(appName, deviceName) instead.');
  //   return this.getUserByName(appName, deviceName);
  // }

  createUser(appName: string, deviceName?: string): Promise<CreatedUser> {
    return this.hueApi.getCachedState()
      .then((state: Cache | undefined) => {
        //TODO may need to combine the modelid and API version, but am assuming that all newer bridges are kept up to
        // date, as do not know the specific version number of the introduction of the generateclientkey parameter.

        // Default to always reporting an old bridge if we cannot get the state
        let oldBridge = true;
        if (state) {
          oldBridge = state.modelid === 'BSB001';
        }
        
        if (appName.length > 20) {
          throw new Error("appName is too long");
        } else if (deviceName && deviceName.length > 19) {
          throw new Error("deviceName is too long");
        }
        
        return this.execute(configurationApi.createUser, {
          appName: appName,
          deviceName: deviceName,
          generateKey: !oldBridge
        });
      });
  }

  deleteUser(username: string): Promise<boolean> {
    return this.execute(configurationApi.deleteUser, {element: username});
  }
}

function getAllUsers(api: ApiDefinition): Promise<KeyValueType | undefined> {
  return api.execute(configurationApi.getConfiguration)
    .then((config: model.BridgeConfiguration) => {
      return config.whitelist || undefined;
    });
}

function getAllUsersAsArray(api: ApiDefinition): Promise<UserRecord[]> {
  return getAllUsers(api)
    .then((users: KeyValueType | undefined) => {
      const results: UserRecord[] = [];

      if (users) {
        Object.keys(users).forEach(username => {
          results.push(Object.assign({username: username}, users[username]));
        });
      }

      return results;
    });
}
