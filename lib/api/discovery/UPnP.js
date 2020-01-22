'use strict';

const dgram = require('dgram')
  , EventEmitter = require('events').EventEmitter
;

class SSDPSearch {

  constructor() {
    const self = this;
    this.responseEmitter = new EventEmitter();
    this.socket = dgram.createSocket('udp4');

    this.socket.on('error', function(err) {
      self.responseEmitter.emit('error', err);
    });

    this.socket.on('message', function onMessage(msg, rinfo) {
      const msgStrings = msg.toString().split('\r\n');

      // HTTP/#.# ### Response
      if (msgStrings[0].match(/HTTP\/(\d{1})\.(\d{1}) (\d+) (.*)/)) {
        self.responseEmitter.emit('response', _parseSearchResponse(msgStrings.slice(1)));
      }
    });

    // Ensure the socket is released on exit of the process (in case of errors)
    process.on('exit', this._finished.bind(this));
  }

  search(timeout) {
    const self = this;

    return new Promise((resolve, reject) => {
      const results = [];

      self.responseEmitter.on('error', err => {
        self.finished();
        reject(err);
      });

      self.responseEmitter.on('response', value => {
        results.push(value);
      });

      // Await our timeout before returning any results
      setTimeout(() => {
        self._finished();
        resolve(_processResults(results));
      }, timeout || 5000);

      self._start();
    });
  }

  _start() {
    const ip = '239.255.255.250',
      port = 1900;

    const pkt = Buffer.from(_buildSearchPacket(
      {
        'HOST': ip + ':' + port,
        'MAN': 'ssdp:discover',
        'MX': 10,
        //            "ST": "SsdpSearch:all"
        'ST': 'urn:schemas-upnp-org:device:Basic:1'
      }
    ));
    this.socket.send(pkt, 0, pkt.length, port, ip);
  }

  _finished() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
module.exports = SSDPSearch;


function _buildSearchPacket(vars) {
  let packet = 'M-SEARCH * HTTP/1.1\r\n';
  Object.keys(vars).forEach(function(n) {
    packet += n + ': ' + vars[n] + '\r\n';
  });
  return packet + '\r\n';
}

function _parseSearchResponse(lines) {
  const result = {};

  lines.forEach(line => {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex > 0 && separatorIndex < line.length) {
      const key = line.substring(0, separatorIndex).toLowerCase();
      const value = line.substring(separatorIndex + 1, line.length).trim();
      result[key] = value;
    }
  });

  return result;
}

function _processResults(responses) {
  const results = {};

  responses.forEach(response => {
    const location = response.location;

    // Older versions used to use hue-bridgeId, now newer software versions use hue-bridgeid, remove the older fallback
    // once they are outdated.
    let hueBridgeId = response['hue-bridgeid'];
    if (hueBridgeId == undefined) {
      hueBridgeId = response['hue-bridgeId'];
    }

    if (location && hueBridgeId) {
      if (!results[location]) {
        const ipAddress = /\/\/(.*):/.exec(location);

        if (ipAddress) {
          results[location] = {
            id: hueBridgeId,
            internalipaddress: ipAddress[1]
          };
        }
      }
    }
  });

  return Object.values(results);
}