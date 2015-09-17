"use strict";

var url = require("url")
    , Q = require("q")
    , search = require("./search")
    , http = require("./httpPromise")
    , utils = require("./utils")
    , discovery = require("./commands/discovery")
    ;

/**
 * Will locate the Philips Hue Devices on the network. Depending upon the speed and size of the network the timeout
 * may need to be adjusted to locate the Hue Bridge.
 *
 * @param timeout The maximum time to wait for Hue Devices to be located. If not specified will use the default of 5
 * seconds.
 * @return A promise that will resolve the Hue Bridges as an Array of {"id": {String}, "ipaddress": {String}} objects.
 */
module.exports.networkSearch = function (timeout) {
    return search.locateBridges(timeout).then(_identifyBridges);
};

/**
 * Uses the http://www.meethue.com/api/nupnp call to search for any bridges locally on the network. This lookup can be
 * significantly faster than issuing search requests in the {locateBridges} function.
 *
 * @param cb An option callback function that will be informed of results.
 * @returns {Q.promise} A promise that will resolve the addresses of the bridges, or {null} if a callback was provided.
 */
module.exports.locateBridges = function (cb) {
    var promise = http.invoke(discovery.upnpLookup, {host: "www.meethue.com", ssl: true});
    return utils.promiseOrCallback(promise, cb);
};

/**
 * Obtains an object representation of the Description XML.
 *
 * @param host The host to get the description XML from.
 * @return {*} The object representing some of the values in the description XML.
 * @private
 */
module.exports.description = function (host) {
    return http.invoke(discovery.description, {"host": host})
        .then(_parseDescription);
};

/**
 * Identifies the bridges based on the response from possible devices from SSDP search
 * @param possibleBridges The results from the search to be processed.
 * @return A promise that will process all the results and return only the valid Hue Bridges.
 * @private
 */
function _identifyBridges(possibleBridges) {
    var lookups = []
        , path
        //, uri
        ;

    for (path in possibleBridges) {
        if (possibleBridges.hasOwnProperty(path)) {
            //uri = parseUri(path);
            lookups.push(followLocationResponse(path).then(_getHueBridgeHost));
        }
    }
    return Q.all(lookups);
}

/**
 * Performs a GET on the provided path, the location response from the bridge.
 * This function expects there to be an XML description document present at the provided path.
 * @param path The path in the LOCATION response from SSDP lookup.
 */
function followLocationResponse(path) {
    return http.simpleGet(path)
        .then(_parseDescription)
        .fail(function (err) {
            // Do nothing with services that do not respond with an XML document
        })
        ;
}

/**
 * Parses the XML Description and converts it into an Object.
 * @param xml The XML to parse and convert into an object
 * @return {Function|promise|promise|exports.promise}
 * @private
 */
function _parseDescription(xml) {
    var xml2js = require("xml2js")
        , parser = new xml2js.Parser()
        , deferred = Q.defer()
        ;

    parser.parseString(xml, function (err, data) {
        var result = null
            , icons
            ;

        if (err) {
            deferred.reject(err);
        } else {
            result = {
                "version": {
                    "major": data.root.specVersion[0].major[0],
                    "minor": data.root.specVersion[0].minor[0]
                },
                "url": data.root.URLBase[0],
                "name": data.root.device[0].friendlyName[0],
                "manufacturer": data.root.device[0].manufacturer[0],
                "model": {
                    "name": data.root.device[0].modelName[0],
                    "description": data.root.device[0].modelDescription[0],
                    "number": data.root.device[0].modelNumber[0],
                    "serial": data.root.device[0].serialNumber[0],
                    "udn": data.root.device[0].UDN[0]
                }
            };

            if (data.root.device[0].iconList
                && data.root.device[0].iconList[0]
                && data.root.device[0].iconList[0].icon) {
                icons = [];

                data.root.device[0].iconList[0].icon.forEach(function (icon) {
                    icons.push({
                        mimetype: icon.mimetype[0],
                        height: icon.height[0],
                        width: icon.width[0],
                        depth: icon.depth[0],
                        url: icon.url[0]
                    });
                });

                result.icons = icons;
            }

            deferred.resolve(result);
        }
    });

    return deferred.promise;
}

function _isHueBridge(description) {
    var name;

    if (description && description.model && description.model.name) {
        name = description.model.name;
        if (name.toLowerCase().indexOf("philips hue bridge") >= 0) {
            return true;
        }
    }
    return false;
}

function _getHueBridgeHost(description) {
    var uri;

    if (_isHueBridge(description)) {
        uri = url.parse(description.url);
        return {
            "id": description.model.serial,
            "ipaddress": uri.hostname
        };
    }
    return null;
}