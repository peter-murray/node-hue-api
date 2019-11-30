'use strict';

const Bottleneck = require('bottleneck')
  , groupsApi = require('./http/endpoints/groups')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , model = require('../model')
  , util = require('../util')
;


module.exports = class Groups extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);

    // Set up a limiter on the group state changes from the library to once per second as per guidance documentation
    this._groupStateLimiter = new Bottleneck({maxConcurrent: 1, minTime: 1000});
  }

  /**
   * Gets all the groups from the bridge.
   * @returns {Promise<Group[]>}
   */
  getAll() {
    // Lightset 0 (all lights) is a special case, so retrieve the bridge's definition of that and prepend to the
    // existing group definitions to provide the complete list of groups.

    return Promise.all([
      this.execute(groupsApi.getGroupAttributes, {id: 0}),
      this.execute(groupsApi.getAllGroups)
    ]).then(results => {
      results[1].unshift(results[0]);
      return results[1];
    });
  }

  /**
   * @param id {int | Group}
   * @returns {Promise<Group>}
   */
  getGroup(id) {
    return this.execute(groupsApi.getGroupAttributes, {id: id});
  }

  /**
   * @param id {int | Group}
   * @returns {Promise<Group>}
   */
  get(id) {
    util.deprecatedFunction('5.x', 'groups.get(id)', 'Use groups.getGroup(id) instead.');
    return this.getGroup(id);
  }

  /**
   * @deprecated Use getGroupByName(name) instead.
   * @param name {string}
   * @returns {Promise<Group[]>}
   */
  getByName(name) {
    util.deprecatedFunction('5.x', 'groups.getByName(name)', 'Use groups.getGroupByName(name) instead.');
    return this.getByName(name);
  }

  /**
   * @param name {string}
   * @returns {Promise<Group[]>}
   */
  getGroupByName(name) {
    return this.getAll()
      .then(allGroups => {
        return allGroups.filter(group => group.name === name);
      });
  }

  /**
   * Creates a group
   * @param group {Entertainment | LightGroup | Room | Zone | Group}
   * @returns {Promise<Group>} The Group that was created on the bridge.
   */
  createGroup(group) {
    const self = this;

    if (arguments.length === 1 && model.isGroupInstance(group)) {
      return this.execute(groupsApi.createGroup, {group: group})
        .then(result => {
          return self.getGroup(result.id);
        });
    }

    util.deprecatedFunction('5.x', 'groups.createGroup(name, lights)', 'Use groups.createGroup(group) instead.');
    const newGroup = model.createLightGroup();
    newGroup.name = arguments[0];
    newGroup.lights = arguments[1];
    return self.createGroup(newGroup);
  }

  /**
   * @deprecated use createGroup(group) instead
   */
  createRoom(name, lights, roomClass) {
    util.deprecatedFunction('5.x', 'groups.createRoom(name, lights, roomClass)', 'Use groups.createGroup(group) instead.');

    const group = model.createRoom();
    group.name = name;
    group.lights = lights;
    group.class = roomClass;
    return this.createGroup(group);
  }

  /**
   * @deprecated use createGroup(group) instead
   */
  createZone(name, lights, roomClass) {
    util.deprecatedFunction('5.x', 'groups.createZone(name, lights, roomClass)', 'Use groups.createGroup(group) instead.');

    const group = model.createZone();
    group.name = name;
    group.lights = lights;
    group.class = roomClass;

    return this.createGroup(group);
  }

  /**
   * Update the Group attributes on the bridge for the specified Group object.
   * @param group {Group} The group with updates to be updated on the bridge.
   * @returns {Promise<boolean>}
   */
  updateGroupAttributes(group) {
    return this.execute(groupsApi.setGroupAttributes, {id: group.id, group: group});
  }

  /**
   * Update the Group attributes on the bridge for the specified Group object.
   * @param group {Group} The group with updates to be updated on the bridge.
   * @returns {Promise<boolean>}
   */
  updateAttributes(id, data) {
    util.deprecatedFunction('5.x', 'groups.updateAttributes(id, data)', 'Use groups.updateGroupAttributes(group) instead.');
    return this.execute(groupsApi.setGroupAttributes, {id: id, group: data});
  }

  /**
   *
   * @param id {number | Group | LightGroup | Zone | Room | Entertainment} The id or Group instance to delete
   * @returns {Promise<boolean>}
   */
  deleteGroup(id) {
    return this.execute(groupsApi.deleteGroup, {id: id});
  }

  /**
   * @param id {int | Group}
   * @returns {Promise<Object>}
   */
  getGroupState(id) {
    return this.get(id).then(group => {
      return group.state;
    });
  }

  /**
   *
   * @param id {int | Group}
   * @param state {GroupLightState | Object}
   * @returns {Promise<*>>}
   */
  setGroupState(id, state) {
    const self = this;
    return self._groupStateLimiter.schedule(() => {
      return self.execute(groupsApi.setGroupState, {id: id, state: state});
    });
  }

  /**
   * @returns {Promise<LightGroup[]>}
   */
  getLightGroups() {
    return this._getByType('LightGroup');
  }

  /**
   * @returns {Promise<Luminaire[]>}
   */
  getLuminaries() {
    return this._getByType('Luminaire');
  }

  /**
   * @returns {Promise<Lightsource[]>}
   */
  getLightSources() {
    return this._getByType('Lightsource');
  }

  /**
   * @returns {Promise<Room[]>}
   */
  getRooms() {
    return this._getByType('Room');
  }

  /**
   * @returns {Promise<Zone[]>}
   */
  getZones() {
    return this._getByType('Zone');
  }

  /**
   * @returns {Promise<Entertainment[]>}
   */
  getEntertainment() {
    return this._getByType('Entertainment');
  }

  /**
   * Enables the streaming functionality on an Entertainment Group
   * @param id {int | Entertainment}
   * @returns {Promise<boolean>}
   */
  enableStreaming(id) {
    return this.execute(groupsApi.setStreaming, {id: id, active: true});
  }

  /**
   * Disabled the streaming functionality on an Entertainment Group
   * @param id {int | Entertainment}
   * @returns {Promise<boolean>}
   */
  disableStreaming(id) {
    return this.execute(groupsApi.setStreaming, {id: id, active: false});
  }

  _getByType(type) {
    return this.getAll()
      .then(groups => {
        return groups.filter(group => group.type === type);
      });
  }
};
