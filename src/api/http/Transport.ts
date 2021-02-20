import Bottleneck from 'bottleneck';
import { ApiError } from '../../ApiError';
import { parseErrors } from '../../util';
import { ApiEndpoint } from './endpoints/ApiEndpoint';
import { HueError } from '../../HueError';
import { FetchResult, HttpClientFetch } from './HttpClientFetch';

// The limiter configuration if nothing is specified
const DEFAULT_LIMITER_CONFIG = {
  maxConcurrent: 4,
  minTime: 50,
};

export class Transport {

  private _username?: string;

  private _client: HttpClientFetch;

  private _limiter: Bottleneck;

  constructor(client: HttpClientFetch, username?: string, queueConfig?: object) {
    this._username = username;
    this._client = client;
    this._limiter = new Bottleneck(queueConfig || DEFAULT_LIMITER_CONFIG);
    // this.configureLimiter(queueConfig || DEFAULT_LIMITER_CONFIG);
  }

  // configureLimiter(config: any) {
  //   this._limiter = new Bottleneck(config);
  // }

  get limiter(): Bottleneck {
    return this._limiter;
  }

  /**
   * Executes an API Endpoint Request.
   * @param api The Api endpoint to perform a request against.
   * @param parameters Any parameters specific to the request.
   * @returns {Promise<any>} The promise for making the specified API request.
   */
  execute(api: ApiEndpoint, parameters: object | undefined): Promise<any> {
    let self = this
      , limiter = this.limiter
      , client = self._client
      , requestParameters = Object.assign({username: self._username}, parameters)
      , promise
    ;

    if (!api) {
      throw new Error('An API must be provided');
    }

    // @ts-ignore
    promise = limiter.schedule(() => {
      return client.request(api.getRequest(requestParameters))})
      .catch((err: Error) => {
        // @ts-ignore
        throw extractError(err, err.response);
      })
      .then((res: any) => {
        // Errors can be contained in the object payload from a successful response code.
        const errors = parseErrors(res.data);
        if (errors) {
          throw new ApiError(errors[0]);
        }
        return res.data;
      });

    if (api.getErrorHandler()) {
      // @ts-ignore
      promise = promise.catch(api.getErrorHandler());
    }

    const postProcessing = api.getPostProcessing()
    if (postProcessing) {
      // Inject the request parameters into the post processing function
      promise = promise.then((result: any) => {
        return postProcessing(result, requestParameters);
      });
    }

    return promise;
  }

  refreshAuthorizationHeader(token: string) {
    // Update the default common authorization header with the new bearer token
    this._client.refreshAuthorizationHeader(`Bearer ${token}`);
  }
}

/**
 * Extracts an appropriate error from the provided details.
 *
 * @param {Error} err The captured Error.
 * @param {Object} response The underlying transport HTTP response object.
 * @returns {ApiError | HueError} The error extracted from the data provided
 */
function extractError(err: Error, response: FetchResult) {
  if (!response) {
    //TODO fetch leaks the API key in the URL, need to redact it
    const error = new ApiError(err.message);
    // Set the original stack trace here as the one for the error created is pretty much useless and obscures the real problem
    error.stack = err.stack
    throw error;
  }

  const headers = response.headers
    , authenticateHeader = headers ? headers['www-authenticate'] : null
  ;

  let hueError;

  if (authenticateHeader) {
    const errorMatch = /error="(.*?)"/.exec(authenticateHeader)
      , errorDescriptionMatch = /error_description="(.*?)"/.exec(authenticateHeader)
    ;
    hueError = new HueError({
      type: response.status,
      message: (errorMatch ? errorMatch[1] : response.data) || 'Error',
      description: errorDescriptionMatch ? errorDescriptionMatch[1] : undefined,
      address: response.config?.url,
    });
  } else {
    hueError = new HueError({
      type: response.status,
      message: response.data || 'Error',
      address: response.config?.url,
    });
  }

  return new ApiError(hueError);
}