import fetch from 'node-fetch';
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';

import { ApiError } from '../../ApiError';

export type HTTPHeaders = {
  [key: string]: string
}

type HttpClientFetchConfig = {
  headers?: HTTPHeaders,
  baseURL?: string,
  httpAgent?: HttpAgent,
  httpsAgent?: HttpsAgent,
  responseType?: string,
}

type AgentConfig = {
  agent?: HttpAgent | HttpsAgent,
  httpAgent?: HttpAgent,
  httpsAgent?: HttpsAgent
}

export type RequestConfig = {
  json?: boolean
  data?: object | string
  url: string
  headers?: HTTPHeaders
  method: string
  timeout?: number
  params?: {[key: string]: string} //TODO these are not used currently but the remote API utilizes them
  responseType?: string, //TODO this is used by remote api but not sure if actually acknowledged in node-fetch
  baseURL?: string, //TODO not sure this mean anything, but used by remote API
  validateStatus?: Function,
  // transformResponse?: Function,
} & AgentConfig

type FetchRequestConfig = {
  method?: string,
  headers?: HTTPHeaders,
  timeout?: number,
  body?: any,
  agent?: HttpsAgent | HttpAgent,
}

export type FetchResult = {
  status: number,
  data?: any
  config?: {[key: string]: any},
  headers?: HTTPHeaders
}

export class HttpClientFetch {

  private _config: HttpClientFetchConfig;

  constructor(config?: HttpClientFetchConfig) {
    this._config = config || {};
  }

  get headers(): HTTPHeaders {
    return this._config.headers || {};
  }

  get baseURL(): string | undefined {
    return this._config.baseURL;
  }

  get hasBaseUrl(): boolean {
    return !!this.baseURL;
  }

  refreshAuthorizationHeader(token: string) {
    if (!this._config.headers) {
      this._config.headers = {};
    }

    this._config.headers['Authorization'] = `Bearer ${token}`;
  }

  getAgent(url: string, config: RequestConfig): HttpsAgent | HttpAgent | undefined {
    const specifiedAgent = config.agent || config.httpsAgent || config.httpAgent || undefined;

    if (specifiedAgent) {
      return specifiedAgent;
    }

    return this._config.httpsAgent || this._config.httpAgent || undefined;
  }

  getUrl(url: string): string {
    if (!this.hasBaseUrl) {
      return url;
    } else if (/^http/.test(url)) {
      return url;
    }

    let path;
    if (url && url[0] === '/') {
      path = url;
    } else {
      path = `/${url}`;
    }
    return `${this.baseURL}${path}`;
  }

  request(req: RequestConfig): Promise<FetchResult> {
    const isJson = req.json === true
      , hasData = !!req.data
      , url = this.getUrl(req.url)
      , headers = this.headers
      , config: FetchRequestConfig = {
        method: req.method,
        headers: headers,
        timeout: req.timeout || 0,
      }
    ;

    if (isJson) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';

      if (hasData) {
        config.body = JSON.stringify(req.data);
      }
    } else {
      if (hasData) {
        config.body = req.data;
      }
    }

    if (req.headers) {
      const requestHeaders = req.headers;

      Object.keys(requestHeaders).forEach(header => {
        headers[header] = requestHeaders[header];
      });
    }

    config.agent = this.getAgent(url, req);

    return fetch(url, config)
      .then(res => {
        if (req.validateStatus) {
          if (req.validateStatus(res.status)) {
            return res;
          }
        } else if (res.ok) {
          return res;
        }

        throw new ApiError(`fetch did not complete with expected status: ${res.status}`);
      })
      .then(res => {
        const result: FetchResult = {
          status: res.status
        };

        let promise;
        if (isJson) {
          promise = res.json();
        } else {
          promise = res.text();
        }

        return promise.then(data => {
          result.data = data;
          return result;
        });
      });
  }
}

export function create(config?: HttpClientFetchConfig): HttpClientFetch {
  return new HttpClientFetch(config);
}

export function request(req: RequestConfig): Promise<FetchResult> {
  return new HttpClientFetch().request(req);
}