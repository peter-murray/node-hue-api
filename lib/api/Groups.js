'use strict';

const groupsApi = require('./http/endpoints/groups')
  , ApiDefinition = require('./http/ApiDefinition.js')
  , Group = require('../model/Group')
;


module.exports = class Groups extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

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

  get(id) {
    return this.execute(groupsApi.getGroupAttributes, {id: id});
  }

  getByName(name) {
    return this.getAll()
      .then(allGroups => {
        return allGroups.filter(group => group.name === name);
      });
  }

  // TODO need to support the creation of Zones, Entertainment as well.


  createGroup(name, lights) {
    const group = new Group();
    group.name = name;
    group.lights = lights;
    group.type = 'LightGroup';

    return this._create(group);
  }

  createRoom(name, lights, roomClass) {
    const group = new Group();
    group.name = name;
    group.lights = lights;
    group.type = 'Room';
    group.class = roomClass;

    return this._create(group);
  }

  createZone(name, lights, roomClass) {
    const group = new Group();
    group.name = name;
    group.lights = lights;
    group.type = 'Zone';
    group.class = roomClass;

    return this._create(group);
  }
  //TODO support the creation of other groups, Entertainment

  updateAttributes(id, data) {
    //TODO use a group object here?
    return this.execute(groupsApi.setGroupAttributes, {id: id, groupAttributes: data});
  }

  deleteGroup(id) {
    //TODO support a group object?
    return this.execute(groupsApi.deleteGroup, {id: id});
  }

  getGroupState(id) {
    return this.get(id).then(group => {return group.state;});
  }

  setGroupState(id, state) {
    return this.execute(groupsApi.setGroupState, {id: id, state: state});
  }

  getLightGroups() {
    return this._getByType('LightGroup');
  }

  getLuminaires() {
    return this._getByType('Luminaire');
  }

  getLightSources() {
    return this._getByType('Lightsource');
  }

  getRooms() {
    return this._getByType('Room');
  }

  getZones() {
    return this._getByType('Zone');
  }

  getEntertainment() {
    return this._getByType('Entertainment');
  }

  enableStreaming(id) {
    return this.execute(groupsApi.setStreaming, {id: id, active: true});
  }

  disableStreaming(id) {
    return this.execute(groupsApi.setStreaming, {id: id, active: false});
  }

  _getByType(type) {
    return this.getAll()
      .then(groups => {
        return groups.filter(group => group.type === type);
      });
  }

  _create(group) {
    const self = this;

    return this.execute(groupsApi.createGroup, {group: group})
      .then(result => {
        return self.get(result.id);
      });
  }
};
