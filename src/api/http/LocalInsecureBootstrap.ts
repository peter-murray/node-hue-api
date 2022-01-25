import { Transport } from './Transport';
import { Api } from '../Api';
import { request, create } from './HttpClientFetch';
import { HueApiRateLimits } from '../HueApiRateLimits';
import { ConfigParameters } from '../HueApiConfig';
import { getHttpUrl } from './urlUtil';

const SUPPRESS_WARNING = process.env.NODE_HUE_API_USE_INSECURE_CONNECTION != null;

export class LocalInsecureBootstrap {

  readonly baseUrl: URL;

  readonly hostname: string;

  readonly rateLimits: HueApiRateLimits;

  constructor(hostname: string, rateLimits: HueApiRateLimits, port?: number) {
    this.baseUrl = getHttpUrl(hostname, port || 80);
    this.hostname = hostname;
    this.rateLimits = rateLimits;
  }

  connect(username: string, clientkey?: string, timeout?: number) {
    const baseUrl = this.baseUrl
      , rateLimits = this.rateLimits
    ;

    if (!SUPPRESS_WARNING) {
      console.log('WARNING: You are using this library in an insecure way!\n'
        + 'The Hue bridge supports HTTPS connections locally and it is highly recommended that you use an HTTPS\n'
        + 'method to communicate with the bridge.'
      );
    }

    return request({method: 'GET', url: `${baseUrl.href}api/config`})
      .then(() => {
        const apiBaseUrl = `${baseUrl.href}api`
          , fetchConfig = {
              baseURL: apiBaseUrl,
              timeout: getTimeout(timeout)
            }
          , transport = new Transport(create(fetchConfig), rateLimits.transportRateLimit, username)
          , config: ConfigParameters = {
              remote: false,
              baseUrl: apiBaseUrl,
              bridgeName: this.hostname,
              clientKey: clientkey,
              username: username,
            }
        ;

        return new Api(config, transport, rateLimits);
      });
  }
}
function getTimeout(timeout?: number): number {
  return timeout || 20000;
}
