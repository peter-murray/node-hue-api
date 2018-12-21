'use strict';

const groupsApi = require("./endpoints/groups")
;

const Groups = function(api) {
  let self = this
      , request = api._getRequest()
  ;

  self.execute = function(api, parameters) {
    return request.execute(api, parameters);
  }
};

Groups.prototype.getAll = function() {
  return this.execute(groupsApi.getAllGroups)
};

Groups.prototype.get = function(id) {
  return this.execute(groupsApi.getGroupAttributes, {id: id});
}

Groups.prototype.createGroup = function(name, lights) {
  // When creating a group, we get an ID back, but the bridge lags behind with the updating of the group details, so
  // that a chained request to get the group state back normally results in the previous group attributes being returned.
  return this.execute(groupsApi.createGroup, {name: name, lights: lights});
};

Groups.prototype.createRoom = function(name, lights) {
  return this.execute(groupsApi.createRoom, {name: name, lights: lights}); //TODO chain the get on tho this
};

module.exports.create = function(api) {
  return new Groups(api);
};