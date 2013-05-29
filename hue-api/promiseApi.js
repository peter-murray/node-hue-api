"use strict";

var httpPromise = require("./httpUtilsPromise"),
    promiseApi = {};

promiseApi.prototype.registerUser = function(host, username, description) {
    var user = {
        "username"  : md5(username),
        "devicetype": description || "Node API"
    };

    function extractUsername(user) {
        return user[0].success.username;
    }

    return httpPromise.httpPost(host, apiPaths.api(), user)
        .then(extractUsername);
};
