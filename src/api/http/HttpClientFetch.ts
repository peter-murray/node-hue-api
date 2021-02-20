import fetch, { Response } from 'node-fetch';

const {URLSearchParams} = require('url');
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';
import HttpError from './HttpError';

export type HTTPHeaders = {
  [key: string]: string
}

type HttpClientFetchConfig = {
  headers?: HTTPHeaders,
  baseURL?: string,
  httpAgent?: HttpAgent,
  httpsAgent?: HttpsAgent,
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
  params?: { [key: string]: string }
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
  config?: { [key: string]: any },
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

    if (req.params) {
      config.body = new URLSearchParams(req.params);
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    config.agent = this.getAgent(url, req);

    return fetch(url, config)
      .then((res: Response) => {
        if (req.validateStatus) {
          if (req.validateStatus(res.status)) {
            return res;
          }
        } else if (res.ok) {
          return res;
        }

        // Process the result and then return the error object
        return resolveBodyPromise(res)
          .then(data => {
            throw new HttpError(res.status, res.url, res.headers.raw(), data);
          });
      })
      .then((res: Response) => {
        const result: FetchResult = {
          status: res.status,
        };

        if (res.headers) {
          // @ts-ignore
          result.headers = res.headers.raw();
        }

        return resolveBodyPromise(res)
          .then(data => {
            result.data = data;
            return result;
          });
      });
  }
}

function resolveBodyPromise(res: Response) {
    // The local bridge connection with nginx in front of it does not return a content-length header, unlike the remote API
  // so we cannot gate on this and prevent calls to res.json() from errorring on an empty string.
  //
  // This means we need to get it back as text and process it accordingly.
  // let promise;
  // const contentLength: string = res.headers.get('content-length');
  // if (contentLength && parseInt(contentLength) > 0) {
  //   const contentType = res.headers.get('content-type');
  //
  //   if (contentType.startsWith('application/json')) {
  //     promise = res.json();
  //   } else {
  //     promise = res.text();
  //   }
  // } else {
  //   promise = Promise.resolve();
  // }
  // return promise;

  return res.text()
    .then((data: string) => {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.startsWith('application/json')) {
        try {
          return JSON.parse(data)
        } catch (err) {
          return data;
        }
      }
      return data;
    });
}

export function create(config?: HttpClientFetchConfig): HttpClientFetch {
  return new HttpClientFetch(config);
}

export function request(req: RequestConfig): Promise<FetchResult> {
  return new HttpClientFetch().request(req);
}