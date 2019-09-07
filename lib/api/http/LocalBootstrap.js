'use strict';

const url = require('url')
  , https = require('https')
  , sslCertificate = require('get-ssl-certificate')
  , axios = require('axios')
  , ApiError = require('../../ApiError')
  , Transport = require('./Transport')
  , Api = require('../Api')
;

const DEBUG = /node-hue-api/.test(process.env.NODE_DEBUG);

module.exports = class LocalBootstrap {

  constructor(hostname, port) {
    this._baseUrl = url.format({protocol: 'https', hostname: hostname, port: port || 443});
    this._hostname = hostname;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  get hostname() {
    return this._hostname;
  }

  connect(username, clientkey, timeout) {
    const self = this
      , hostname = self.hostname
      , baseUrl = self.baseUrl
    ;

    return axios.get(`${baseUrl}/api/config`, {httpsAgent: new https.Agent({rejectUnauthorized: false})})
      .then(res => {
        const bridgeId = res.data.bridgeid.toLowerCase();

        return sslCertificate.get(hostname)
          .then(cert => {
            const subjectCn = cert.subject.CN.toLowerCase();

            if (DEBUG) {
              console.log(
                'Bridge Certificate:\n'
                + `  subject:       ${JSON.stringify(cert.subject)}\n`
                + `  issuer:        ${JSON.stringify(cert.subject)}\n`
                + `  valid from:    ${cert.valid_from}\n`
                + `  valid to:      ${cert.valid_to}\n`
                + `  serial number: ${cert.serialNumber}\n`
              );

              console.log(`Performing validation of bridgeId "${bridgeId}" against certifcate subject "${subjectCn}"; matched? ${subjectCn === bridgeId}`);
            }

            if (subjectCn === bridgeId) {
              return new https.Agent({
                keepAlive: true,
                keepAliveMsecs: 10000,
                maxSockets: 50,
                timeout: getTimeout(timeout),
                rejectUnauthorized: false,
                // ca: cert.pemEncoded //TODO there are still issues here, as the certificate being self signed is failing somewhere deeper in TLS code
              });
            } else {
              throw new ApiError('The hue bridge certificate does not match the expected issuer');
            }
          }).catch(error => {
            throw new ApiError(error);
          })
          .then(agent => {
            const apiBaseUrl = `${baseUrl}/api`
              , transport = new Transport(username, axios.create({baseURL: apiBaseUrl, httpsAgent: agent}))
              , config = {
                remote: false,
                baseUrl: apiBaseUrl,
                clientkey: clientkey,
                username: username,
              }
            ;

            return new Api(config, transport);
          });
      });
  }
};

function getTimeout(timeout) {
  return timeout || 20000;
}
