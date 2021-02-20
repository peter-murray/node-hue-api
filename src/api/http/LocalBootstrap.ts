import * as https from 'https';
import * as url from 'url';

import {Api} from '../Api';

import * as httpClient from './HttpClientFetch';
import { ApiError } from '../../ApiError';
import { Transport } from './Transport';

import { getSSLCertificate, SSLCertificate } from './sslCertificate';

const DEBUG: boolean = /node-hue-api/.test(process.env.NODE_DEBUG || '');

const INITIAL_HTTPS_AGENT = new https.Agent({
  rejectUnauthorized: false
});

export class LocalBootstrap {

  private _baseUrl: string;

  private _hostname: string;

  /**
   * Create a Local Network Bootstrap for connecting to the Hue Bridge. The connection is ALWAYS over TLS/HTTPS.
   *
   * @param {String} hostname The hostname or ip address of the hue bridge on the local network.
   * @param {number=} port The port number for the connections, defaults to 443 and should not need to be specified in the majority of use cases.
   */
  constructor(hostname: string, port?: number) {
    this._baseUrl = url.format({protocol: 'https', hostname: hostname, port: port || 443});
    this._hostname = hostname;
  }

  /**
   * Gets the Base URL for the local connection to the bridge.
   */
  get baseUrl(): string {
    return this._baseUrl;
  }

  /**
   * Gets the hostname being used to connect to the hue bridge (ip address or fully qualified domain name).
   */
  get hostname(): string {
    return this._hostname;
  }

  /**
   * Connects to the Hue Bridge using the local network.
   *
   * The connection will perform checks on the Hue Bridge TLS Certificate to verify it is correct before sending any
   * sensitive information.
   *
   * @param {String=} username The username to use when connecting, can be null, but will severely limit the endpoints that you can call/access
   * @param {String=} clientkey The clientkey for the user, used by the entertainment API, can be null
   * @param {Number=} timeout The timeout for requests sent to the Hue Bridge. If not set will default to 20 seconds.
   * @returns {Promise<Api>} The API for interacting with the hue bridge.
   */
  connect(username?: string, clientkey?: string, timeout?: number): Promise<Api> {
    const self = this
      , hostname: string = self.hostname
      , baseUrl: string = self.baseUrl
    ;

    return httpClient.request({
        method: 'GET',
        url: `${baseUrl}/api/config`,
        json: true,
        httpsAgent: INITIAL_HTTPS_AGENT
      }).then(res => {
        const bridgeId = res.data.bridgeid.toLowerCase();

        return getSSLCertificate(hostname)
          .then((cert: SSLCertificate) => {
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

              console.log(`Performing validation of bridgeId "${bridgeId}" against certificate subject "${subjectCn}"; matched? ${subjectCn === bridgeId}`);
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
              , transport = new Transport(httpClient.create({baseURL: apiBaseUrl, httpsAgent: agent}), username)
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

function getTimeout(timeout?: number): number {
  return timeout || 20000;
}
