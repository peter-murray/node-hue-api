'use strict';

// const dtls = require('@nodertc/dtls')
// const dtls = require('node-dtls-client').dtls
const dtls = require('node-mbed-dtls-client')
  , ApiError = require('../../ApiError')
;

module.exports = class EntertainmentStream {

  constructor(ipAddress, username, clientkey) {
    // this._config = {
    //   type: 'udp4',
    //   remotePort: 2100,
    //   remoteAddress: ipAddress,
    //   pskSecret: getPSK(clientkey),
    //   pskIdentity: username,
    //   cipherSuites: ['TLS_PSK_WITH_AES_128_GCM_SHA256'],
    // };

    // this._config = {
    //   type: 'udp4',
    //   port: 2100,
    //   address: ipAddress,
    //   psk: {
    //     psk_identity: username,
    //     psk: getPSK(clientkey)
    //   },
    //   cipherSuites: ['TLS_PSK_WITH_AES_128_GCM_SHA256'],
    // };

    this._config = {
      debug: 10,
      // type: 'udp4',
      port: 2100,
      host: ipAddress,
      psk: getPSK(clientkey),
      // psk_identity: Buffer.from(username, 'ascii'),
      psk_identity: username,
      // cipherSuites: ['TLS_PSK_WITH_AES_128_GCM_SHA256'],
    };
  }

  connect() {
    const self = this;

    const promise = new Promise((resolve, reject) => {
      const socket = dtls.connect(this._config);
      // const socket = dtls.createSocket(this._config);

      // socket.once('error', err => {
      socket.on('error', err => {
        console.error(err); //TODO
        reject(new ApiError(err));
        // socket.close();
      });


      socket.on('drain', () => {
        console.error('draining')
      });

      socket.on('pipe', () => {
        console.error('pipe')
      });

      socket.on('finish', () => {
        console.error('finished')
      });




      socket.once('connect', () => {
        console.error('Connected!');//TODO
        self._socket = socket;


        // socket.on('error', err => {
        //   console.error(err);
        // });

        resolve(true);
      });
    });

    return promise;
  }

  send(data) {
    const self = this
      , socket = self._socket
    ;

    const result = socket.write(data, () => {
      console.log(`Wrote Data: ${data}`);
    });//TODO can use a callback to confirm data
    // socket.end();
    return result;
  }

  close() {
    const self = this
      , socket = self._socket
      , promise = new Promise((resolve, reject) => {
        if (socket) {
          console.error(`Socket Bytes written: ${socket.bytesWritten}`);


          socket.close();
          resolve(true);
        } else {
          reject(new ApiError('There is currently no valid socket open to close.'));
        }
      });

    return promise;
  }
};

function hexToBytes(hex) {
  // console.log(hex);
  //
  // const hexBuf = Buffer.from(hex, 'hex');
  // return hexBuf;
  // return parseInt(hex, 16);


  // 32 character ascii to 16 byte binary representation
  const arr = [];
  for (let c = 0; c < hex.length; c += 2) {
    arr.push(parseInt(hex.substr(c, 2), 16));
  }

  console.log(arr);

  return Buffer.from(arr, 'binary');

  // const arr = new ArrayBuffer(16)
  //   , view = new DataView(arr)
  // ;
  //
  // let offset = 0;
  //
  // for (let c = 0; c < hex.length; c += 2) {
  //   const intVal = parseInt(hex.substr(c, 2), 16);
  //   view.setUint16(offset, intVal, false);
  //   offset++;
  // }
  //
  // return Buffer.from(arr);
}

function getPSK(val) {
  // const result = hexToBytes(val);
  // console.log(result);
  // return Buffer.from(result);


  const hexBuff = Buffer.from(val, 'hex');
  console.log(hexBuff);
  return hexBuff;
}