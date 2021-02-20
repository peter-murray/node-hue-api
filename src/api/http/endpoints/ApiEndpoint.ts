import { HTTPHeaders, RequestConfig } from '../HttpClientFetch';
import { Placeholder } from '../../placeholders/Placeholder';
import { UsernamePlaceholder } from '../../placeholders/UsernamePlaceholder';

const DEBUG: boolean = /node-hue-api/.test(process.env['NODE_DEBUG'] || '');

type ApiEndpointDefinition = {
  placeholders: Placeholder[],
  headers: HTTPHeaders,
  url?: string,
  method?: string,
  json?: boolean,
  postProcessing?: Function,
  errorHandler?: Function,
  statusCode?: number,
  _payloadFn?: Function,
}

export type ApiBodyPayload = {
  type: string,
  body: object,
}

export class ApiEndpoint {

  private readonly _data: ApiEndpointDefinition;

  // private _version?: string;

  constructor() {
    this._data = {
      placeholders: [new UsernamePlaceholder()],
      headers: {}
    };
  }

  placeholder(placeholder?: Placeholder) {
    if (placeholder) {
      this._getData().placeholders.push(placeholder);
    }
    return this;
  }

  // //TODO what is this being used for now?
  // version(version: string) {
  //   this._version = version;
  //   return this;
  // }

  uri(uri: string) {
    this._getData().url = uri;
    return this;
  }

  get() {
    return this.method('GET');
  }

  post() {
    return this.method('POST');
  }

  put() {
    return this.method('PUT');
  }

  delete() {
    return this.method('DELETE');
  }

  method(method: string) {
    this._getData().method = method;
    return this;
  }

  acceptJson() {
    return this.setHeader('Accept', 'application/json');
  }

  acceptXml() {
    return this.setHeader('Accept', 'application/xml');
  }

  pureJson() {
    this._getData().json = true;
    return this;
  }

  postProcess(fn: Function) {
    this._getData().postProcessing = fn;
    return this;
  }

  errorHandler(fn: Function) {
    this._getData().errorHandler = fn;
    return this;
  }

  statusCode(expectedStatusCode: number) {
    this._getData().statusCode = expectedStatusCode;
    return this;
  }

  setHeader(name: string, value: string) {
    this._getData().headers[name] = value;
    return this;
  }

  getRequest(parameters: any): RequestConfig {
    const data: ApiEndpointDefinition = this._getData();

    const config: RequestConfig = {
      url: replacePlaceholders(data.url || '', data.placeholders, parameters),
      method: data.method || 'GET',
      headers: Object.assign({}, data.headers),
      json: data.json,
    }

    //TODO a number of optional parameters are not necessarily being passed in here - Requires a review
    //data - done via payloadFn
    //timeout
    //params
    //responseType
    //baseURL

    if (data._payloadFn) {
      const payload = data._payloadFn(parameters);

      config.data = payload.body;
      if (payload.type) {
        if (config.headers) {
          config.headers['Content-Type'] = payload.type;
        } else {
          config.headers = {'Content-Type': payload.type};
        }
      }
    }

    if (DEBUG) {
      if (data.placeholders) {
        //TODO redact the username from logs, although it would still appear in the URL...
        console.log('URL Placeholders:');
        data.placeholders.forEach(placeholder => {
          console.log(`  ${placeholder.toString()}`);
        });
      }

      if (config.headers) {
        console.log(`Headers: ${JSON.stringify(config.headers)}`);
      }
    }

    if (data.statusCode) {
      config.validateStatus = function(status: number) {
        return status === data.statusCode;
      };
    }

    return config;
  }

  getPostProcessing(): Function | undefined {
    return this._getData().postProcessing;
  }

  getErrorHandler(): Function | undefined {
    return this._getData().errorHandler;
  }

  payload(fn: Function) {
    this._getData()._payloadFn = fn;
    return this;
  }

  requiresJsonConversion() {
    const data = this._getData();
    return data.json || (data.headers && data.headers['Accept'] === 'application/json');
  }

  get successCode(): number {
    return this._getData().statusCode || 200;
  }

  get headers(): object {
    return this._getData().headers;
  }

  _getData(): ApiEndpointDefinition {
    return this._data;
  }
}

function replacePlaceholders(url: string, placeholders:Placeholder[], parameters:object) {
  let result = url;

  if (placeholders) {
    placeholders.forEach(function(placeholder: Placeholder) {
      result = placeholder.inject(result, parameters);
    });
  }

  return result;
}