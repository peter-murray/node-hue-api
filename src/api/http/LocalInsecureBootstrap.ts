import * as url from 'url';
import { Transport } from './Transport';
import { Api } from '../Api';
import { request, create } from './HttpClientFetch';

const SUPPRESS_WARNING = process.env.NODE_HUE_API_USE_INSECURE_CONNECTION != null;

export class LocalInsecureBootstrap {

  readonly baseUrl: string;

  readonly hostname: string;

  constructor(hostname: string, port?: number) {
    this.baseUrl = url.format({protocol: 'http', hostname: hostname, port: port || 80});
    this.hostname = hostname;
  }

  connect(username: string, clientkey?: string) {
    const baseUrl = this.baseUrl;

    if (!SUPPRESS_WARNING) {
      console.log('WARNING: You are using this library in an insecure way!\n'
        + 'The Hue bridge supports HTTPS connections locally and it is highly recommended that you use an HTTPS\n'
        + 'method to communicate with the bridge.'
      );
    }

    return request({method: 'GET', url: `${baseUrl}/api/config`})
      .then(() => {
        const apiBaseUrl = `${baseUrl}/api`
          , transport = new Transport(create({baseURL: apiBaseUrl}), username)
          , config = {
            remote: false,
            baseUrl: apiBaseUrl,
            clientkey: clientkey,
            username: username,
          }
        ;

        return new Api(config, transport);
      });
  }
}
