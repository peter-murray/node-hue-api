'use strict';

function getDescriptionXml() {
    return "/description.xml";
}

function getApiPath(username) {
    var url = "/api";
    if (username) {
        url += "/" + username;
    }
    return url;
}

function getApiLightsPath(username, lightId) {
    var url = getApiPath(username) + "/lights";
    if (lightId) {
        url += "/" + lightId;
    }
    return url;
}

function getApiLightStatePath(username, lightId) {
    return getApiLightsPath(username, lightId) + "/state";
}

function getApiGroupsPath(username, groupId) {
    var url = getApiPath(username) + "/groups";

    //!== null check required, because if !groupid would be false if groupid is 0.
    if (groupId !== null) {
        url += "/" + groupId;
    }
    return url;
}

function getApiGroupsActionPath(username, groupId) {
    return getApiGroupsPath(username, groupId)  + "/action"
}

function getApiWhitelistPath(username) {
    return getApiPath(username) + "/config/whitelist/" + username;
}

function getApiSchedulesPath(username, id) {
    var url = getApiPath(username) + "/schedules";
    if (id) {
        url += "/" + id;
    }
    return url;
}

function getApiConfigPath(username) {
    return getApiPath(username) + "/config";
}

// Export the methods for the module
module.exports = {
    api: getApiPath,
    descriptionXml: getDescriptionXml,
    lights: getApiLightsPath,
    lightState: getApiLightStatePath,
    groups: getApiGroupsPath,
    groupsAction: getApiGroupsActionPath,
    deregister: getApiWhitelistPath,
    schedules: getApiSchedulesPath,
    config: getApiConfigPath
};