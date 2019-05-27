'use strict';

const groupsApi = require('./http/endpoints/groups')
  , ApiDefinition = require('./http/ApiDefinition.js')
;


module.exports = class Groups extends ApiDefinition {

  constructor(hueApi, request) {
    super(hueApi, request);
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

  createGroup(name, lights) {
    //TODO this is no longer true, or at least appears that way

    // When creating a group, we get an ID back, but the bridge lags behind with the updating of the group details, so
    // that a chained request to get the group state back normally results in the previous group attributes being returned.
    return this.execute(groupsApi.createGroup, {name: name, lights: lights});
  }

  createRoom(name, lights, room) {
    return this.execute(groupsApi.createGroup, {name: name, lights: lights, room: room});
  }

  get(id) {
    return this.execute(groupsApi.getGroupAttributes, {id: id});
  }

  update(id, data) {
    return this.execute(groupsApi.setGroupAttributes, {id: id, groupAttributes: data});
  }

  deleteGroup(id) {
    return this.execute(groupsApi.deleteGroup, {id: id});
  }

  getGroupState(id) {
    return this.get(id).then(group => {return group.state;});
  }

  setGroupState(id, state) {
    return this.execute(groupsApi.setGroupState, {id: id, state: state});
  }

  getLuminaires() {
    return this.getAll()
      .then(groups => {
        return groups.filter(group => {
          return group.type === 'Luminaire';
        });
      });
  }

  getLightGroups() {
    return this.getAll()
      .then(groups => {
        return groups.filter(group => {
          return group.type === 'LightGroup';
        });
      });
  }

  getLightSources() {
    return this.getAll()
      .then(groups => {
        return groups.filter(group => {
          return group.type === 'Lightsource';
        });
      });
  }
};


//TODO
// Groups.prototype.createRoom = function(name, lights) {
//   return this.execute(groupsApi.createRoom, {name: name, lights: lights}); //TODO chain the get on tho this
// };
