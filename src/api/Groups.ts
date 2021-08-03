import { model } from '@peter-murray/hue-bridge-model';
import { ApiDefinition } from './http/ApiDefinition';
import { groupsApi } from './http/endpoints/groups';
import { Api } from './Api';
import { HueRateLimiter } from './HueRateLimiter';

type GroupState = model.GroupState

type Luminaire = model.Luminaire
type Entertainment = model.Entertainment
type Zone = model.Zone
type Room = model.Room
type LightGroup = model.LightGroup
type Group = model.Group
type Lightsource = model.Lightsource

type AnyGroup =
  Group
  | Entertainment
  | LightGroup
  | Lightsource
  | Luminaire
  | Room
  | Zone

export class Groups extends ApiDefinition {

  private _groupStateLimiter: HueRateLimiter;

  constructor(hueApi: Api) {
    super(hueApi);
    this._groupStateLimiter = new HueRateLimiter(hueApi.name, 'groups', hueApi.rateLimitConfig.groupRateLimit);
  }

  getAll(): Promise<AnyGroup[]> {
    // Lightset 0 (all lights) is a special case, so retrieve the bridge's definition of that and prepend to the
    // existing group definitions to provide the complete list of groups.

    return Promise.all([
      this.execute(groupsApi.getGroupAttributes, {id: 0}),
      this.execute(groupsApi.getAllGroups)
    ]).then((results: any) => {
      // @ts-ignore
      results[1].unshift(results[0]);
      return results[1];
    });
  }

  getGroup(id: number | Group): Promise<AnyGroup> {
    return this.execute(groupsApi.getGroupAttributes, {id: id});
  }

  //TODO
  // get(id: number | Group): AnyGroup {
  //   util.deprecatedFunction('5.x', 'groups.get(id)', 'Use groups.getGroup(id) instead.');
  //   return this.getGroup(id);
  // }
  //
  // /**
  //  * @deprecated Use getGroupByName(name) instead.
  //  * @param name {string}
  //  * @returns {Promise<Entertainment|LightGroup|Lightsource|Luminaire|Room|Zone>}
  //  */
  // getByName(name) {
  //   util.deprecatedFunction('5.x', 'groups.getByName(name)', 'Use groups.getGroupByName(name) instead.');
  //   return this.getGroupByName(name);
  // }

  /**
   * @param name {string}
   * @returns {Promise<Array<Entertainment|LightGroup|Lightsource|Luminaire|Room|Zone>>}
   */
  getGroupByName(name: string): Promise<AnyGroup[]> {
    return this.getAll()
      .then(allGroups => {
        return allGroups.filter(group => group.name === name);
      });
  }

  createGroup(group: Group | LightGroup | Room | Entertainment | Zone): Promise<AnyGroup> {
    const self = this;

    return this.execute(groupsApi.createGroup, {group: group})
      .then(result => {
        return self.getGroup(result.id);
      });
    // if (arguments.length === 1 && group instanceof Group) {
    //   return this.execute(groupsApi.createGroup, {group: group})
    //     .then(result => {
    //       return self.getGroup(result.id);
    //     });
    // }
    //
    // util.deprecatedFunction('5.x', 'groups.createGroup(name, lights)', 'Use groups.createGroup(group) instead.');
    // const newGroup = new LightGroup();
    // newGroup.name = arguments[0];
    // newGroup.lights = arguments[1];
    // return self.createGroup(newGroup);
  }

  // /**
  //  * @deprecated use createGroup(group) instead
  //  */
  // createRoom(name, lights, roomClass) {
  //   util.deprecatedFunction('5.x', 'groups.createRoom(name, lights, roomClass)', 'Use groups.createGroup(group) instead.');
  //
  //   const group = new Room();
  //   group.name = name;
  //   group.lights = lights;
  //   group.class = roomClass;
  //   return this.createGroup(group);
  // }

  // /**
  //  * @deprecated use createGroup(group) instead
  //  */
  // createZone(name, lights, roomClass) {
  //   util.deprecatedFunction('5.x', 'groups.createZone(name, lights, roomClass)', 'Use groups.createGroup(group) instead.');
  //
  //   const group = new Zone();
  //   group.name = name;
  //   group.lights = lights;
  //   group.class = roomClass;
  //
  //   return this.createGroup(group);
  // }

  /**
   * Update the Group attributes on the bridge for the specified Group object.
   * @param group The group with updates to be updated on the bridge.
   * @returns {Promise<boolean>}
   */
  updateGroupAttributes(group: Group) {
    return this.execute(groupsApi.setGroupAttributes, {id: group.id, group: group});
  }

  // /**
  //  * Update the Group attributes on the bridge for the specified Group object.
  //  * @param group {Group} The group with updates to be updated on the bridge.
  //  * @returns {Promise<boolean>}
  //  */
  // updateAttributes(id, data) {
  //   util.deprecatedFunction('5.x', 'groups.updateAttributes(id, data)', 'Use groups.updateGroupAttributes(group) instead.');
  //   return this.execute(groupsApi.setGroupAttributes, {id: id, group: data});
  // }

  deleteGroup(id: number | AnyGroup): Promise<boolean> {
    return this.execute(groupsApi.deleteGroup, {id: id});
  }

  getGroupState(id: number | Group): Promise<object> {
    return this.getGroup(id).then((group: AnyGroup) => {
      return group.state;
    });
  }

  setGroupState(id: number | string | Group, state: GroupState): Promise<boolean> {
    const self = this;
    return self._groupStateLimiter.schedule(() => {
      return self.execute(groupsApi.setGroupState, {id: id, state: state});
    });
  }

  getLightGroups(): Promise<LightGroup[]> {
    // @ts-ignore
    return this._getByType('LightGroup');
  }


  getLuminaries(): Promise<Luminaire[]> {
    // @ts-ignore
    return this._getByType('Luminaire');
  }

  getLightSources(): Promise<Lightsource[]> {
    // @ts-ignore
    return this._getByType('Lightsource');
  }

  getRooms(): Promise<Room[]> {
    // @ts-ignore
    return this._getByType('Room');
  }

  getZones(): Promise<Zone[]> {
    // @ts-ignore
    return this._getByType('Zone');
  }

  getEntertainment(): Promise<Entertainment[]> {
    // @ts-ignore
    return this._getByType('Entertainment');
  }

  /** Enables the streaming functionality on an Entertainment Group */
  enableStreaming(id: number | string | Entertainment): Promise<boolean> {
    return this.execute(groupsApi.setStreaming, {id: id, active: true});
  }

  /**
   * Disabled the streaming functionality on an Entertainment Group
   * @param id {int | Entertainment}
   * @returns {Promise<boolean>}
   */
  disableStreaming(id: number | string | Entertainment): Promise<boolean> {
    return this.execute(groupsApi.setStreaming, {id: id, active: false});
  }

  _getByType(type: string): Promise<AnyGroup[]> {
    return this.getAll()
      .then((groups: AnyGroup[]) => {
        return groups.filter(group => group.type === type);
      });
  }
}