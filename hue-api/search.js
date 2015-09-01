"use strict";

var Q = require("q"),
    dgram = require('dgram'),
    EventEmitter = require('events').EventEmitter,
    util = require("util");

var socketCleanUp = new SocketCleanUp();

/**
 * Locates possible Philips Hue Bridges on the network.
 * @param timeout The maximum time to wait for responses, or if none provided will default to 5 seconds
 * @return {Function|promise|promise|exports.promise}
 */
function locateBridges(timeout) {
    var deferred = Q.defer(),
        search = new SSDPSearch(timeout),
        results = [];

    search.on("response", function(value) {
        results.push(value);
    });
    search.search();

    // Give up after the timeout and process whatever results we have
    setTimeout(function() {
        _close(search);
        deferred.resolve(_filterResults(results));
    }, timeout || 5000);

    return deferred.promise;
}
module.exports.locateBridges = locateBridges;

function SSDPSearch(timeout) {
    var self = this;

    self.socket = dgram.createSocket('udp4');

    self.socket.on('error', function (err) {
        console.log('############### Got an error!');
        console.trace(err);
    });

    self.socket.on('message', function onMessage(msg, rinfo) {
        var msgStrings = msg.toString().split("\r\n");

        // HTTP/#.# ### Response
        if (msgStrings[0].match(/HTTP\/(\d{1})\.(\d{1}) (\d+) (.*)/)) {
            self.emit('response', _parseSearchResponse(msgStrings.slice(1)));
        }
    });

    socketCleanUp.add(self);
    socketCleanUp.registerExitListener();
}
SSDPSearch.prototype.__proto__ = EventEmitter.prototype;

SSDPSearch.prototype.search = function search() {
    var ip = "239.255.255.250",
        port = 1900;

    var pkt = new Buffer(_buildSearchPacket(
        {
            "HOST": ip + ":" + port,
            "MAN": "ssdp:discover",
            "MX": 10,
//            "ST": "SsdpSearch:all"
            "ST": "urn:schemas-upnp-org:device:Basic:1"
        }
    ));
    this.socket.send(pkt, 0, pkt.length, port, ip);
};

function _close(target) {
    if (!target.closed) {
        target.closed = true;
        target.socket.close();
    }
    socketCleanUp.remove(target);
}

function _buildSearchPacket(vars) {
    var packet = "M-SEARCH * HTTP/1.1\r\n";
    Object.keys(vars).forEach(function (n) {
        packet += n + ": " + vars[n] + "\r\n";
    });
    return packet + "\r\n";
}

function _parseSearchResponse(lines) {
    var line,
        separatorIndex,
        key,
        value,
        result = {},
        idx,
        len;

    for (idx = 0, len = lines.length; idx < lines.length; idx++) {
        line = lines[idx];
        separatorIndex = line.indexOf(":");
        if (separatorIndex > 0 && separatorIndex < line.length) {
            key = line.substring(0, separatorIndex).toLowerCase();
            value = line.substring(separatorIndex + 1, line.length).trim();
            result[key] = value;
        }
    }
    return result;
}

function _filterResults(resultObjects) {
    var uniqueValues = {};

    resultObjects.forEach(function(result) {
        if (! uniqueValues[result.location]) {
            uniqueValues[result.location] = result;
        } else {
            uniqueValues[result.location] = _combineResults(uniqueValues[result.location], result);
        }
    });
    return uniqueValues;
}

function _combineResults(objectOne, objectTwo) {
    var result = {},
        key,
        array;

    for (key in objectOne) {
        result[key] = objectOne[key];
    }

    for (key in objectTwo) {
        if (result[key] !== objectTwo[key]) {
            if (util.isArray(result[key])) {
                _addUnique(result[key], objectTwo[key]);
            } else {
                array = [];
                array.push(result[key]);
                array.push(objectTwo[key]);
                result[key] = array;
            }
        }
    }
    return result;
}

function _addUnique(array, value) {
    var found = false,
        idx,
        len;

    for (idx = 0, len = array.length; idx < len; idx++) {
        found = array[idx] === value;
        if (found) {
            break;
        }
    }

    if (!found) {
        array.push(value);
    }
}

/**
 * A socket register to take care of closing all sockets that are opened, if not already closed
 *
 * @constructor
 */
function SocketCleanUp() {
    this._searches = [];
    this._registered = false;
}

SocketCleanUp.prototype.add = function(search) {
    this._searches.push(search);
};

SocketCleanUp.prototype.remove = function(search) {
    var self = this
        , searches = self._searches
        , idx = searches.indexOf(search)
        ;

    if (idx > -1) {
        searches.splice(idx, 1)
    }
};

SocketCleanUp.prototype.finished = function() {
    var self = this
        , searches = self._searches
        ;

    searches.forEach(function(search) {
        _close(search);
    });
};

SocketCleanUp.prototype.registerExitListener = function() {
    var self = this;

    if (! self._registered) {
        process.on("exit", self.finished.bind(self));
        self._registered = true;
    }
};
